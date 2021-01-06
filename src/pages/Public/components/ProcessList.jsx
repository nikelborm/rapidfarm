import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import { GlobalContext } from "../../../components/GlobalContextBasedOnDataFromWS";
import Process from "./Process";

class ProcessList extends Component {
    static contextType = GlobalContext;
    render() {
        return (
            <Row>
                { this.context.config.processes.length
                    ? this.context.config.processes.map(
                        ( { long, isAvailable, title } ) => (
                            <Process
                                title={ title }
                                isActive={ this.context.processesStates[ long ] }
                                isAvailable={ isAvailable }
                            />
                        )
                    )
                    : <h1> Ферма неактивна </h1>
                }
            </Row>
        );
    }
}

export default ProcessList;
