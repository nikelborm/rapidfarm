import React, { Component } from "react";
import TimingRow from "./TimingRow";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

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
                        <ButtonToolbar className="justify-content-between mb-3">
                            { this.props.isEditMode && (
                                <Button
                                    data-timing-index={ this.props.timingIndex }
                                    variant="danger"
                                >
                                    Удалить
                                </Button>
                            ) }
                            <TimingRow
                                oneTiming={ oneTiming }
                                timingIndex={ timingIndex }
                                isEditMode={ this.state.isEditMode }
                            />
                        </ButtonToolbar>
                    )
                ) }
                { this.state.isEditMode && "Добавить" }
            </div>
        );
    }
}

export default ProcessTimingsManager;
