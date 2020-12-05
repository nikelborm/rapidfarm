import React, { Component } from "react";
import AuthContext from "../tools/AuthContext";
import getCookie from "../tools/getCookie";
import loader from "../tools/loader";
import { createNewWebSocket } from "../tools/SocketManager";
export let isRegistrationAllowed = () => JSON.parse( getCookie( "isRegistrationAllowed" ) );

class AuthProvider extends Component {
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
        // TODO: либо сервер либо клиент ставит новые куки
        this.setState( {
            isAuthorized: true,
            fullName: responseData.reply.fullName
        } );
        createNewWebSocket();
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
    startWebsocketConnection = () => {

    }
    state = {
        isAuthorized: false,
        fullName: ""
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
