import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";
import Commander from "./components/Commander";
import ProcessList from "./components/ProcessList";
import Divider from "../../components/Divider";

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
                    Командный интерфейс
                </h2>
                <br/>
                <Commander/>
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
        return this.context.isFarmConnected && <PublicContent/>;
    }
}

export default withRouter( PublicPage );
