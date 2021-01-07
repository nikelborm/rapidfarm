import React, { Component } from "react";
import { PublicContent } from "../Public";
import { withRouter, Redirect } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";
import Divider from "../../components/Divider";

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
                <Divider/>
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
        return this.context.isFarmConnected && <AdminContent/>;
    }
}

export default withRouter( AdminPage );
