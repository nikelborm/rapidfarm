import React, { Component } from 'react';
import Container from "react-bootstrap/Container";
import { AppConfigsContext } from "../../../components/AppConfigsManager";
import Process from "./Process";

class ProcessList extends Component {
    static contextType = AppConfigsContext;
    render() {
        return (
            <Container>
                { Object.entries( this.context.processes ).map(
                    ([title, activity]) => <Process title={title} isActive={isActive} isAvailable={isAvailable}/>
                ) }
            </Container>
        );
    }
}

export default ProcessList;
