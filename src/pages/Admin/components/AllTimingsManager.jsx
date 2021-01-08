import React, { Component, Fragment } from "react";
import { GlobalContext } from "../../../components/GlobalContextBasedOnDataFromWS";
import ProcessTimingsManager from "./ProcessTimingsManager";

class AllTimingsManager extends Component {
    shouldComponentUpdate( nextProps, nextState, nextContext ) {
        return this.context.config.processes !== nextContext.config.processes;
    }
    static contextType = GlobalContext;
    render() {
        return this.context.config.processes.map(
            process => (
                <Fragment key={ process.long }>
                    { process.isAvailable && <>
                        <ProcessTimingsManager onChange={ this.context.onSave } { ...process }/>
                        <br/>
                    </> }
                </Fragment>
            )
        );
    }
}

export default AllTimingsManager;
