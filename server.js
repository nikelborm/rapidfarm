/* eslint-disable default-case */
const express = require("express");
const mongodb = require("mongodb");
const favicon = require("express-favicon");
const bodyParser = require("body-parser");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
const redis = require("redis");
const http = require("http");
const WebSocket = require("ws"); // jshint ignore:line
const path = require("path");
const sha256 = require("sha256");

function createEmptyResponseData( handlerType ) {
    // * Создаёт базовый объект ответа на запрос
    const resdata = {
        ...(handlerType ? { handlerType } : {}),
        report: {
            isError: true,
            info: ""
        },
        reply: {}
    };
    return { resdata, rp: resdata.report };
}

const port = parseInt(process.env.PORT, 10) || 3000;
const mongoLink = process.env.MONGODB_URI || "mongodb://Admin:0000@localhost:27017/admin";
const redisLink = process.env.REDIS_URL || "redis://admin:foobared@127.0.0.1:6379";
const isRegistrationAllowed = !!process.env.IS_REGISTRATION_ALLOWED;
const sessionSecretKey = process.env.SESSION_SECRET || "wHaTeVeR123";
const cookieSecretKey = process.env.COOKIE_SECRET || "wHaTeVeR123";
const farmSecrets = JSON.parse(process.env.FARM_SECRETS || `{
    "ec5d48de1fea693990a7f5eebd52c632c744d473d595d0eb883e55b7dec14327" : "Лондонская ферма",
    "d8a928b2043db77e340b523547bf16cb4aa483f0645fe0a290ed1f20aab76257" : "Команда 2"
}`);
// sha256("spbgos5QpJkp4ghuDtKH7g1FF8M7jsW46qieRR3ZLsjRp3h2LOWbl46Mn99z4DZI"); =="ccd01e70db4df3506e98a6532a73095a83dbf0d8a1029d210fb212cfae4d230c"

let dbClient;
let users = {};
let mainFarm;
let sensorsLogs = {};
let webCommandsLogs = {};
let farmActivity = {};
let farmConfigs = {};

const app = express();
const redisClient = redis.createClient(redisLink);
const mongoClient = new mongodb.MongoClient(mongoLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const server = http.createServer(app);
const WSServer = new WebSocket.Server({
    server
});

app.use(cookieParser(cookieSecretKey));
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
    let { resdata, rp } = createEmptyResponseData("loginAsFarm");

    if ( typeof secret !== "string" || secret.length !== 64 ) {
        rp.info = "Некорректный формат ключа";
    } else if ( typeof name !== "string" || !name.length ) {
        rp.info = "У фермы нет имени";
    } else if ( sha256( secret ) in farmSecrets === false ) {
        rp.info = "Ферма не зарегистрирована";
    } else {
        connection.isAuthAsFarm = true;
        connection.name = name;
        rp.isError = false;
        rp.info = "Успешная авторизация";
    }
    return resdata;
};

async function loginAsUser(connection, body) {
    const { email, password } = body;
    let { resdata, rp } = createEmptyResponseData("loginAsUser");

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
            fullName: userSearchResult.fullName
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
    let { resdata, rp } = createEmptyResponseData("registerAsUser");
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
        errorField = "passwordRegister";
    }
    else if (password.length > 40) {
        info = "Длина пароля должна быть до 40 символов";
        errorField = "passwordRegister";
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
            rp.info = "Эта почта занята. Если вы владелец, попробуйте <a href='/restore' style='color: #FFFFFF;'>восстановить аккаунт</a>.";
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
        rp.isError = false;
        rp.info = "Регистрация успешна";
    } catch (err) {
        console.log("err: ", err);
        rp.info = "Ошибка сервера";
    }
    return resdata;
}

function sendMessage(connection, message) {
    connection.send(JSON.stringify(message));
}
function closeWsConnection( connection, reason ) {
    let { resdata, rp } = createEmptyResponseData();
    rp.info = reason;
    // Не вырубать, а просто деавторизовать как-то
    sendMessage(connection, resdata);
    connection.terminate();
}
function setMainFarm( name ) {

}
function sendToMainFarm() {

}
function sendToUsers( message ) {
    //* Отправляет сообщение онлайн пользователям
    for (const client of WSServer.clients) {
        if ( !client.isAuthAsFarm ) {
            sendMessage(client, message);
        }
    }
}
function logSession( event, sid, session ) {
    console.log(event+" : sid("+sid+"): isAuthAsFarm, name, isAuthAsUser, authInfo -> ", session.isAuthAsFarm, session.name, session.isAuthAsUser, session.authInfo );
}
function sendActivityPackage( connection ) {
    sendMessage(connection, { class: "activitySyncPackage", package: farmActivity });
}
function sendError( connection, message ) {
    sendMessage(connection, {class:"error", message});
}
async function targetError(connection, body) {
    const { resdata } = createEmptyResponseData("targetError");
    resdata.report.info = "Некорректный запрос";
    return resdata;
}
function handlerSwitcher( type ) {
    switch (type) {
        case "loginAsFarm":
            return loginAsFarm;
        case "loginAsUser":
            return loginAsUser;
        case "registerAsUser":
            return registerAsUser;
        default:
            return targetError;
    }
}
WSServer.on("connection", (connection, request) => {
    connection.isAlive = true;
    connection.on("pong", () => {
        connection.isAlive = true;
    });
    const authorizationStep = async (data) => {
        connection.send(
            JSON.stringify(
                await handlerSwitcher( data.class )( connection, data )
            )
        );
        if (connection.isAuthAsFarm) {
            if ( !mainFarm ) mainFarm = connection;
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
        const data = JSON.parse(input.toString());
        //* Пользовательские запросы которые можно обработать и без авторизации
        // { "class": "execute", "what": "workWithFarm", name: "asdasdasd"  }
        // if ( data.class === "execute" && data.what === "workWithFarm" ) {
        // }
        switch ( data.class ) {
            case "get":
                switch ( data.what ) {
                    case "activitySyncPackage":
                        sendActivityPackage( connection );
                        break;
                    default:
                        sendError(connection, `Обработчика what для ${data.what} не существует`);
                }
                break;
            default:
                break;
        }
    };
    const farmQueriesHandler = (input) => {
        const data = JSON.parse(input.toString());
        console.log("Пришло в ws: ", data);
        switch ( data.class ) {
            case "event":
                // просто переслать всем онлайн пользователям
                // if ( connection.name === mainFarm.name ) sendToUsers(data); // и ещё имя фермы
                sendToUsers( data );
                farmActivity[ data.process ] = data.isActive;
                break;
            case "warning":
                // переслать всем онлайн пользователям и уведомить их ещё как-то (по почте, через пуш уведомления, в слак, в вк, в телегу, в дискорд)
                // if ( connection.name === mainFarm.name ) sendToUsers(data);
                sendToUsers(data);
                break;
            case "records":
                // переслать всем онлайн пользователям и сохранить в бд с датой
                // if ( connection.name === mainFarm.name ) sendToUsers(data);
                sendToUsers(data);
                sensorsLogs.insertOne({
                    sensor: data.sensor,
                    value: data.value,
                    date: new Date(),
                    farmName: connection.name
                });
                break;
            case "activitySyncPackage":
                farmActivity = data.package;
                sendToUsers({ class: "activitySyncPackage", package: farmActivity });
                break;
            default:
                break;
        }
    };
    const userQueriesHandler = (input) => {
        const data = JSON.parse(input.toString());
        switch ( data.class ) {
            case "set":
                switch ( data.what ) {
                    case "processTimings":
                        break;
                    case "todayProcessTimings":
                        break;
                    case "config":
                        break;
                    default:
                        sendError(connection, `Обработчика what для ${data.what} не существует`);
                }
                break;
            case "execute":
                switch ( data.what ) {
                    case "shutDownFarm":
                        break;
                    case "workWithFarm":
                        break;
                    case "addNewFarm":
                        break;
                    default:
                        sendError(connection, `Обработчика what для ${data.what} не существует`);
                }
                break;
            default:
                break;
        }
    };
    const logout = (input) => {
        const data = JSON.parse(input.toString());
        if (data.class !== "logout") return;
        if (connection.isAuthAsFarm) {
            if ( mainFarm === connection ) mainFarm = null;
            connection.isAuthAsFarm = false;
            connection.name = "";
            connection.addListener("message", authorizationStep);
            connection.removeListener("message", farmQueriesHandler);
            connection.removeListener("message", logout);
        }
        if (connection.isAuthAsUser) {
            connection.isAuthAsUser = false;
            connection.authInfo = null;
            connection.addListener("message", authorizationStep);
            connection.removeListener("message", userQueriesHandler);
            connection.removeListener("message", logout);
        }
    };
    connection.addListener("message", authorizationStep);
    connection.addListener("message", publicQueriesHandler);
    if ( mainFarm ) {
        sendActivityPackage( connection );
    }
    // const cookies = cookie.parse(request.headers.cookie);
    // console.log("onconnection sid: ", sid);
    // connection.sid = sid;
});
const cleaner = setInterval(() => {
    // Проверка на то, оставлять ли соединение активным
    WSServer.clients.forEach((connection) => {
        // Если соединение мертво, завершить
        if (!connection.isAlive) {
            if (connection.isAuthAsFarm) {
                // TODO: Если отключилась ферма - уведомить всех по почте или как-то ещё, а то пиздец. Это либо отключение интернета либо электричества блять либо пожар нахуй и ферма горит либо залило водой плату или короткое замыкание от этого. Что бы ни было причиной - это пиздец. А на ферме кстати нужно сделать чтобы автоподключение происходило
                mainFarm = null;
                for (const client of WSServer.clients) {
                    if ( client.isAuthAsFarm ) {
                        mainFarm = client;
                        break;
                    }
                }
            }
            logSession( "connection - cleaner terminate", connection.sid, connection );
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
    webCommandsLogs = client.db().collection("webCommandsLogs");
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
        console.log("WebSocket server closed.\n\nClosing Redis connection...");
        redisClient.quit((err) => {
            if (err) {console.log(err);haveErrors = true;}
            console.log("Redis connection closed.\n\nClosing MongoDb connection...");
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
    });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
