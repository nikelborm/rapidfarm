import React, { PureComponent } from "react";
import Container from "react-bootstrap/Container";
import { AppConfigsContext } from "../../../components/AppConfigsManager";
import Process from "./Process";
import { addMessageListener } from "../../../tools/SocketManager";

class ProcessList extends PureComponent {
    static contextType = AppConfigsContext;
    constructor(props) {
        super(props);
        addMessageListener( data => {
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
    state = {}
    render() {
        console.log('this.state[ long ]: ', this.state);
        return (
            <Container>
                { this.context.processes.length
                    ? this.context.processes.map(
                        ( { long, isAvailable, title } ) => (
                            <Process
                                title={ title }
                                isActive={ this.state[ long ] }
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
