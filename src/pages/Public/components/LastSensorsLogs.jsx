import React, { Component, PureComponent } from "react";
import { GlobalContext } from "../../../components/GlobalContextBasedOnDataFromWS";
import { Line } from 'react-chartjs-2';

const chartOptions = {
    legend: {
        labels: {
            usePointStyle: true,
        },
    },
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
                type: 'time',
                distribution: 'linear',
                spanGaps: true,
                time: {
                    displayFormats: {
                        day: 'Do MMM',
                        hour: 'Do MMM HH часов',
                    }
                }
            },
        ],
    },
};

class SensorVisualization extends PureComponent {
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
        const { lastTime, title, value, point, upperBorder, lowerBorder, data } = this.props;
        return (
            <div>
                <Line
                    data={{
                        datasets: [
                            {
                                label: `${ title }${ point ? " ( " + point + " )" : "" })`,
                                borderColor: 'rgba(225, 75, 75, 1)',
                                data,
                                fill: false,
                                pointBorderWidth: 0,
                            }
                        ],
                    }}
                    options={
                        chartOptions
                    }
                    height={ 100 }
                />
                {/* @ts-ignore */}
                { Math.round(((new Date()) - (new Date(lastTime)))/60000)} минут назад { title } была { value } { point }. Она входит в рамки допустимых значений: { lowerBorder } { point } ⩽ { value } { point } ⩽ { upperBorder } { point }
                <br/><br/><br/>
            </div>
        );
    }
}
class LastSensorsLogs extends Component {
    static contextType = GlobalContext;
    render() {
        return (
            <div>
                { this.context.sensors.map( sensor => sensor.isConnected && !!sensor.lastRecord && (
                    <SensorVisualization
                        key={ sensor.lastRecord._id }
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
                { this.context.sensors.map( sensor => ( !sensor.isConnected || !!sensor.lastRecord ) && (
                    <div> { sensor.title } недоступна, потому что датчик не подключён. </div>
                ) ) }
            </div>
        );
    }
}

export default LastSensorsLogs;
