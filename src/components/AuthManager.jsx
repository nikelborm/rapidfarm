import React, { Component } from "react";
import getCookie from "../tools/getCookie";
import loader from "../tools/loader";
import { addMessageListener, isSocketAvailable, WSConnection } from "../tools/SocketManager";
export let isRegistrationAllowed = () => JSON.parse( getCookie( "isRegistrationAllowed" ) );

export const AuthContext = React.createContext( {
    isAuthorized: false,
    fullName: "",
    logout: async () => {},
    register: async () => {},
    login: async () => {}
});
class AuthProvider extends Component {
    constructor( props ) {
        super( props );
        if ( this.isAuthSessionChanged() ) {
            this.state = {
                isAuthorized: false,
                fullName: "",
            }
            this.updateAuthStatus( "false", "" );
        } else {
            this.state = {
                isAuthorized: localStorage.getItem( "isAuthorized" ) === "true" || false,
                fullName: localStorage.getItem( "fullName" ) || "",
            }
        }
        this.registerRejecter = null;
        this.registerResolver = null;
        this.loginRejecter = null;
        this.loginResolver = null;

        addMessageListener( this.loginListener );
        addMessageListener( this.registerListener );
    }
    onSuccessAuthorization = (data) => {
        this.updateAuthState( {
            isAuthorized: true,
            fullName: data.reply.fullName
        } );
        isRegistrationAllowed = () => false;
    };
    loginListener = data => {
        console.log('AuthProvider messageListener data: ', data);
        if ( data.class !== "loginAsUser" ) return;
        if ( data.report.isError ) {
            this.loginRejecter();
        } else {
            this.loginResolver();
            this.onSuccessAuthorization(data);
        }
    };
    registerListener = data => {
        console.log('AuthProvider messageListener data: ', data);
        if ( data.class !== "registerAsUser" ) return;
        if ( data.report.isError ) {
            this.registerRejecter();
        } else {
            this.registerResolver();
            this.onSuccessAuthorization(data);
        }
    };
    updateAuthState = ( { isAuthorized, fullName } ) => {
        this.updateAuthStatus( isAuthorized, fullName );
        this.setState( {
            isAuthorized,
            fullName
        } );
    }
    updateAuthStatus = ( isAuthorized, fullName ) => {
        localStorage.setItem( "isAuthorized", "" + isAuthorized );
        localStorage.setItem( "fullName", fullName );
    }
    isAuthSessionChanged = () => false && ( localStorage.getItem( "connect.sid" ) !== getCookie( "connect.sid" ) );
    logout = async () => {
        // запрос на выход чтобы сервер стёр сессию
        this.sendToWS( { class : "logout" } );
        this.updateAuthState( {
            isAuthorized: false,
            fullName: ""
        } );
    }
    sendToWS = body => {
        console.log( "body: ", body );
        if( isSocketAvailable() ) {
            WSConnection.send( JSON.stringify( body ) );
        } else {
            alert( "Соединение потеряно" );
        }
    }
    login = async ( email, password ) => {
        const body = {
            class: "loginAsUser",
            email,
            password,
        };
        this.sendToWS( body );
        this.loginRejecter = Promise.reject;
        this.loginResolver = Promise.resolve;
    }
    register = async ( email, password, confirmPassword, fullName ) => {
        const body = {
            class: "registerAsUser",
            email,
            password,
            confirmPassword,
            fullName
        };
        this.sendToWS( body );
        this.registerRejecter = Promise.reject;
        this.registerResolver = Promise.resolve;
    }
    render() {
        return (
            <AuthContext.Provider
                value={ {
                    ...this.state,
                    logout: this.logout,
                    register: this.register,
                    login: this.login,
                } }
                children={ this.props.children }
            />
        );
    }
}

export default AuthProvider;
