import React, { Component } from "react";
import { GlobalContext } from "../../../components/GlobalContextBasedOnDataFromWS";
import Process from "./Process";

class ProcessList extends Component {
    shouldComponentUpdate( nextProps, nextState, nextContext ) {
        return this.context.isFarmConnected !== nextContext.isFarmConnected ||
        this.context.processes !== nextContext.processes ||
        this.context.processesStates !== nextContext.processesStates;
    }
    static contextType = GlobalContext;
    render() {
        return (
            <>
                { this.context.isFarmConnected
                    ? this.context.processes.map(
                        ( { long, isAvailable, title } ) => (
                            <Process
                                key={ long }
                                title={ title }
                                isActive={ this.context.processesStates[ long ] }
                                isAvailable={ isAvailable }
                            />
                        )
                    )
                    : <h1> Ферма неактивна </h1>
                }
            </>
        );
    }
}

export default ProcessList;
