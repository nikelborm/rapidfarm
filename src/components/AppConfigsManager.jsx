import React, { Component } from "react";
import { addMessageListener } from "../tools/SocketManager";

export const AppConfigsContext = React.createContext( {
    processActivities: {}
});

class AppConfigsProvider extends Component {
    state = {
        processActivities: {},
    }
    componentDidMount() {
        // запрос на получение списка процессов с их активностям
        // потом подписаться на обновления по процессам
        addMessageListener((data)=> {
            // eslint-disable-next-line default-case
            switch ( data.class ) {
                case "activitySyncPackage":
                    this.setState({
                        processActivities: data.package
                    });
                    break;
                case "event":
                    this.setState(prevstate => {
                        prevstate.processActivities[ data.process ] = data.isActive;
                        return prevstate;
                    });
            }
        });
    }

    render() {
        return (
            <AppConfigsContext.Provider
                value={ {
                    ...this.state,
                } }
                children={ this.props.children }
            />
        );
    }
}

export default AppConfigsProvider;
