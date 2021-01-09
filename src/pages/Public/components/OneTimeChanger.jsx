import React, { PureComponent } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import styled from "styled-components";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Col from "react-bootstrap/Col";


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
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none; // Yeah, yeah everybody write about it
    }

    &,
    &:hover,
    &:focus {
        appearance: none;
        -moz-appearance: textfield;
    }

`;

class OneTimeChanger extends PureComponent {
    letters = [ "Ч", "М", "С" ];
    maxs = [ 24, 60, 60 ];
    roles = [ "От", "До" ];
    render() {
        const { timingIndex, time, isEditMode, changerIndex, processIndex } = this.props;
        return (
            <Col sm={ 9 } md={ 7 } lg={ 5 } xl={ 4 }>
                <ButtonToolbar className="justify-content-between mb-3">
                    <InputGroup size="sm">
                        <StyledText>
                            { this.roles[ changerIndex ] }
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
                                data-location={ [ processIndex, timingIndex, changerIndex, index ].join("_") }
                                type="number"
                                min={ 0 }
                                max={ this.maxs[ index ] }
                                readOnly={ !isEditMode }
                                value={ elem }
                            />
                        </InputGroup>
                    ) ) }
                    <ButtonGroup size="sm">
                        { isEditMode && (
                            <>
                                { time.length !== 3 && (
                                    <Button
                                        data-action="increasePrecision"
                                        data-location={ [ processIndex, timingIndex, changerIndex ].join("_") }
                                        variant="success"
                                        children="+"
                                    />
                                ) }
                                { time.length !== 1 && (
                                    <Button
                                        data-action="decreasePrecision"
                                        data-location={ [ processIndex, timingIndex, changerIndex ].join("_") }
                                        variant="danger"
                                        children="‒"
                                    />
                                ) }
                            </>
                        ) }
                    </ButtonGroup>
                </ButtonToolbar>
            </Col>
        );
    }
}

export default OneTimeChanger;
