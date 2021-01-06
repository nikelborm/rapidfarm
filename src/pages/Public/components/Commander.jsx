import React, { Component } from 'react';
import Form from "react-bootstrap/Form";
import Input from "../../../components/Input";
import { GlobalContext } from "../../../components/GlobalContextBasedOnDataFromWS";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


class Commander extends Component {
    static contextType = GlobalContext;
    onSubmit = event => {
        event.preventDefault();
        this.context.sendRawQuery( event.target.elements.command.value );
    };
    render() {
        return (
            <Form onSubmit={ this.onSubmit }>
                <Form.Label>
                    Введите команду:
                </Form.Label>
                <Form.Control
                    type="text"
                    name="command"
                    required
                    placeholder="Не пишите, если не уверены"
                />
                <Button variant="primary" type="submit">
                    Отправить
                </Button>
            </Form>
        );
    }
}

export default Commander;
