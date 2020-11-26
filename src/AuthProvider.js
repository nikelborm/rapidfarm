import React, { Component } from "react";
import getCookie from "./getCookie";

export const AuthContext = React.createContext({
    isAuthorized: false,
    formType: getCookie("isRegistrationStage") ? "register" : "login",
    formSubmittingHandler: async()=>{},
    name: "",
    logout: async()=>{},
});

class AuthProvider extends Component {
    logout = async (  ) => {
        // запрос на выход чтобы сервер стёр сессию
    }
    login = async ( email, password ) => {
        // Запрос на авторизацию
    }
    register = async ( email, password, name ) => {
        console.log('email, password, name: ', email, password, name);
        // Запрос на авторизацию

        // Если всё проходит успешно:
        // TODO: либо сервер либо клиент ставит новые куки
        /* this.setState({
            isAuthorized: true,
            formType: "login",
            formSubmittingHandler: this.login,
            name
        }); */
    }
    state = {
        isAuthorized: false,
        formType: getCookie("isRegistrationStage") ? "register" : "login",
        formSubmittingHandler: getCookie("isRegistrationStage") ? this.register : this.login,
        name: ""
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
