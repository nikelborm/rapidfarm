import React, { Component } from "react";
import { GlobalContext } from "../../../components/GlobalContextBasedOnDataFromWS";
import ProcessTimingsManager from "./ProcessTimingsManager";

class AllTimingsManager extends Component {
    shouldComponentUpdate( nextProps, nextState, nextContext ) {
        return this.context.config.processes !== nextContext.config.processes;
    }
    static contextType = GlobalContext;
    render() {
        return this.context.config.processes.map(
            process => process.isAvailable && (
                <>
                    <ProcessTimingsManager onChange={ this.context.onSave } { ...process }/>
                    <br/>
                </>
            )
        );
    }
}

export default AllTimingsManager;
