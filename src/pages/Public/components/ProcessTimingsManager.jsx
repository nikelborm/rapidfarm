import React, { Component } from "react";
import TimingRow from "./TimingRow";
import Button from "react-bootstrap/Button";
import { BarWithOneKindOfTimings } from "./TimingsBars";

class ProcessTimingsManager extends Component {
    shouldComponentUpdate( nextProps, nextState ) {
        return this.props.title !== nextProps.title ||
        this.props.timings !== nextProps.timings ||
        this.props.processIndex !== nextProps.processIndex ||
        this.state.isEditMode !== nextState.isEditMode ||
        this.props.isAuthorized !== nextProps.isAuthorized ||
        this.props.onClick !== nextProps.onClick ||
        this.props.onChange !== nextProps.onChange;
    }
    state = {
        isEditMode: false
    }
    enterEditMode = event => this.setState( { isEditMode: true } );
    leaveEditMode = event => this.setState( { isEditMode: false } );
    render() {
        const { timings, title, onClick, onChange, processIndex, isAuthorized } = this.props;
        return (
            <form
                onClick={ onClick }
                onChange={ onChange }
            >
                <h3>
                    { title }
                </h3>
                <BarWithOneKindOfTimings
                    timings={ timings }
                />
                { isAuthorized && ( this.state.isEditMode
                    ? (
                        (<>
                            <Button
                                data-action="syncProcessTimingsWithServer"
                                data-location={ [ processIndex ].join("_") }
                                onClick={ this.leaveEditMode }
                            >
                                Сохранить
                            </Button>
                            {/* <Button
                                data-action="restoreProcessTimingsBeforeEditing"
                                data-location={ [ processIndex ].join("_") }
                                variant="secondary"
                                onClick={ this.leaveEditMode }
                            >
                                Отменить
                            </Button> */}
                        </>)
                    )
                    : (
                        <Button
                            onClick={ this.enterEditMode }
                        >
                            Редактировать
                        </Button>
                    )
                )}
                { timings.map(
                    ( oneTiming, timingIndex ) => (
                        <TimingRow
                            oneTiming={ oneTiming }
                            timingIndex={ timingIndex }
                            processIndex={ processIndex }
                            isEditMode={ this.state.isEditMode }
                        />
                    )
                ) }
                { this.state.isEditMode && (
                    <Button
                        data-location={ [ processIndex ].join("_") }
                        data-action="addEmptyTiming"
                        variant="success"
                    >
                        Добавить
                    </Button>
                ) }
            </form>
        );
    }
}

export default ProcessTimingsManager;
