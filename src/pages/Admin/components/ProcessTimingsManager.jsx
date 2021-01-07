import React, { Component } from "react";
import TimingsRow from "./TimingRow";

class ProcessTimingsManager extends Component {
    // shouldComponentUpdate( nextProps, nextState ) {
    //     return this.props.title !== nextProps.title ||
    //     this.props.timings !== nextProps.timings ||
    //     this.state.isEditMode !== nextState.isEditMode ||
    //     this.props.onChangeTiming !== nextProps.onChangeTiming;
    // }
    state = {
        isEditMode: false
    }
    render() {
        const { timings, title } = this.props;
        return (
            <div>
                <h3>
                    Тайминги процесса { title }
                </h3>
                { this.state.isEditMode ? "Сохранить" : "Редактировать" }
                { timings.map(
                    ( oneTiming, timingIndex ) => (
                        <TimingsRow
                            oneTiming={ oneTiming }
                            timingIndex={ timingIndex }
                            isEditMode={ this.state.isEditMode }
                        />
                    )
                ) }
                { this.state.isEditMode && "Добавить" }
            </div>
        );
    }
}

export default ProcessTimingsManager;
