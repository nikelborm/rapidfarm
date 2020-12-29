import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import { GlobalContext } from "../../../components/GlobalContextBasedOnDataFromWS";
import Process from "./Process";

class ProcessList extends Component {
    static contextType = GlobalContext;
    render() {
        return (
            <Container>
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
            </Container>
        );
    }
}

export default ProcessList;
