const express = require("express");
const mongodb = require("mongodb");
const favicon = require("express-favicon");
const bodyParser = require("body-parser");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const redis = require("redis");
const RedisStorage = require("connect-redis")(session);
const http = require("http");
const WebSocket = require("ws"); // jshint ignore:line
const path = require("path");
const sha256 = require("sha256");

function createEmptyResponseData() {
    // * Создаёт базовый объект ответа на запрос
    const resdata = {
        handlerType: "logs",
        report: {
            isError: true,
            info: ""
        },
        reply: {}
    };
    return { resdata, rp: resdata.report };
}



const port = process.env.PORT || 3000;
const mongoLink = process.env.MONGODB_URI || "mongodb://myUserAdmin:0000@localhost:27017/admin";
const redisLink = process.env.REDIS_URL || "redis://admin:foobared@127.0.0.1:6379";
const secretKey = process.env.SECRET || "wHaTeVeR123";
const farmSecret = process.env.FARM_SECRET || "ec5d48de1fea693990a7f5eebd52c632c744d473d595d0eb883e55b7dec14327";


let dbClient;
let users = {};
let sensors = {};

const app = express();
const redisClient = redis.createClient(redisLink);
const store = new RedisStorage({
    client: redisClient
});
const mongoClient = new mongodb.MongoClient(mongoLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const server = http.createServer(app);
const WSServer = new WebSocket.Server({
    server
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// TODO: Проверять не слишком ли большие данные, чтобы долго их не обрабатывать
app.use(bodyParser.text());
app.use(session({
    store,
    secret: secretKey,
    resave: false,
    rolling: true,
    unset: "destroy",
    saveUninitialized: false
}));
app.use(cookieParser(secretKey));
app.use(favicon(__dirname + "/build/favicon.ico"));

function logout(request, response) {
    request.session.destroy((err) => {
        if (err)
            return console.log(err);
        response.redirect("/");
    });
}
app.use(express.static(path.join(__dirname, "build")));
app.get("/*", (request, response) => {
    response.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/logout", logout);

app.post("/loginAsFarm", function (request, response) {
    const { secret } = request.body;
    let { resdata, rp } = createEmptyResponseData();

    if ( secret?.length !== 64 ) {
        rp.info = "Incorrect key format";
        return response.json(resdata);
    }
    if( sha256(secret) !== farmSecret ) {
        rp.info = "Farm not registered";
    } else {
        request.session.isFarm = true;
        rp.isError = false;
        rp.info = "Success authorization";
    }
    response.json(resdata);
});

app.post("/loginAsUser", function (request, response) {
    const { email, password } = request.body;
    let { resdata, rp } = createEmptyResponseData();

    resdata.reply.errorField = !email ? "email" : !password ? "password" : "";
    rp.info = !email ? "Вы не ввели почту" : !password ? "Вы не ввели пароль" : "";

    if (rp.info) return response.json(resdata);

    users.findOne({ email })
    .then((result) => {
        if (!result) {
            resdata.reply.errorField = "email";
            rp.info = "Пользователь с указанной почтой не найден";
            return;
        }
        if (result.password !== sha256(password)) {
            resdata.reply.errorField = "password";
            rp.info = "Неверный пароль";
            return;
        }

        const { fullName } = request.session.authInfo = result;
        resdata.reply = { fullName };
        rp.isError = false;
        rp.info = "Успешная авторизация";
    }).catch((err) => {
        console.log(err);
        rp.info = err.message;
    }).finally(() => {
        response.json(resdata);
    });
});

app.post("/registerAsUser", function (request, response) {
    const { password, confirmPassword, fullName, email } = request.body;
    let { resdata, rp } = createEmptyResponseData();
    resdata.reply.errorField = !email ? "email" : !password ? "password" : !fullName ? "fullName" : "";
    rp.info = !email ? "Вы не ввели почту" : !password ? "Вы не ввели пароль" : !fullName ? "Вы не ввели ваше имя" : "";

    if (rp.info) return response.json(resdata);
    let errorField = "", info = "";

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

    resdata.reply.errorField = errorField;
    rp.info = info;

    if (rp.info) return response.json(resdata);

    users.findOne({ email })
    .then((result) => {
        const userProfile = {
            password: sha256(password),
            email,
            fullName
        };
        if (result.email === email) {
            resdata.reply.errorField = "email";
            throw new Error("Эта почта занята. Если вы владелец, попробуйте <a href='/restore' style='color: #FFFFFF;'>восстановить аккаунт</a>.");
        }
        return users.insertOne(userProfile); // Возвращаем промис
    }).then((result)=>{
        request.session.authInfo = result.ops[0];
        rp.isError = false;
        rp.info = "Регистрация успешна";
    }).catch((err) => {
        rp.info = err.message;
    }).finally(() => {
        response.json(resdata);
    });
});


WSServer.on("connection", (connection, request) => {
    connection.isAlive = true;
    connection.on("pong", () => {
        connection.isAlive = true;
    });
    const cookies = cookie.parse(request.headers.cookie);
    const sid = "" + cookieParser.signedCookie(cookies["connect.sid"], secretKey);
    // TODO: Подумать над тем, что сообщение может начать обрабатываться до то того как редис вернёт запись для валидации
    store.get(sid, (err, session) => {
        if (err) console.log(err);

        if (!session || !session.authInfo || err) {
            let { resdata, rp } = createEmptyResponseData();
            rp.info = "Вы не авторизованы!";
            connection.send(JSON.stringify(resdata));
            connection.terminate();
        } else {
            connection.authInfo = session.authInfo;
            connection.on("message", async (input) => {
                // const { authInfo } = connection;
                // TODO: Проверять не слишком ли большие данные, чтобы долго их не обрабатывать
                console.log('Пришло в ws: ', JSON.parse(input.toString()));
                // if (rp.info) return connection.send(JSON.stringify(resdata));
            });
        }
    });
});
const cleaner = setInterval(() => {
    // Проверка на то, оставлять ли соединение активным
    WSServer.clients.forEach((connection) => {
        // Если соединение мертво, завершить
        if (!connection.isAlive) {
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
    // sensors = client.db().collection("sensors");
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
            console.log('Redis connection closed.\n\nClosing MongoDb connection...');
            if (dbClient) {
                dbClient.close(false, (err) => {
                    if (err) {console.log(err);haveErrors = true;}
                    console.log('MongoDb connection closed.\n\nClosing http server...');
                    if (server.listening) {
                        server.close((err) => {
                            if (err) {console.log(err);haveErrors = true;}
                            console.log('Http server closed.\n');
                            process.exit(~~haveErrors);
                        });
                    } else {
                        console.log('Http server not started.\n');
                        process.exit(1);
                    }
                });
            } else {
                console.log('MongoDb not started.\n\nClosing http server...\nHttp server not started.');
                process.exit(1);
            }
        });
    });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
