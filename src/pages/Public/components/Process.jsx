import React, { PureComponent } from "react";
import Badge from "react-bootstrap/Badge";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function getVariant(
    isActive,
    isAvailable,
    activeVariant,
    inactiveVariant,
    unavailableVariant
) {
    return ( !isAvailable
        ? unavailableVariant
        : isActive
            ? activeVariant
            : inactiveVariant
    );
}
class Process extends PureComponent {
    render() {
        const { title, isActive, isAvailable } = this.props;
        return (
            <Row>
                <Col>
                    { title }{": "}
                </Col>
                <Col>
                    <Badge
                        pill
                        variant={
                            getVariant(
                                isActive,
                                isAvailable,
                                "success",
                                "danger",
                                "secondary"
                            )
                        }
                        children={
                            getVariant(
                                isActive,
                                isAvailable,
                                "Активно",
                                "Выключено",
                                "Недоступно"
                            )
                        }
                    />
                </Col>
            </Row>
        );
    }
}

export default Process;
