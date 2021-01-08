import React, { Component } from "react";
import OneTimeChanger from "./OneTimeChanger";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

class TimingsRow extends Component {
    render() {
        const [ from, to ] = this.props.oneTiming;
        return (
            <Row xs={ 1 } sm={ 1 } md={ 1 } lg={ 1 } xl={ 1 }>
                { this.props.isEditMode && (
                    <Col xs={ 10 } sm={ 9 } md={ 7 } lg={ 1 } xl={ 1 }>
                        <Button
                            data-timing-index={ this.props.timingIndex }
                            variant="danger"
                            size="sm"
                            className="mb-3"
                        >
                            Удалить
                        </Button>
                    </Col>
                ) }
                <OneTimeChanger
                    isEditMode={ this.props.isEditMode }
                    changerIndex={ 0 }
                    role="От"
                    time={ from }
                />
                <OneTimeChanger
                    isEditMode={ this.props.isEditMode }
                    changerIndex={ 1 }
                    role="До"
                    time={ to }
                />
            </Row>
        );
    }
}

export default TimingsRow;
