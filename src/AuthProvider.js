import React, { Component } from "react";
import getCookie from "./getCookie";
import loader from "./loader";

export const AuthContext = React.createContext({
    isAuthorized: false,
    formType: getCookie("isRegistrationStage") ? "register" : "login",
    formSubmittingHandler: async()=>{},
    fullName: "",
    logout: async()=>{},
});

class AuthProvider extends Component {
    logout = async (  ) => {
        // запрос на выход чтобы сервер стёр сессию
    }
    login = async ( email, password ) => {
        // Запрос на авторизацию
        console.log('email, password: ', email, password );
        // Запрос на авторизацию
        const body = {
            email,
            password,
        };
        const responseData = await loader(body, "/loginAsUser");
        console.log('responseData: ', responseData);
        if ( responseData.report.isError ) return;
        // Если всё проходит успешно:
        // TODO: либо сервер либо клиент ставит новые куки
        this.setState({
            isAuthorized: true,
            formType: "login",
            formSubmittingHandler: this.login,
            fullName: responseData.reply.fullName
        });
    }
    register = async ( email, password, confirmPassword, fullName ) => {
        console.log('email, password, confirmPassword, fullName: ', email, password, confirmPassword, fullName);
        // Запрос на авторизацию
        const body = {
            email,
            password,
            confirmPassword,
            fullName
        };
        const responseData = await loader(body, "/registerAsUser");
        console.log('responseData: ', responseData);
        if ( responseData.report.isError ) return;
        // Если всё проходит успешно:
        // TODO: либо сервер либо клиент ставит новые куки
        this.setState({
            isAuthorized: true,
            formType: "login",
            formSubmittingHandler: this.login,
            fullName
        });
    }
    state = {
        isAuthorized: false,
        formType: getCookie("isRegistrationStage") ? "register" : "login",
        formSubmittingHandler: getCookie("isRegistrationStage") ? this.register : this.login,
        fullName: ""
    }
    componentWillUnmount() {
        this.logout();
    }
    render() {
        return (
            <AuthContext.Provider
                value={{
                    ...this.state,
                    logout: this.logout
                }}
                children={ this.props.children }
            />
        );
    }
}
export default AuthProvider;
