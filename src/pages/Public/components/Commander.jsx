import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { GlobalContext } from "../../../components/GlobalContextBasedOnDataFromWS";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";


class Commander extends Component {
    shouldComponentUpdate() {
        return false;
    }
    static contextType = GlobalContext;
    onSubmit = event => {
        event.preventDefault();
        this.context.sendRawQuery( event.target.elements.command.value );
    };
    render() {
        return (
            <Form onSubmit={ this.onSubmit }>
                Введите команду:
                <InputGroup>
                    <FormControl
                        aria-label="Введите команду:"
                        aria-describedby="basic-addon2"
                        name="command"
                        type="text"
                        placeholder="Не пишите, если не уверены"
                    />
                    <InputGroup.Append>
                        <Button variant="primary" type="submit">
                            Отправить
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
        );
    }
}

export default Commander;
