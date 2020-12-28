import React, { Component } from "react";
import { addMessageListener } from "../tools/SocketManager";

export const AppConfigsContext = React.createContext( {
    processes: [],
    sensors: []
});

class AppConfigsProvider extends Component {
    constructor(props) {
        super(props);
        addMessageListener( data => {
            // eslint-disable-next-line default-case
            switch ( data.class ) {
                case "configPackage":
                    this.setState( () => data.package );
                    break;
            }
        });
    }
    state = {
        processes: [],
        sensors: []
    }
    render() {
        return (
            <AppConfigsContext.Provider
                value={ this.state }
                children={ this.props.children }
            />
        );
    }
}

export default AppConfigsProvider;
