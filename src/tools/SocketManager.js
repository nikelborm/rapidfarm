const loc = document.location;
const WSAdress = (loc.protocol[4] === "s" ? "wss://": "ws://") + (loc.port === "3001" ? loc.hostname + ":3000" : loc.host);
let customMessageListeners = new Set();

const closeEL = event => {
    console.log("[close] Соединение закрыто. Отчёт: ", event);
    WSConnection = null;
    // this.componentDidMount();
    setTimeout(createNewWebSocket, 3000);
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
    console.log("[open] Соединение установлено");
};
export const createNewWebSocket = () => {
    WSConnection = new WebSocket(WSAdress);
    WSConnection.addEventListener( "error", errorEL );
    WSConnection.addEventListener( "open", openEL );
    WSConnection.addEventListener( "message", messageEL );
    for ( const messageListener of customMessageListeners ) {
        WSConnection.addEventListener( "message", messageListener );
    }
    WSConnection.addEventListener( "close", closeEL );
};

export let WSConnection = null;
export const isSocketAvailable = () => WSConnection?.readyState === 1;
export const addMessageListener = newListener => {
    const improvedEventListener = event => {
        const data = JSON.parse(event.data);
        newListener(data);
    }
    customMessageListeners.add( improvedEventListener );
    if ( isSocketAvailable() ) {
        WSConnection.addEventListener( "message", improvedEventListener );
    }
};
