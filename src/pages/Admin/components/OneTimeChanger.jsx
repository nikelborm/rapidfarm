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
const StyledInput = styled( FormControl )`
    width: 40px !important;
    text-align: center;
`;

class OneTimeChanger extends Component {
    letters = [ "Ч", "М", "С" ];
    render() {
        const { role, time, isEditMode } = this.props;
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
                        <StyledInput
                            name="fromHours"
                            type="text"
                            value={ elem }
                        />
                    </InputGroup>
                ) ) }
                { isEditMode && (
                    <ButtonGroup size="sm">
                        <Button variant="success" type="submit">
                            +
                        </Button>
                        <Button variant="danger" type="submit">
                            -
                        </Button>
                    </ButtonGroup>
                ) }
            </ButtonToolbar>
        );
    }
}

export default OneTimeChanger;
