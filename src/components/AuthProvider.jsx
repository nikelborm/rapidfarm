import React, { Component } from "react";
import AuthContext from "../tools/AuthContext";
import getCookie from "../tools/getCookie";
import loader from "../tools/loader";
export let isRegistrationAllowed = () => JSON.parse( getCookie( "isRegistrationAllowed" ) );

class AuthProvider extends Component {
    state = {
        isAuthorized: false,
        fullName: ""
    }
    logout = async () => {
        // запрос на выход чтобы сервер стёр сессию
        await loader( {}, "/logout" );
        this.setState( {
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
        const responseData = await loader( body, "/loginAsUser" );
        console.log( "responseData: ", responseData );
        if ( responseData.report.isError ) return;
        // Если всё проходит успешно:
        this.setState( {
            isAuthorized: true,
            fullName: responseData.reply.fullName
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
        const responseData = await loader( body, "/registerAsUser" );
        console.log( "responseData: ", responseData );
        if ( responseData.report.isError ) return;
        // Если всё проходит успешно:
        this.setState( {
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
