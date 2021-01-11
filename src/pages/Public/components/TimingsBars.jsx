import React, { Component, PureComponent } from "react";
import styled from "styled-components";
import calcSecondsFrom00_00 from "../../../tools/calcSecondsFrom00_00";

const StyledOneTimingDiv = styled.div`
    margin: 0%;
    width: ${ props => props.filledAreaPercentage }%;
    margin-left: ${ props => props.marginFromLeftBorder }%;
    height: ${ props => props.theme.height || "30px" };
    background-color: ${ props => props.timingBgColor || "rgb(7, 172, 7)" };
    position: absolute;
    opacity: ${ props => props.timingOpacityPercentage }%;
`;
const StyledTimingsBarsContainer = styled.div`
    width: 100%;
    background-color: ${ props => props.timeLineBgColor || "rgb(240, 235, 235)" };
    height: ${ props => props.theme.height || "30px" };
    position: relative;
`;
class OneTiming extends Component {
    segmentPercentage = 100 / ( 24 * 60 * 60 + 1 ); // Длина секунды, относительно суток
    render() {
        const { timing, ...rest } = this.props;
        const marginFromLeftBorder = calcSecondsFrom00_00( timing[ 0 ] ) * this.segmentPercentage;
        const filledAreaPercentage = calcSecondsFrom00_00( timing[ 1 ] ) * this.segmentPercentage - marginFromLeftBorder;
        return (
            <StyledOneTimingDiv
                marginFromLeftBorder={ marginFromLeftBorder }
                filledAreaPercentage={ filledAreaPercentage }
                { ...rest }
            />
        );
    }
}

class TimingsBar extends PureComponent {
    render() {
        // timings: [
        //     [
        //         [ ч, м, с ],
        //         [ ч, м, с ]
        //     ], [
        //         [ ч, м, с ],
        //         [ ч, м, с ]
        //     ], [
        //         [ ч, м, с ],
        //         [ ч, м, с ]
        //     ], [
        //         [ ч, м, с ],
        //         [ ч, м, с ]
        //     ]
        // ]
        const {
            timings,
            timingBgColor,
            shouldCalcTimingOpacity,
            timingOpacityPercentage,
            amountOfTimings,
            theme
        } = this.props;
        return timings.map( timing => {
            return <OneTiming
                theme={theme}
                timing={ timing }
                timingBgColor={ timingBgColor }
                timingOpacityPercentage={
                    shouldCalcTimingOpacity
                        ? 100 / amountOfTimings
                        : timingOpacityPercentage || 100
                }
            />
        } );
    }
}

export class BarWithMultipleKindsOfTimingsInOneLine extends Component {
    render() {
        const {
            processes,
            colors,
            timeLineBgColor,
            opacitys,
            processOrdering
        } = this.props;
        const constructTimingsSet = process => (
            process?.isAvailable && <TimingsBar
                timings={ process.timings }
                shouldCalcTimingOpacity={ !opacitys }
                amountOfTimings={ allTimings }
                timingOpacityPercentage={ opacitys && opacitys[ process.long ] }
                timingBgColor={ colors && colors[ process.long/*name*/ ] }
            />
        );
        // const allTimings = processes.reduce( ( sum, proc ) => sum + proc.timings.length, 0 );
        const allTimings = processes.reduce( ( sum, proc ) => sum + ~~proc.isAvailable, 0 );
        return (
            <StyledTimingsBarsContainer
                timeLineBgColor={ timeLineBgColor }
            >
                { processOrdering
                    ? this.props.processOrdering.map(
                        procIndex => constructTimingsSet( processes[ procIndex ] )
                    )
                    : processes.map( constructTimingsSet  )
                }
            </StyledTimingsBarsContainer>
        );
    }
}
// const barConfig= {
//     processes:this.props.processes,
//     colors:{
//         /*0*/lighting: "#FBF50D",//"#FBF50D",//"#E9A8A0",//"#ffff8a",
//         /*1*/watering: "#E32A91",//"#E32A91",//"#6F0E12"//"#e0ffff"
//         /*2*/oxidation: "#03AFEA",//"#03AFEA",//"#96CBE4",//"#54ff9f",
//     },
//     opacitys:{
//         lighting: "50",
//         watering: "70",
//         oxidation: "100"
//     },
//     processOrdering:[1,2,0], //[зад середина перед]
//     timeLineBgColor:"#fff"
// }

export class BarWithMultipleKindsOfTimingsInManyLines extends Component {
    render() {
        const {
            processes,
            colors,
            timeLineBgColor,
            opacitys,
            processOrdering
        } = this.props;
        // const allTimings = processes.reduce( ( sum, proc ) => sum + proc.timings.length, 0 );
        const allTimings = processes.reduce( ( sum, proc ) => sum + ~~proc.isAvailable, 0 );
        const constructTimingsSet = process => (
            process?.isAvailable && (
                <StyledTimingsBarsContainer
                    timeLineBgColor={ timeLineBgColor }
                >
                    <TimingsBar
                        timings={ process.timings }
                        shouldCalcTimingOpacity={ !opacitys }
                        amountOfTimings={ allTimings }
                        timingOpacityPercentage={ opacitys && opacitys[ process.long ] }
                        timingBgColor={ colors && colors[ process.long/*name*/ ] }
                    />
                </StyledTimingsBarsContainer>
            )
        );
        return ( processOrdering
            ? this.props.processOrdering.map(
                procIndex => constructTimingsSet( processes[ procIndex ] )
            )
            : processes.map( constructTimingsSet  )
        )
    }
}

class NowLine extends PureComponent {
    state = {
        msfrom00_00: Date.now() - (new Date((new Date()).toDateString())).getTime()
    };
    constructor(props) {
        super(props);
        this.timeUpdater = null;
    }
    setnewstate = ()=>this.setState({
        msfrom00_00: Date.now() - (new Date((new Date()).toDateString())).getTime()
    });
    componentDidMount= ()=> {
        this.timeUpdater = setInterval(this.setnewstate, 60000);
    }
    componentWillUnmount= ()=> {
        clearInterval( this.timeUpdater );
    }
    render() {
        return (
            <OneTiming
                timing={ [
                    [ 0,0,this.state.msfrom00_00/1000],
                    [ 0,0,this.state.msfrom00_00/1000+120 ]
                ] }
                timingBgColor={ "#FF3333" }
                timingOpacityPercentage={ 100 }
            />
        )
    }
}

export class BarWithOneKindOfTimings extends Component {
    render() {
        const { timeLineBgColor, ...rest } = this.props;
        return (
            <StyledTimingsBarsContainer
                timeLineBgColor={ timeLineBgColor }
            >
                <TimingsBar { ...rest } />
                <NowLine/>
            </StyledTimingsBarsContainer>
        );
    }
}

