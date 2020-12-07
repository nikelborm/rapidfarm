import React, { Component } from "react";
import { AuthContext } from "../components/AuthProvider";
import { Redirect } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class AuthForm extends Component {
    static contextType = AuthContext;
    state = {
        isSendingNow: false
    }
    onSubmit = event => {
        event.preventDefault();
        this.setState( {
            isSendingNow: true
        } );
        const { email, password, confirmPassword, fullName } = event.target.elements;

        this.context[ this.props.formType ](
            email.value,
            password.value,
            confirmPassword?.value,
            fullName?.value
        ).catch( error => {
            // TODO: Красиво уведомить пользователя об ошибке, а не через alert
            alert( error.errorField + "   " + error.message );
            this.setState( {
                isSendingNow: false
            } );
        } );
    };
    render() {
        const isLogin = this.props.formType === "login";
        if ( this.context.isAuthorized ) {
            return <Redirect to="/admin" />;
        }
        return (
            <div style={{ margin: "20px" }}>{/* TODO: поменять это, ведь вызывает лишние перерендеры */}
                <h1>{ isLogin ? "Вход" : "Регистрация" }</h1>
                <Form onSubmit={ this.onSubmit }>
                    { !isLogin && (
                        <Form.Group controlId="nameInput">
                            <Form.Label>Введите полное имя:</Form.Label>
                            <Form.Control type="text" name="fullName" required placeholder="Иванов Иван" />
                        </Form.Group>
                    ) }
                    <Form.Group controlId="emailInput">
                        <Form.Label>Введите email адрес:</Form.Label>
                        <Form.Control type="email" name="email" required placeholder="ivan@mail.ru" />
                    </Form.Group>
                    <Form.Group controlId="passwordInput">
                        <Form.Label>Введите пароль:</Form.Label>
                        <Form.Control type="password" name="password" required placeholder="********" />
                    </Form.Group>
                    { !isLogin && (
                        <Form.Group controlId="confirmPasswordInput">
                            <Form.Label>Повторите пароль:</Form.Label>
                            <Form.Control type="password" name="confirmPassword" required placeholder="********" />
                        </Form.Group>
                    ) }
                    <Button variant="primary" type="submit" disabled={ this.state.isSendingNow }>
                        { this.state.isSendingNow
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
