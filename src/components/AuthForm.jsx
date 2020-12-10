import React, { Component, PureComponent } from "react";
import { AuthContext } from "../components/AuthManager";
import { Redirect } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class Input extends PureComponent {
    render() {
        const { name, type, label, placeholder } = this.props;
        return (
            <Form.Group controlId={name}>
                <Form.Label>{ label }</Form.Label>
                <Form.Control type={type} name={name} required placeholder={placeholder} />
            </Form.Group>
        )
    }
}

const shityshit = { margin: "20px" };

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
