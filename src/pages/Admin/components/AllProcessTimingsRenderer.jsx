import React, { Component } from 'react';
import { GlobalContext } from "../../../components/GlobalContextBasedOnDataFromWS";
import ProcessTimingsManager from "./ProcessTimingsManager";

class AllTimingsManager extends Component {
    static contextType = GlobalContext;
    render() {
        return this.context.config.processes.map(
            process => <ProcessTimingsManager { ...process }/>
        );
    }
}

export default AllTimingsManager;
