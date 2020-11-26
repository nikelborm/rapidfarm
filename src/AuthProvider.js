import React, { Component } from "react";
import getCookie from "./getCookie";

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
    }
    register = async ( email, password, confirmPassword, fullName ) => {
        console.log('email, password, confirmPassword, fullName: ', email, password, confirmPassword, fullName);
        // Запрос на авторизацию

        // Если всё проходит успешно:
        // TODO: либо сервер либо клиент ставит новые куки
        /* this.setState({
            isAuthorized: true,
            formType: "login",
            formSubmittingHandler: this.login,
            fullName
        }); */
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
