import React, { Component } from "react";
import { PublicContent } from "../Public";
import { withRouter, Redirect } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";
import Divider from "../../components/Divider";
import FarmStatus from "../../components/FarmStatus";

class AdminContent extends Component {
    static contextType = GlobalContext;
    render() {
        return (
            <>
                <h2>
                    Пользователь: { this.context.fullName }
                </h2>
                <Divider/>
                <PublicContent/>
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
        return (
            <>
                <FarmStatus/>
                <Divider/>
                { this.context.isFarmConnected && <AdminContent/> }
            </>
        );
    }
}

export default withRouter( AdminPage );
