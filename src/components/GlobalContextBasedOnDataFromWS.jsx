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
        this.connection = new WebSocket( this.initializationArgs );
        this.connection.addEventListener( "error", this.this.errorEL );
        this.connection.addEventListener( "open", this.openEL );
        this.connection.addEventListener( "message", this.messageEL );
        this.connection.addEventListener( "message", this.allMessagesHandler );
        this.connection.addEventListener( "close", this.closeEL );
    };
    isSocketAvailable = () => this.connection?.readyState === 1;
    send = data => {
        console.log( "data: ", data );
        if( this.isSocketAvailable() ) {
            this.connection.send( JSON.stringify( data ) );
        } else {
            alert( "Соединение с сервером не установлено." );
        }
    };
}


export const GlobalContext = React.createContext( {
    isAuthorized: false,
    fullName: "",
    authorizationActions: {
        logout: async () => {},
        register: async () => {},
        login: async () => {}
    },
    isAuthInProcess: false,
    isRegistrationAllowed: false,
    config: {
        processes: [],
        sensors: []
    },
    processesStates: {}
});

class GlobalContextBasedOnDataFromWS extends Component {
    state = {
        isAuthInProcess: false,
        isLogoutInProcess: false,
        isRegistrationAllowed: JSON.parse( getCookie( "isRegistrationAllowed" ) ),
        // isAuthorized: false,
        // fullName: "",
        config: {
            processes: [],
            sensors: []
        },
        processesStates: {},
    }
    constructor( props ) {
        super( props );
        if ( this.isAuthSessionChanged() ) {
            this.state.isAuthorized = false;
            this.state.fullName = "";
            const loc = document.location;
            const WSAdress = (loc.protocol[4] === "s" ? "wss://": "ws://") + (loc.port === "3001" ? loc.hostname + ":3000" : loc.host);

            this.ws = new SelfHealingWebSocket( this.messageParser, WSAdress );
            localStorage.setItem( "isAuthorized", "false" );
            localStorage.setItem( "fullName", "" );
        } else {
            this.state.isAuthorized = localStorage.getItem( "isAuthorized" ) === "true" || false;
            this.state.fullName = localStorage.getItem( "fullName" ) || "";
        }
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
            case "event":
                this.setState( prevState => {
                    prevState.processesStates[ data.process ] = data.isActive;
                    return prevState;
                } );
                break;
            case "loginAsUser":
                if ( data.report.isError ) {
                    this.loginRejecter();
                } else {
                    this.loginResolver();
                    this.onSuccessAuthorization(data);
                }
                break;
            case "registerAsUser":
                if ( data.report.isError ) {
                    this.registerRejecter();
                } else {
                    this.registerResolver();
                    this.onSuccessAuthorization(data);
                }
                break;
            case "logout":
                localStorage.setItem( "isAuthorized", "" + false );
                localStorage.setItem( "fullName", "" );
                this.setState( {
                    isAuthorized: false,
                    fullName: "",
                    isLogoutInProcess: false
                } );
        }
    };
    onSuccessAuthorization = (data) => {
        localStorage.setItem( "isAuthorized", "true" );
        localStorage.setItem( "fullName", data.reply.fullName );
        this.setState( {
            isAuthorized: true,
            fullName: data.reply.fullName,
            isRegistrationAllowed: false
        } );
    };
    isAuthSessionChanged = () => false && ( localStorage.getItem( "connect.sid" ) !== getCookie( "connect.sid" ) );
    logout = async () => {
        // запрос на выход чтобы сервер стёр сессию
        if ( this.state.isLogoutInProcess || this.state.isAuthInProcess ) return;
        this.ws.send( { class : "logout" } );
        this.setState( {
            isLogoutInProcess: true
        } );
    };
    login = ( email, password ) => new Promise( ( resolve, reject ) => {
        if ( this.state.isLogoutInProcess || this.state.isAuthInProcess ) return;
        this.ws.send( {
            class: "loginAsUser",
            email,
            password,
        } );
        this.loginRejecter = reject;
        this.loginResolver = resolve;
    });
    register = ( email, password, confirmPassword, fullName ) => new Promise( ( resolve, reject ) => {
        if ( this.state.isLogoutInProcess || this.state.isAuthInProcess ) return;
        this.ws.send( {
            class: "registerAsUser",
            email,
            password,
            confirmPassword,
            fullName
        } );
        this.registerRejecter = reject;
        this.registerResolver = resolve;
    });
    authorizationActions = {
        logout: this.logout,
        register: this.register,
        login: this.login
    };
    render() {
        return (
            <GlobalContext.Provider
                value={ {
                    ...this.state,
                    authorizationActions: this.authorizationActions
                } }
                children={ this.props.children }
            />
        );
    }
}

export default GlobalContextBasedOnDataFromWS;