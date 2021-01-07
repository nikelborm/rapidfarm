import React, { Component } from "react";
import TimingRow from "./TimingRow";
import Button from "react-bootstrap/Button";

class ProcessTimingsManager extends Component {
    shouldComponentUpdate( nextProps, nextState ) {
        return this.props.title !== nextProps.title ||
        this.props.timings !== nextProps.timings ||
        this.state.isEditMode !== nextState.isEditMode ||
        this.props.onChangeTiming !== nextProps.onChangeTiming;
    }
    state = {
        isEditMode: true
    }
    render() {
        const { timings, title } = this.props;
        return (
            <div>
                <h3>
                    { title }
                </h3>
                { this.state.isEditMode
                    ? <Button>Сохранить</Button>
                    : <Button>Редактировать</Button>
                }
                { timings.map(
                    ( oneTiming, timingIndex ) => (
                        <TimingRow
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
