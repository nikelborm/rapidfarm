import React, { Component, PureComponent } from "react";
import { GlobalContext } from "../../../components/GlobalContextBasedOnDataFromWS";
import { Line } from "react-chartjs-2";

const chartOptions = {
    legend: {
        labels: {
            usePointStyle: true,
        },
    },
    // aspectRatio: 1,
    maintainAspectRatio: false,
    elements: {
        point: {
            radius: 0,
        },
        line: {
            tension: 1,
            borderWidth: 1,
            spanGaps: true,
            showLine: false,
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                distribution: "linear",
                spanGaps: true,
                time: {
                    displayFormats: {
                        day: "D.MM",
                        hour: "D.MM - HH ч",
                    }
                }
            },
        ],
    },
};
class SensorText extends PureComponent {
    constructor(props) {
        super(props);
        this.timeUpdater = null;
    }
    recalcTime = () => this.forceUpdate();
    componentDidMount() {
        this.timeUpdater = setInterval( this.recalcTime, 60000 );
    }
    componentWillUnmount() {
        clearInterval( this.timeUpdater );
    }
    render() {
        const { lastTime, title, value, point, upperBorder, lowerBorder } = this.props;
        return (
            <>
                {/* @ts-ignore */}
                { Math.round(((new Date()) - (new Date(lastTime)))/60000)} минут назад { title } была { value } { point }. Она входит в рамки допустимых значений: { lowerBorder } { point } ⩽ { value } { point } ⩽ { upperBorder } { point }
                <br/><br/><br/>
            </>
        );
    }
}
class SensorVisualization extends PureComponent {
    render() {
        const { lastTime, title, value, point, upperBorder, lowerBorder, data } = this.props;
        return (
            <div>
                <div className="chart-container" style={{height:"60vh"}}>
                    <Line
                        data={{
                            datasets: [
                                {
                                    label: `${ title }${ point ? " ( " + point + " )" : "" }`,
                                    borderColor: "rgba(225, 75, 75, 1)",
                                    data,
                                    fill: false,
                                    pointBorderWidth: 0,
                                }
                            ],
                        }}
                        options={
                            chartOptions
                        }
                    />
                </div>
                <SensorText
                    lastTime={ lastTime }
                    title={ title }
                    value={ value }
                    point={ point }
                    upperBorder={ upperBorder }
                    lowerBorder={ lowerBorder }
                />
            </div>
        );
    }
}
class LastSensorsLogs extends Component {
    shouldComponentUpdate( nextProps, nextState, nextContext ) {
        return this.context.sensors !== nextContext.sensors ||
        this.context.records !== nextContext.records;
    }
    static contextType = GlobalContext;
    render() {
        return (
            <div>
                { this.context.sensors.map( sensor => sensor.isConnected && !!sensor.lastRecord && (
                    <SensorVisualization
                        key={ sensor.long }
                        lastTime={ sensor.lastRecord.date }
                        value={ sensor.lastRecord.value }
                        title={ sensor.title }
                        point={ sensor.measurementPoint }
                        upperBorder={ sensor.criticalBorders.upper }
                        lowerBorder={ sensor.criticalBorders.lower }
                        data={ this.context.records[ sensor.long ]}
                    />
                ) ) }
                <br/>
                { this.context.sensors.map( sensor => ( !sensor.isConnected ) && (
                    <div key={ sensor.long }> { sensor.title } недоступна, потому что датчик не подключён. </div>
                ) ) }
            </div>
        );
    }
}

export default LastSensorsLogs;
