import React, { Component } from "react";
import { PublicContent } from "../Public";
import { withRouter, Redirect } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";
import FarmStatus from "../../components/FarmStatus";

class AdminContent extends Component {
    static contextType = GlobalContext;
    render() {
        return (
            <>
                <h2>
                    Здравствуйте, { this.context.fullName }.
                </h2>
                <hr/>
                <PublicContent/>
                <hr/>
                <h2>
                    Какие-то Дополнительные кнопки для управления фермой на правах админа
                </h2>
            </>
        );
    }
}

class AdminPage extends Component {
    static contextType = GlobalContext;
    render() {
        if ( !this.context.isAuthorized ) {
            return <Redirect to="/login" />;
        }
        return <>
            <FarmStatus/>
            { this.context.isFarmConnected && <AdminContent/> }
        </>;
    }
}

export default withRouter( AdminPage );
