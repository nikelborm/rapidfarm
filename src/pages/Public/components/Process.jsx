import React, { PureComponent } from "react";
import Badge from "react-bootstrap/Badge";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class Process extends PureComponent {
    render() {
        const getVariant = (
            state,
            active,
            inactive,
            unavailable
        ) => (
            state
                ? active
                : state === false
                    ? inactive
                    : unavailable
        );
        const { title, activity } = this.props;
        return (
            <Row>
                <Col>
                    {title}{": "}
                </Col>
                <Col>
                    <Badge
                        pill
                        variant={
                            getVariant( activity, "success", "danger", "secondary" )
                        }
                        children={
                            getVariant( activity, "Активно", "Выключено", "Недоступно" )
                        }
                    />
                </Col>
            </Row>
        );
    }
}

export default Process;
