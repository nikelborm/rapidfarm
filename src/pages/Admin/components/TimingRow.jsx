import React, { Component } from "react";
import { Button, ButtonGroup, ButtonToolbar, Form, FormControl, InputGroup } from "react-bootstrap";
// import OneTimeChanger from "./OneTimeChanger";

class TimingsRow extends Component {
    render() {
        const [ from, to ] = this.props.oneTiming;
        return (
            <Form onSubmit={ (event)=>event.preventDefault() }>
                <ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups">
                    <InputGroup>
                        <InputGroup.Text>
                            от
                        </InputGroup.Text>
                    </InputGroup>
                    <InputGroup>
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
                    <InputGroup>
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
                    <ButtonGroup className="mr-2" aria-label="First group">
                        <Button variant="primary" type="submit">
                            +
                        </Button>
                    </ButtonGroup>
                    {/* --------------------------------------- */}
                    <InputGroup>
                        <InputGroup.Text>
                            До
                        </InputGroup.Text>
                    </InputGroup>
                    <InputGroup>
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
                    <InputGroup>
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
                    <ButtonGroup className="mr-2" aria-label="First group">
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
