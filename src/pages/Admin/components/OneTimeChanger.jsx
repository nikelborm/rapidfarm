import React, { Component } from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import InputGroup from "react-bootstrap/InputGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import styled from "styled-components";


const StyledText = styled( InputGroup.Text )`
    padding: .25rem .5rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: .2rem;
    width: 40px;
    text-align: center;
    display: initial;
`;
class OneTimeChanger extends Component {
    letters = [ "Ч", "М", "С" ];
    render() {
        const { role, time } = this.props;
        return (
            <ButtonToolbar className="justify-content-between mb-3">
                <InputGroup size="sm">
                    <StyledText>
                        { role }
                    </StyledText>
                </InputGroup>
                { time.map( ( elem, index ) => (
                    <InputGroup size="sm">
                        <InputGroup.Prepend>
                            <StyledText>
                                { this.letters[ index ] }
                            </StyledText>
                        </InputGroup.Prepend>
                        <FormControl
                            style={ {
                                width: "40px !important",
                                textAlign: "center"
                            } }
                            name="fromHours"
                            type="text"
                            value={ ~~elem }
                        />
                    </InputGroup>
                ) ) }
                <ButtonGroup size="sm">
                    <Button variant="primary" type="submit">
                        +
                    </Button>
                </ButtonGroup>
            </ButtonToolbar>
        );
    }
}

export default OneTimeChanger;
