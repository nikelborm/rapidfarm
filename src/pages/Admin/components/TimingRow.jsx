import React, { Component } from "react";
import { Button, ButtonGroup, ButtonToolbar, Form, FormControl, InputGroup } from "react-bootstrap";
// import OneTimeChanger from "./OneTimeChanger";

class TimingsRow extends Component {
    render() {
        const [ from, to ] = this.props.oneTiming;
        return (
            <Form onSubmit={ (event)=>event.preventDefault() }>
                <ButtonToolbar className="justify-content-between">
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                От
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                    </InputGroup>
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                Часы:
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            name="fromHours"
                            type="text"
                            value={~~from[0]}
                        />
                    </InputGroup>
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                Минуты:
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            name="fromMinutes"
                            type="text"
                            value={~~from[1]}
                        />
                    </InputGroup>
                    <ButtonGroup size="sm">
                        <Button variant="primary" type="submit">
                            +
                        </Button>
                    </ButtonGroup>
                    {/* --------------------------------------- */}
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                До
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                    </InputGroup>
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                Часы:
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            name="fromHours"
                            type="text"
                            value={~~to[0]}
                        />
                    </InputGroup>
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                Минуты:
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            name="fromMinutes"
                            type="text"
                            value={~~to[1]}
                        />
                    </InputGroup>
                    <ButtonGroup size="sm">
                        <Button variant="primary" type="submit">
                            +
                        </Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Form>
            // <div>

            //     текст - от, инпут, текст - ч, инпут, текст - м, инпут, текст - м, текст, инпут,
            //     от <OneTimeChanger role="от" changerIndex={ 0 } initTime={ from }/>,
            //     до <OneTimeChanger role="до" changerIndex={ 1 } initTime={ to }/>
            // </div>
        );
    }
}

export default TimingsRow;
