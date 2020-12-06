import React, { Component } from "react";
import AuthContext from "../tools/AuthContext";
import getCookie from "../tools/getCookie";
import loader from "../tools/loader";
export let isRegistrationAllowed = () => JSON.parse( getCookie( "isRegistrationAllowed" ) );

class AuthProvider extends Component {
    state = {
        isAuthorized: localStorage.getItem( "isAuthorized") === "true" || false,
        fullName: localStorage.getItem( "fullName" ) || ""
    }
    saveAuthState = ( { isAuthorized, fullName } ) => {
        localStorage.setItem( "isAuthorized", isAuthorized);
        localStorage.setItem( "fullName", fullName);
        this.setState( {
            isAuthorized,
            fullName
        } );
    }
    logout = async () => {
        // запрос на выход чтобы сервер стёр сессию
        await loader( {}, "/logout" );
        this.saveAuthState( {
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
        this.saveAuthState( {
            isAuthorized: true,
            fullName: reply.fullName
        } );
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
        this.saveAuthState( {
            isAuthorized: true,
            fullName
        } );
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
