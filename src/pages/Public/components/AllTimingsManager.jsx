import React, { Component, Fragment } from "react";
import { GlobalContext } from "../../../components/GlobalContextBasedOnDataFromWS";
import ProcessTimingsManager from "./ProcessTimingsManager";
// const timings = [];
// [ ...event.currentTarget.elements ].forEach( element => {
//     if( element.tagName !== "INPUT" ) return;
//     const [ timingIndex, changerIndex, index ] = element.dataset.location.split("_").map( e => parseInt( e ) );
//     timingIndex in timings || ( timings[ timingIndex ] = [ [], [] ] );
//     timings[ timingIndex ][ changerIndex ][ index ] = parseInt( element.value );
// } );
// console.log('timings: ', timings);

class AllTimingsManager extends Component {
    shouldComponentUpdate( nextProps, nextState, nextContext ) {
        return this.context.processes !== nextContext.processes;
    }
    static contextType = GlobalContext;
    onClickControlButton = event => {
        event.preventDefault();
        switch ( event.target.dataset.action ) {
            case "syncProcessTimingsWithServer":
            case "addEmptyTiming":
            case "removeTiming":
            case "increasePrecision":
            case "decreasePrecision":
                this.context.timingsActions[ event.target.dataset.action ]( event.target.dataset );
                break;
            default:
                console.log("Не кнопка");
                break;
        }
    };
    onChange = event => {
        this.context.timingsActions.setExactTimingValue( {
            location: event.target.dataset.location,
            value: event.target.value,
        } );
    };
    render() {
        return this.context.processes.map(
            ( process, index ) => (
                <Fragment key={ process.long }>
                    { process.isAvailable && <>
                        <ProcessTimingsManager
                            isAuthorized={ this.context.isAuthorized }
                            onChange={ this.onChange }
                            onClick={ this.onClickControlButton }
                            processIndex={ index }
                            { ...process }
                        />
                        <br/>
                    </> }
                </Fragment>
            )
        );
    }
}

export default AllTimingsManager;
