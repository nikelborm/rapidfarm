import React, { Component } from "react";
import { PublicContent } from "../Public";
import { withRouter, Redirect } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";

class AdminContent extends Component {
    render() {
        return (
            <div>
                Какие-то Дополнительные кнопки для управления фермой на правах админа
            </div>
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
            <div>
                <h1>
                    Здравствуйте, { this.context.fullName }.
                </h1>
                <PublicContent/>
                <AdminContent/>
            </div>
        );
    }
}

export default withRouter( AdminPage );
