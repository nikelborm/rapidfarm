import React, { Component } from "react";
import TimingsRow from "./TimingRow";

class ProcessTimingsManager extends Component {
    shouldComponentUpdate( nextProps ) {
        return this.props.title !== nextProps.title ||
        this.props.timings !== nextProps.timings ||
        this.props.onChangeTiming !== nextProps.onChangeTiming;
    }
    render() {
        const { timings, title } = this.props;
        return (
            <div>
                Тайминги процесса { title }
                { timings.map(
                    ( oneTiming, timingIndex ) => (
                        <TimingsRow
                            oneTiming={ oneTiming }
                            timingIndex={ timingIndex }
                        />
                    )
                ) }
            </div>
        );
    }
}

export default ProcessTimingsManager;
