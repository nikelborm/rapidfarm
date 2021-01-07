import React, { Component } from 'react';
import Form from "react-bootstrap/Form";
import Input from "../../../components/Input";
import { GlobalContext } from "../../../components/GlobalContextBasedOnDataFromWS";
import Button from "react-bootstrap/Button";


class Commander extends Component {
    static contextType = GlobalContext;
    onSubmit = event => {
        event.preventDefault();
        this.context.sendRawQuery( event.target.elements.command.value );
    };
    render() {
        return (
            <Form onSubmit={ this.onSubmit }>
                <Input
                    name="command"
                    type="text"
                    label="Введите команду:"
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
