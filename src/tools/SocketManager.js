const loc = document.location;
const WSAdress = (loc.protocol[4] === "s" ? "wss://": "ws://") + (loc.port === "3001" ? loc.hostname + ":3000" : loc.host);
export let WSConnection = null;
export let isSocketAvailable = false;
const closeEL = event => {
    isSocketAvailable = false;
    console.log("[close] Соединение закрыто. Отчёт: ", event);
    WSConnection = null;
    // this.componentDidMount();
    setTimeout(createOrRespawnWebSocket, 3000);
    // TODO: Добавить нарастающую задержку перед следующим переподключением
};
const errorEL = function (error) {
    console.error("[error] Ошибка! Отчёт: ");
    console.log(error);
};
const messageEL = function( event ) {
    console.log("[message] Сервер отправил сообщение. Отчёт: ", event);
    const data = JSON.parse(event.data);
    console.log("[message] Данные: ", data);
};
const openEL = function() {
    isSocketAvailable = true;
    console.log("[open] Соединение установлено");
};
const createOrRespawnWebSocket = () => {
    WSConnection = new WebSocket(WSAdress);
    WSConnection.addEventListener( "open", openEL );
    WSConnection.addEventListener( "message", messageEL );
    WSConnection.addEventListener( "close", closeEL );
    WSConnection.addEventListener( "error", errorEL );
};

createOrRespawnWebSocket();
