import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";
import Commander from "./components/Commander";
import ProcessList from "./components/ProcessList";
import Divider from "../../components/Divider";
import FarmStatus from "../../components/FarmStatus";
import AllTimingsManager from "./components/AllTimingsManager";
import LastSensorsLogs from "./components/LastSensorsLogs";

export class PublicContent extends Component {
    render() {
        return (
            <>
                <h2>
                    Состояние процессов
                </h2>
                <br/>
                <ProcessList/>
                <Divider/>
                <h2>
                    Показания датчиков
                </h2>
                <br/>
                <LastSensorsLogs/>
                <Divider/>
                <h2>
                    Командный интерфейс
                </h2>
                <br/>
                <Commander/>
                <Divider/>
                <h2>
                    Управление таймингами
                </h2>
                <br/>
                <AllTimingsManager/>
            </>
        );
    }
}
class PublicPage extends Component {
    static contextType = GlobalContext;
    render() {
        if ( this.context.isAuthorized ) {
            return <Redirect to="/admin"/>;
        }
        return (
            <>
                <FarmStatus/>
                <Divider/>
                { this.context.isFarmConnected && <PublicContent/> }
            </>
        );
    }
}

export default withRouter( PublicPage );
