import React, { Component } from "react";
import getCookie from "../tools/getCookie";
import loader from "../tools/loader";
export let isRegistrationAllowed = () => JSON.parse( getCookie( "isRegistrationAllowed" ) );

export const AuthContext = React.createContext( {
    isAuthorized: false,
    fullName: "",
    logout: async () => {},
    register: async () => {},
    login: async () => {}
});
class AuthProvider extends Component {
    constructor(props) {
        super(props);
        if ( this.isAuthSessionChanged() ) {
            this.state = {
                isAuthorized: false,
                fullName: "",
            }
            this.updateAuthStatus("false", "");
        } else {
            this.state = {
                isAuthorized: localStorage.getItem( "isAuthorized" ) === "true" || false,
                fullName: localStorage.getItem( "fullName" ) || "",
            }
        }
    }
    updateAuthState = ( { isAuthorized, fullName } ) => {
        this.updateAuthStatus( isAuthorized, fullName );
        this.setState( {
            isAuthorized,
            fullName
        } );
    }
    updateAuthStatus = (isAuthorized, fullName) => {
        localStorage.setItem( "isAuthorized", ""+isAuthorized);
        localStorage.setItem( "fullName", fullName);
    }
    setAuthorizedAuthState = (fullName) => {
        this.updateAuthState( {
            isAuthorized: true,
            fullName
        } );
    }
    isAuthSessionChanged = () => localStorage.getItem( "connect.sid" ) !== getCookie( "connect.sid" );
    logout = async () => {
        // запрос на выход чтобы сервер стёр сессию
        await loader( {}, "/logout" );
        this.updateAuthState( {
            isAuthorized: false,
            fullName: ""
        } );
    }
    login = async ( email, password ) => {
        // Запрос на авторизацию
        console.log( "email, password: ", email, password );
        const body = {
            email,
            password,
        };
        const { reply } = await loader( body, "/loginAsUser" );
        // Если всё проходит успешно:
        this.setAuthorizedAuthState( reply.fullName );
        isRegistrationAllowed = () => false;
    }
    register = async ( email, password, confirmPassword, fullName ) => {
        console.log( "email, password, confirmPassword, fullName: ", email, password, confirmPassword, fullName );
        const body = {
            email,
            password,
            confirmPassword,
            fullName
        };
        await loader( body, "/registerAsUser" );
        // Если всё проходит успешно:
        this.setAuthorizedAuthState(fullName);
        isRegistrationAllowed = () => false;
    }
    componentWillUnmount() {
        this.logout();
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
