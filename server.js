/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
const express = require("express");
const mongodb = require("mongodb");
const favicon = require("express-favicon");
const cookieParser = require("cookie-parser");
const http = require("http");
const WebSocket = require("ws"); // jshint ignore:line
const path = require("path");
const sha256 = require("sha256");

function createEmptyResponseData() {
    // * Создаёт базовый объект ответа на запрос
    const resdata = {
        report: {
            isError: true,
            info: ""
        },
        reply: {}
    };
    return { resdata, rp: resdata.report };
}

const port = parseInt( process.env.PORT, 10 ) || 3000;
const mongoLink = process.env.MONGODB_URI || "mongodb://Admin:0000@localhost:27017/admin";
const isRegistrationAllowed = !!process.env.IS_REGISTRATION_ALLOWED;
const farmSecrets = JSON.parse(process.env.FARM_SECRETS || `{}`);

let dbClient;
let farmConnection = null;
let cachedProcessStates = {};
let cachedConfig = {
    processes: [],
    sensors: []
};
let users = {}; // collection
let sensorsLogs = {}; // collection
let webCommandsLogs = {}; // collection
let farmConfigs = {}; // collection

const app = express();
const mongoClient = new mongodb.MongoClient(mongoLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const server = http.createServer(app);
const WSServer = new WebSocket.Server({
    server
});

app.use(cookieParser());
app.use(favicon(__dirname + "/build/favicon.ico"));

app.use(function(request, response, next){
    response.cookie("isRegistrationAllowed", isRegistrationAllowed);
    next();
});
app.use(express.static(path.join(__dirname, "build")));
app.get("/*", (request, response) => {
    response.sendFile(path.join(__dirname, "build", "index.html"));
});


async function loginAsFarm(connection, body) {
    const { secret, name } = body;
    let { resdata, rp } = createEmptyResponseData();

    if ( typeof secret !== "string" || secret.length !== 64 ) {
        rp.info = "Некорректный формат ключа";
    } else if ( typeof name !== "string" || !name.length ) {
        rp.info = "У фермы нет имени";
    } else if ( sha256( secret ) in farmSecrets === false ) {
        rp.info = "Ферма не зарегистрирована";
    } else {
        connection.isAuthAsFarm = true;
        connection.name = name;
        farmSecrets[ sha256( secret ) ] = name;
        rp.isError = false;
        rp.info = "Успешная авторизация";
    }
    return resdata;
};

async function loginAsUser(connection, body) {
    const { email, password } = body;
    let { resdata, rp } = createEmptyResponseData();

    rp.errorField = !email ? "email" : !password ? "password" : "";
    rp.info = !email ? "Вы не ввели почту" : !password ? "Вы не ввели пароль" : "";

    if (rp.info) return resdata;
    try {
        const userSearchResult = await users.findOne({ email });
        if (!userSearchResult) {
            rp.errorField = "email";
            rp.info = "Пользователь с указанной почтой не найден";
            return resdata;
        }
        if (userSearchResult.password !== sha256(password)) {
            rp.errorField = "password";
            rp.info = "Неверный пароль";
            return resdata;
        }

        connection.authInfo = userSearchResult;
        connection.isAuthAsUser = true;
        resdata.reply = {
            fullName: userSearchResult.fullName,
            password,
            email,
        };
        rp.isError = false;
        rp.info = "Успешная авторизация";
    } catch (err) {
        console.log(err);
        rp.info = "Ошибка сервера";
    }
    return resdata;
};

async function registerAsUser(connection, body) {
    let { resdata, rp } = createEmptyResponseData();
    if ( !isRegistrationAllowed ) {
        rp.info = "Регистрация запрещена"
        return resdata;
    }
    const { password, confirmPassword, fullName, email } = body;
    rp.errorField = !email ? "email" : !password ? "password" : !fullName ? "fullName" : "";
    rp.info = !email ? "Вы не ввели почту" : !password ? "Вы не ввели пароль" : !fullName ? "Вы не ввели ваше имя" : "";

    if (rp.info) return resdata;
    let info = "", errorField = "";

    if (password.length < 8) {
        info = "Длина пароля должна быть от 8 символов";
        errorField = "password";
    }
    else if (password.length > 40) {
        info = "Длина пароля должна быть до 40 символов";
        errorField = "password";
    }
    else if (confirmPassword !== password) {
        info = "Пароли не совпадают";
        errorField = "confirmPassword";
    }

    rp.errorField = errorField;
    rp.info = info;

    if (rp.info) return resdata;
    try {
        const userSearchResult = await users.findOne({ email });
        if ( userSearchResult ) {
            rp.errorField = "email";
            rp.info = "Эта почта занята. Если вы владелец, попробуйте обратиться к администратору.";
            return resdata;
        }
        const userProfile = {
            password: sha256(password),
            email,
            fullName
        };
        const insertationResult = await users.insertOne(userProfile);
        connection.isAuthAsUser = true;
        connection.authInfo = insertationResult.ops[0];
        resdata.reply = {
            fullName: insertationResult.ops[ 0 ].fullName,
            password: insertationResult.ops[ 0 ].password,
            email: insertationResult.ops[ 0 ].email,

        };
        rp.isError = false;
        rp.info = "Регистрация успешна";
    } catch (err) {
        console.log("err: ", err);
        rp.info = "Ошибка сервера";
    }
    return resdata;
}

function sendMessage( connection, message, nolog ) {
    nolog || console.log("send message to connection: ", message);
    connection.send(JSON.stringify(message));
}
function sendToUsers( message ) {
    //* Отправляет сообщение онлайн пользователям
    for (const client of WSServer.clients) {
        if ( !client.isAuthAsFarm ) {
            sendMessage(client, message);
        }
    }
}
function logProfile( event, WSclient ) {
    console.log(
        event + " : isAuthAsFarm, name, isAuthAsUser, authInfo -> ",
        WSclient.isAuthAsFarm,  WSclient.name,  WSclient.isAuthAsUser,  WSclient.authInfo
    );
}
function sendActivityPackage( connection ) {
    sendMessage( connection, { class: "activitySyncPackage", package: cachedProcessStates } );
}
function sendFarmState( connection ) {
    sendMessage( connection, { class: "farmState", isFarmConnected: !!farmConnection } );
}
function newFarmStateNotifier() {
    sendToUsers( { class: "farmState", isFarmConnected: !!farmConnection } );
}
function sendConfigPackage( connection ) {
    sendMessage( connection, { class: "configPackage", package: cachedConfig } );
}
function sendRecordsPackage( connection ) {
    let pkg = [];
    sensorsLogs.find(
        {/* искать записи, где дата больше дня, который был месяц назад */}, {projection: { _id: 0 }}
    ).limit( 20 ).forEach(
        (doc) => {
            pkg.push( doc );
        },
        function (err) {
            if (err) {
                console.log(err);
                sendError( connection, "Произошла ошибка при загрузке пакета с показаниями датчиков" );
            } else {
                sendMessage( connection, { class: "recordsPackage", package: pkg }, true );
            }
        }
    );
}
function sendNewestRecordsPackage( connection ) {
    const querys = [];
    cachedConfig.sensors.forEach(
        sensor => sensor.isConnected && querys.push( new Promise( ( resolve, reject ) => {
            let oneLog;
            sensorsLogs.find(
                { sensor: sensor.long }, { projection: { farmName: 0 }}
            ).sort( { _id: -1 } ).limit( 1 ).forEach(
                doc => oneLog = doc,
                function (err) {
                    if (err) {
                        reject( err );
                    } else {
                        resolve( oneLog );
                    }
                }
            );
        } ) )
    );
    Promise.all( querys ).then( pkg => {
        sendMessage( connection, { class: "newestRecordsPackage", package: pkg } );
    }).catch( err => {
        console.log(err);
        sendError( connection, "Произошла ошибка при загрузке пакета с последними показаниями датчиков" );
    });
}
function sendExactSensorRecordsPackage( connection, sensor ) {
    // sensorsLogs.find({/* где дата больше дня, который месяц назад */})
    // .forEach(
    //     (doc) => {
    //         console.log("doc: ", doc);
    //     },
    //     function (err) {
    //         if (err) {
    //             console.log(err);
    //             rp.info = err;
    //         } else {
    //             resdata.reply = { room, results };
    //             rp.isError = false;
    //             rp.info = "Данные успешно загружены";
    //         }
    //         connection.send(JSON.stringify(resdata));
    //     }
    // );
    // sendMessage( connection, { class: "recordsPackage", package } );
}
function sendError( connection, message ) {
    sendMessage( connection, { class: "error", message } );
}
async function targetError( connection, body ) {
    return { class: "error", message: "Некорректный запрос" };
}
async function authError( connection, body ) {
    return { class: "error", message: "Вы не авторизованы, попробуйти выйти/зайти в аккаунт и повторить" };
}
function handlerSwitcher( type ) {
    switch (type) {
        case "loginAsFarm":
            return loginAsFarm;
        case "loginAsUser":
            return loginAsUser;
        case "registerAsUser":
            return registerAsUser;
        case "set":
        case "execute":
            return authError;
        default:
            return targetError;
    }
}
function prepare(input) {
    return JSON.parse(input.toString());
}
WSServer.on("connection", (connection, request) => {
    connection.isAlive = true;
    connection.on( "pong", () => {
        connection.isAlive = true;
    } );
    const authorizationStep = async (input) => {
        const data = prepare( input );
        if ( data.class === "logout" ) return;
        if(!["loginAsFarm","loginAsUser","registerAsUser","set","execute"].includes( data.class )) return;
        sendMessage(connection, {
            class: data.class,
            ...(await handlerSwitcher( data.class )( connection, data )),
        });
        if (connection.isAuthAsFarm) {
            // if ( !farmConnection ) farmConnection = connection;
            // Потому что если новое соединение с фермой установилось до того, как старое порвалось, надо установить новое
            farmConnection = connection;
            // TODO: connection.addEventListener("close")
            // Потому что cleaner обрабатывает только случайные обрывы связи
            newFarmStateNotifier();
            connection.removeListener("message", authorizationStep);
            connection.addListener("message", farmQueriesHandler);
            connection.addListener("message", logout);
        }
        if (connection.isAuthAsUser) {
            connection.removeListener("message", authorizationStep);
            connection.addListener("message", userQueriesHandler);
            connection.addListener("message", logout);
        }
    }
    const publicQueriesHandler = (input) => {
        // TODO: Подумать над обработкой и защитой от ошибок в JSON.parse
        const data = prepare( input );
        //* Пользовательские запросы которые можно обработать и без авторизации
        if ( data.class !== "get" ) return;
        switch ( data.what ) {
            case "activitySyncPackage":
                sendActivityPackage( connection );
                break;
            case "configPackage":
                sendConfigPackage( connection );
                break;
            case "recordsPackage":
                // sendRecordsPackage( connection );
                sendNewestRecordsPackage( connection );
                break;
            case "exactSensorRecordsPackage":
                sendExactSensorRecordsPackage( connection, data.sensor );
                break;
            case "newestRecordsPackage":
                sendNewestRecordsPackage( connection );
                break;
            default:
                sendError(connection, `Обработчика what (${data.what}) для class (${data.class}) не существует`);
        }
    };
    const farmQueriesHandler = (input) => {
        const data = prepare( input );
        switch ( data.class ) {
            case "event":
                // просто переслать всем онлайн пользователям
                sendToUsers( data );
                cachedProcessStates[ data.process ] = data.isActive;
                break;
            case "warning":
                // переслать всем онлайн пользователям и уведомить их ещё как-то
                // по почте, через пуш уведомления, в слак, в вк, в телегу, в дискорд
                break; // records по действиям похожи
            case "records":
                // переслать всем онлайн пользователям и сохранить в бд с датой
                const log = {
                    sensor: data.sensor,
                    value: data.value,
                    date: new Date()
                };
                sendToUsers( { ...log, class: "records" } );
                sensorsLogs.insertOne( log );
                break;
            case "activitySyncPackage":
                cachedProcessStates = data.package;
                sendToUsers({ class: "activitySyncPackage", package: cachedProcessStates });
                break;
            case "configPackage":
                cachedConfig = data.package;
                sendToUsers({ class: "configPackage", package: cachedConfig });
                break;
            default:
                break;
        }
    };
    const userQueriesHandler = (input) => {
        const data = prepare( input );
        switch ( data.class ) {
            case "set":
                switch ( data.what ) {
                    case "timings":
                        // А, если нет соединения, то добавить в очередь отложенных запросов к ферме
                        sendToUsers( {
                            class : "timings",
                            process: data.process,
                            timings: data.timings
                        } );
                        !!farmConnection && sendMessage( farmConnection, data );
                        for ( const proc of cachedConfig.processes ) {
                            if ( proc.long === data.process ) {
                                proc.timings = data.timings;
                                break;
                            }
                        }
                        break;
                    case "criticalBorders":
                        sendToUsers( {
                            class : "criticalBorders",
                            sensor: data.sensor,
                            criticalBorders: data.criticalBorders
                        } );
                        !!farmConnection && sendMessage( farmConnection, data );
                        for ( const sensor of cachedConfig.sensors ) {
                            if ( sensor.long === data.sensor ) {
                                sensor.criticalBorders = data.criticalBorders;
                                break;
                            }
                        }
                        break;
                    case "config":
                        sendToUsers( data );
                        !!farmConnection && sendMessage( farmConnection, data );
                        cachedConfig = data.config;
                        break;
                    default:
                        sendError(connection, `Обработчика what (${data.what}) для class (${data.class}) не существует`);
                }
                break;
            // case "execute":
            //     switch ( data.what ) {
            //         case "bashCommand":
            //             sendToFarm( connection, input );
            //             break;
            //         default:
            //             sendError(connection, `Обработчика what (${data.what}) для class (${data.class}) не существует`);
            //     }
            //     break;
            default:
                break;
        }
    };
    const logout = (input) => {
        const data = prepare( input );
        if ( data.class !== "logout" ) return;
        if ( connection.isAuthAsFarm ) {
            farmConnection = null;
            newFarmStateNotifier();
            connection.isAuthAsFarm = false;
            connection.name = "";
            connection.addListener( "message", authorizationStep );
            connection.removeListener( "message", farmQueriesHandler );
        }
        if ( connection.isAuthAsUser ) {
            connection.isAuthAsUser = false;
            connection.authInfo = null;
            connection.addListener( "message", authorizationStep );
            connection.removeListener( "message", userQueriesHandler );
        }
        sendMessage( connection, { class: "logout" } );
    };
    connection.addListener("message", function (input) {
        console.log("Пришло в ws: ", prepare(input));
    });
    connection.addListener("message", authorizationStep);
    connection.addListener("message", publicQueriesHandler);
    sendFarmState( connection );
    if ( farmConnection ) {
        sendActivityPackage( connection );
        sendConfigPackage( connection );
        // sendRecordsPackage( connection );
        sendNewestRecordsPackage( connection );
    }
});
const cleaner = setInterval(() => {
    // Проверка на то, оставлять ли соединение активным
    WSServer.clients.forEach( connection => {
        // Если соединение мертво, завершить
        if (!connection.isAlive) {
            if (connection.isAuthAsFarm) {
                // TODO: Если отключилась ферма - уведомить всех по почте или как-то ещё, а то пиздец.
                // Это либо отключение интернета либо электричества блять либо пожар нахуй и ферма
                // горит либо залило водой плату или короткое замыкание от этого. Что бы ни было
                // причиной - это пиздец. А на ферме кстати нужно сделать чтобы автоподключение происходило
                farmConnection = null;
                newFarmStateNotifier();
                cachedConfig = {
                    processes: [],
                    sensors: []
                };
                cachedProcessStates = {};
            }
            logProfile( "connection - cleaner terminate", connection );
            return connection.terminate();
        }
        // обьявить все соединения мертвыми, а тех кто откликнется на ping, сделать живыми
        connection.isAlive = false;
        connection.ping(null, false);
    });
}, 10000);

mongoClient.connect((err, client) => {
    if (err) {
        console.log(err);
        return shutdown();
    }

    dbClient = client;
    users = client.db().collection("users");
    sensorsLogs = client.db().collection("sensorsLogs");
    // eslint-disable-next-line no-unused-vars
    webCommandsLogs = client.db().collection("webCommandsLogs");
    // eslint-disable-next-line no-unused-vars
    farmConfigs = client.db().collection("farmConfigs");
    server.listen(port, function(){
        console.log("Сервер слушает");
    });
});

function shutdown() {
    let haveErrors = false;
    console.log("Exiting...\n\nClosing WebSocket server...");
    clearInterval(cleaner);
    WSServer.close((err) => {
        if (err) {console.log(err);haveErrors = true;}
        console.log("WebSocket server closed.\n\nClosing MongoDb connection...");
        if (dbClient) {
            dbClient.close(false, (err) => {
                if (err) {console.log(err);haveErrors = true;}
                console.log("MongoDb connection closed.\n\nClosing http server...");
                if (server.listening) {
                    server.close((err) => {
                        if (err) {console.log(err);haveErrors = true;}
                        console.log("Http server closed.\n");
                        process.exit(~~haveErrors);
                    });
                } else {
                    console.log("Http server not started.\n");
                    process.exit(1);
                }
            });
        } else {
            console.log("MongoDb not started.\n\nClosing http server...\nHttp server not started.");
            process.exit(1);
        }
    });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
