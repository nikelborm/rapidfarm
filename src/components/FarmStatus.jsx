import React, { Component } from 'react';
import Badge from "react-bootstrap/Badge";
import { GlobalContext } from "./GlobalContextBasedOnDataFromWS";

class FarmStatus extends Component {
    static contextType = GlobalContext;
    getVariant = (
        ifAvailable,
        ifUnavailable,
        ifUnknown
    ) => (
        this.context.isFarmConnected === true
            ? ifAvailable
            : this.context.isFarmConnected === false
                ? ifUnavailable
                : ifUnknown
    );
    render() {
        return (
            <h2>
                Состояние фермы:{" "}
                <Badge
                    pill
                    variant={
                        this.getVariant(
                            "success",
                            "danger",
                            "secondary"
                        )
                    }
                    children={
                        this.getVariant(
                            "Включена",
                            "Выключена",
                            "Запрашивается..."
                        )
                    }
                />
            </h2>
        );
    }
}

export default FarmStatus;
