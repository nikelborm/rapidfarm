import React, { Component } from 'react';
import { AppConfigsContext } from "../../../components/AppConfigsManager";
import ProcessTimingsManager from "./ProcessTimingsManager";

class AllTimingsManager extends Component {
    static contextType = AppConfigsContext;
    render() {
        return this.context.processes.map(
            process => <ProcessTimingsManager { ...process }/>
        );
    }
}

export default AllTimingsManager;
