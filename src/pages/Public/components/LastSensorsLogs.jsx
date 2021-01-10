import React, { Component, PureComponent } from "react";
import { GlobalContext } from '../../../components/GlobalContextBasedOnDataFromWS';

class Record extends PureComponent {
    render() {
        const { lastTime, title, value, point, upperBorder, lowerBorder } = this.props;
        return (
            <div>
                { Math.round((
// @ts-ignore
                (new Date()) - (new Date(lastTime)))/60000)} минут назад { title } была { value } { point }. Она входит в рамки допустимых значений: { lowerBorder } { point } {"<="} { value } { point } {"<="} { upperBorder } { point }
            </div>
        );
    }
}
class LastSensorsLogs extends Component {
    static contextType = GlobalContext;
    render() {
        return (
            <div>
                { this.context.sensors.map( sensor => {
                    return sensor.isConnected && !!sensor.lastRecord && <Record
                        key={ sensor.lastRecord._id }
                        lastTime={ sensor.lastRecord.date }
                        value={ sensor.lastRecord.value }
                        title={ sensor.title }
                        point={ sensor.measurementPoint }
                        upperBorder={ sensor.criticalBorders.upper }
                        lowerBorder={ sensor.criticalBorders.lower }
                    />
                } ) }
            </div>
        );
    }
}

export default LastSensorsLogs;
