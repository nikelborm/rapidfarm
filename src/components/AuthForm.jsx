import React, { Component } from "react";
import { GlobalContext } from "./GlobalContextBasedOnDataFromWS";
import Input from "./Input";
import { Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";



const shityshit = { margin: "20px" };

class AuthForm extends Component {
    static contextType = GlobalContext;
    onSubmit = event => {
        event.preventDefault();
        const { email, password, confirmPassword, fullName } = event.target.elements;

        this.context.authorizationActions[ this.props.formType ](
            email.value,
            password.value,
            confirmPassword?.value,
            fullName?.value
        ).catch( error => {
            // TODO: Красиво уведомить пользователя об ошибке, а не через alert
            alert( error.errorField + "   " + error.message );
        } );
    };
    render() {
        const isLogin = this.props.formType === "login";
        if ( this.context.isAuthorized ) {
            return <Redirect to="/admin" />;
        }
        return (
            <div style={shityshit}>
                <h1>{ isLogin ? "Вход" : "Регистрация" }</h1>
                <Form onSubmit={ this.onSubmit }>
                    { !isLogin && <Input
                        type="text"
                        name="fullName"
                        placeholder="Иванов Иван"
                        label="Введите полное имя:"
                    /> }
                    <Input
                        type="email"
                        name="email"
                        placeholder="ivan@mail.ru"
                        label="Введите email адрес:"
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="********"
                        label="Введите пароль:"
                    />
                    { !isLogin && <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="********"
                        label="Повторите пароль:"
                    /> }
                    <Button variant="primary" type="submit" disabled={ this.context.isAuthInProcess }>
                        { this.context.isAuthInProcess
                            ? ( isLogin ? "Вход..." : "Создание аккаунта..." )
                            : ( isLogin ? "Войти" : "Создать аккаунт" )
                        }
                    </Button>
                </Form>
            </div>
        );
    }
}

export default AuthForm;
