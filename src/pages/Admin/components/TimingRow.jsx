import React, { Component } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
// import OneTimeChanger from "./OneTimeChanger";

class TimingsRow extends Component {
    render() {
        const [ from, to ] = this.props.oneTiming;
        return (
            <Form onSubmit={ (event)=>event.preventDefault() }>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            { "от" }
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        name="fromHours"
                        type="text"
                        placeholder="ч"
                        value={~~from[0]}
                    />
                    <FormControl
                        name="fromMinutes"
                        type="text"
                        placeholder="м"
                        value={~~from[1]}
                    />
                    <FormControl
                        name="fromSeconds"
                        type="text"
                        placeholder="с"
                        value={~~from[2]}
                    />
                    <Button variant="primary" type="submit">
                        +
                    </Button>
                    <InputGroup.Text>
                        { "до" }
                    </InputGroup.Text>
                    <FormControl
                        name="fromHours"
                        type="text"
                        placeholder="ч"
                        value={~~to[0]}
                    />
                    <FormControl
                        name="fromMinutes"
                        type="text"
                        placeholder="м"
                        value={~~to[1]}
                        />
                    <FormControl
                        name="fromSeconds"
                        type="text"
                        placeholder="с"
                        value={~~to[2]}
                    />
                    <InputGroup.Append>
                        <Button variant="primary" type="submit">
                            +
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
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
