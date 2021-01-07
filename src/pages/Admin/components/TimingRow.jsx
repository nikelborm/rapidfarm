import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import styled from "styled-components";
import OneTimeChanger from "./OneTimeChanger";
import { Button } from "react-bootstrap";

const StyledCol = styled( Col )`
    max-width: 400px !important;
`;
class TimingsRow extends Component {
    render() {
        const [ from, to ] = this.props.oneTiming;
        return (
            <Row xs={ 1 } sm={ 1 } md={ 2 } lg={ 2 } xl={ 2 } >
                { this.props.isEditMode && (
                    <Button
                        data-timing-index={ this.props.timingIndex }
                        variant="danger"
                    >
                        Удалить
                    </Button>
                ) }
                <StyledCol>
                    <OneTimeChanger
                        isEditMode={ this.props.isEditMode }
                        changerIndex={ 0 }
                        role="От"
                        time={ from }
                    />
                </StyledCol>
                <StyledCol>
                    <OneTimeChanger
                        isEditMode={ this.props.isEditMode }
                        changerIndex={ 1 }
                        role="До"
                        time={ to }
                    />
                </StyledCol>
            </Row>
        );
    }
}

export default TimingsRow;
