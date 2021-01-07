import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import styled from "styled-components";
import OneTimeChanger from "./OneTimeChanger";

const StyledCol = styled( FormControl )`
    max-width: 400px !important;
`;
class TimingsRow extends Component {
    render() {
        const [ from, to ] = this.props.oneTiming;
        console.log('TimingsRow ');
        console.log('to: ', to);
        console.log('from: ', from);
        return (
            <Form onSubmit={ (event)=>event.preventDefault() }>
                <Row xs={ 1 } sm={ 1 } md={ 2 } lg={ 2 } xl={ 2 } >
                    <StyledCol>
                        <OneTimeChanger changerIndex={ 0 } role="От" time={ from }/>
                    </StyledCol>
                    <StyledCol>
                        <OneTimeChanger changerIndex={ 1 } role="До" time={ to }/>
                    </StyledCol>
                </Row>
            </Form>
        );
    }
}

export default TimingsRow;
