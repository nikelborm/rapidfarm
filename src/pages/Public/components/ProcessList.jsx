import React, { PureComponent } from 'react';
import Container from "react-bootstrap/Container";
import { AppConfigsContext } from "../../../components/AppConfigsManager";
import Process from "./Process";
import { addMessageListener } from "../../../tools/SocketManager";

class ProcessList extends PureComponent {
    state = {}
    componentDidMount() {
        addMessageListener((data)=> {
            // eslint-disable-next-line default-case
            switch ( data.class ) {
                case "activitySyncPackage":
                    this.setState( () => data.package );
                    break;
                case "event":
                    this.setState( prevState => {
                        prevState[ data.process ] = data.isActive;
                        return prevState;
                    } );
            }
        });
    }
    static contextType = AppConfigsContext;
    render() {
        return (
            <Container>
                { Object.entries( this.context.processes ).map(
                    ( [ long, isActive ] ) => {
                        console.log( 'this.context.processes: ', this.context.processes );
                        const { isAvailable, title } = this.context.processes.find(
                            process => process.long === long
                        );
                        return (
                            <Process
                                title={ title }
                                isActive={ isActive }
                                isAvailable={ isAvailable }
                            />
                        )
                    }
                ) }
            </Container>
        );
    }
}

export default ProcessList;
