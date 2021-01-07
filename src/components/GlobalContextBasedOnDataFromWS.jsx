import React, { Component } from "react";
import getCookie from "../tools/getCookie";
class SelfHealingWebSocket {
    constructor( allMessagesHandler, ...initializationArgs ) {
        this.initializationArgs = initializationArgs;
        this.connection = null;
        this.allMessagesHandler = function ( event ) {
            const data = JSON.parse( event.data );
            allMessagesHandler( data );
        };
        this.respawnWebSocket();
    }
    closeEL = event => {
        console.log( "[close] Соединение закрыто. Отчёт: ", event );
        setTimeout( this.respawnWebSocket, 3000 );
        // TODO: Добавить нарастающую задержку перед следующим переподключением
    };
    errorEL = function ( error ) {
        console.error( "[error] Ошибка! Отчёт: " );
        console.log( error );
    };
    messageEL = function( event ) {
        console.log( "[message] Сервер отправил сообщение. Отчёт: ", event );
        const data = JSON.parse( event.data );
        console.log( "[message] Данные: ", data );
    };
    openEL = function() {
        console.log( "[open] Соединение установлено" );
    };
    respawnWebSocket = () => {
        this.connection = null;
        // @ts-ignore
        this.connection = new WebSocket( ...this.initializationArgs );
        this.connection.addEventListener( "error", this.errorEL );
        this.connection.addEventListener( "open", this.openEL );
        this.connection.addEventListener( "message", this.messageEL );
        this.connection.addEventListener( "message", this.allMessagesHandler );
        this.connection.addEventListener( "close", this.closeEL );
    };
    isAvailable = () => this.connection?.readyState === 1;
    sendRaw = data => {
        console.log( "data: ", data );
        if( this.isAvailable() ) {
            this.connection.send( data );
        } else {
            alert( "Соединение с сервером не установлено." );
        }
    };
    send = data => this.sendRaw( JSON.stringify( data ) );
}

export const GlobalContext = React.createContext( {
    isAuthorized: false,
    fullName: "",
    authorizationActions: {
        logout: () => {},
        register: () => {},
        login: () => {}
    },
    isAuthInProcess: false,
    isRegistrationAllowed: false,
    config: {
        processes: [],
        sensors: []
    },
    processesStates: {},
    records: [],
    sendRawQuery: () => {},
    isFarmConnected: null,
});

class GlobalContextBasedOnDataFromWS extends Component {
    state = {
        isAuthInProcess: false,
        isLogoutInProcess: false,
        isRegistrationAllowed: JSON.parse( getCookie( "isRegistrationAllowed" ) ),
        isAuthorized: false,
        fullName: "",
        config: {
            processes: [],
            sensors: []
        },
        processesStates: {},
        records: [],
        isFarmConnected: null,
    }
    constructor( props ) {
        super( props );
        if ( this.isAuthSessionChanged() ) {
            localStorage.setItem( "isAuthorized", "false" );
            localStorage.setItem( "fullName", "" );
        } else {
            this.state.isAuthorized = localStorage.getItem( "isAuthorized" ) === "true" || false;
            this.state.fullName = localStorage.getItem( "fullName" ) || "";
        }
        this.ws = null;
    }
    componentDidMount() {
        const loc = document.location;
        const protocol = (loc.protocol[4] === "s" ? "wss://": "ws://");
        const WSAdress = protocol + (loc.port === "3001" ? loc.hostname + ":3000" : loc.host);
        this.ws = new SelfHealingWebSocket( this.messageParser, WSAdress );
    }
    messageParser = data => {
        // eslint-disable-next-line default-case
        switch ( data.class ) {
            case "configPackage":
                this.setState( prevState => {
                    prevState.config = data.package;
                    return prevState;
                } );
                break;
            case "activitySyncPackage":
                this.setState( prevState => {
                    prevState.processesStates = data.package;
                    return prevState;
                } );
                break;
            case "recordsPackage":
                this.setState( prevState => {
                    prevState.records = data.package;
                    return prevState;
                } );
                break;
            case "event":
                this.setState( prevState => {
                    prevState.processesStates[ data.process ] = data.isActive;
                    return prevState;
                } );
                break;
            case "loginAsUser":
            case "registerAsUser":
                this.setState( {
                    isAuthInProcess: false
                } );
                if ( data.report.isError ) {
                    alert( data.report.errorField + "   " + data.report.info );
                    return;
                }
                localStorage.setItem( "isAuthorized", "true" );
                localStorage.setItem( "fullName", data.reply.fullName );
                this.setState( {
                    isAuthorized: true,
                    fullName: data.reply.fullName,
                    isRegistrationAllowed: false
                } );
                break;
            case "logout":
                localStorage.setItem( "isAuthorized", "" + false );
                localStorage.setItem( "fullName", "" );
                this.setState( {
                    isAuthorized: false,
                    fullName: "",
                    isLogoutInProcess: false
                } );
                break;
            case "error":
                alert( "Ошибка, сообщите программисту этот текст: " + data.message );
                break;
            case "warning":
                break;
            case "records":
                break;
            case "farmState":
                this.setState( {
                    isFarmConnected: data.isFarmConnected
                } );
                break;
            default:
                alert( "Пришло нечто неожиданное, сообщите программисту этот текст: " + JSON.stringify( data ) );
        }
    };
    isAuthSessionChanged = () => false && ( localStorage.getItem( "connect.sid" ) !== getCookie( "connect.sid" ) );
    logout = () => {
        // запрос на выход чтобы сервер стёр сессию
        if ( this.state.isLogoutInProcess || this.state.isAuthInProcess ) return;
        this.ws.send( { class : "logout" } );
        this.setState( {
            isLogoutInProcess: true
        } );
    };
    authorize = query => {
        if ( this.state.isLogoutInProcess || this.state.isAuthInProcess ) return;
        this.ws.send( query );
        this.setState( {
            isAuthInProcess: true
        } );
    };
    login = ( email, password ) => this.authorize(
        {
            class: "loginAsUser",
            email,
            password,
        }
    );
    register = ( email, password, confirmPassword, fullName ) => this.authorize(
        {
            class: "registerAsUser",
            email,
            password,
            confirmPassword,
            fullName
        }
    );
    authorizationActions = {
        logout: this.logout,
        register: this.register,
        login: this.login
    };
    sendRawQuery = JSONString => this.ws && this.ws.sendRaw( JSONString );
    render() {
        return (
            <GlobalContext.Provider
                value={ {
                    ...this.state,
                    authorizationActions: this.authorizationActions,
                    sendRawQuery: this.sendRawQuery
                } }
                children={ this.props.children }
            />
        );
    }
}

export default GlobalContextBasedOnDataFromWS;
