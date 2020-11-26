import React, { Component } from "react";
import { AuthContext } from "./AuthProvider.js";
import { Redirect, withRouter } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class AuthForm extends Component {
    static contextType = AuthContext;
    state = {
        isSendingNow: false
    }
    onSubmit = (event) => {
        event.preventDefault();
        this.setState({
            isSendingNow: true
        });
        const { email, password, name } = event.target.elements;

        this.context.formSubmittingHandler(
            email.value,
            password.value,
            name?.value
        ).catch((error) => {
            // TODO: Красиво уведомить пользователя об ошибке, а не через alert
            alert(error);
            this.setState({
                isSendingNow: false
            });
        });
    };
    render() {
        const isLogin = this.context.formType === "login";
        if ( isLogin && this.context.isAuthorized ) {
            return <Redirect to="/admin" />;
        }
        return (
            <div style={{ margin: "20px" }}>{/* TODO: поменять это, ведь вызывает лишние перерендеры */}
                <h1>{isLogin ? "Вход" : "Регистрация"}</h1>
                <Form onSubmit={this.onSubmit}>
                    {!isLogin && (
                        <Form.Group controlId="nameInput">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control type="text" name="name" required placeholder="Введите своё имя" />
                        </Form.Group>
                    )}
                    <Form.Group controlId="emailInput">
                        <Form.Label>Email адрес</Form.Label>
                        <Form.Control type="email" name="email" required placeholder="Введите email"  />
                    </Form.Group>
                    <Form.Group controlId="passwordInput">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" required placeholder="Введите пароль" />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={ this.state.isSendingNow }>
                        { this.state.isSendingNow
                            ? (isLogin ? "Вход..." : "Создание аккаунта...")
                            : (isLogin ? "Войти" : "Создать аккаунт")
                        }
                    </Button>
                </Form>
            </div>
        );
    }
}

export default withRouter(AuthForm);
