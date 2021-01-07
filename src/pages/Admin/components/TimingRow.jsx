import React, { Component } from "react";
import { Button, ButtonGroup, ButtonToolbar, Form, FormControl, InputGroup } from "react-bootstrap";
import styled from "styled-components";
// import OneTimeChanger from "./OneTimeChanger";
const StyledText = styled( InputGroup.Text )`
    padding: .25rem .5rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: .2rem;
    width: 40px;
    text-align: center;
    display: initial;
`;
const StyledInput = styled( FormControl )`
    width: 40px !important;
    text-align: center;
`;

class TimingsRow extends Component {
    render() {
        const [ from, to ] = this.props.oneTiming;
        return (
            <Form onSubmit={ (event)=>event.preventDefault() }>
                <ButtonToolbar className="justify-content-between">
                    <InputGroup size="sm">
                        <StyledText>
                            От
                        </StyledText>
                    </InputGroup>
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <StyledText>
                                Ч
                            </StyledText>
                        </InputGroup.Prepend>
                        <StyledInput
                            name="fromHours"
                            type="text"
                            value={~~from[0]}
                        />
                    </InputGroup>
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <StyledText>
                                М
                            </StyledText>
                        </InputGroup.Prepend>
                        <StyledInput
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
                        <StyledText>
                            До
                        </StyledText>
                    </InputGroup>
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <StyledText>
                                Ч
                            </StyledText>
                        </InputGroup.Prepend>
                        <StyledInput
                            name="fromHours"
                            type="text"
                            value={~~to[0]}
                        />
                    </InputGroup>
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <StyledText>
                                М
                            </StyledText>
                        </InputGroup.Prepend>
                        <StyledInput
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
