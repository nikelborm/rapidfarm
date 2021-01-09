import React, { PureComponent } from "react";
import OneTimeChanger from "./OneTimeChanger";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

class TimingsRow extends PureComponent {
    render() {
        const {
            oneTiming: [ from, to ],
            isEditMode,
            timingIndex,
            processIndex
        } = this.props;
        return (
            <Row xs={ 1 } sm={ 1 } md={ 1 } lg={ 1 } xl={ 1 }>
                { isEditMode && (
                    <Col xs={ 10 } sm={ 9 } md={ 7 } lg={ 1 } xl={ 1 }>
                        <Button
                            data-action="removeTiming"
                            data-location={ [ processIndex, timingIndex ].join("_") }
                            variant="danger"
                            size="sm"
                            className="mb-3"
                        >
                            Удалить
                        </Button>
                    </Col>
                ) }
                <OneTimeChanger
                    processIndex={ processIndex }
                    isEditMode={ isEditMode }
                    timingIndex={ timingIndex }
                    changerIndex={ 0 }
                    time={ from }
                />
                <OneTimeChanger
                    processIndex={ processIndex }
                    isEditMode={ isEditMode }
                    timingIndex={ timingIndex }
                    changerIndex={ 1 }
                    time={ to }
                />
            </Row>
        );
    }
}

export default TimingsRow;
