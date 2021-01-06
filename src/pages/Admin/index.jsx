import React, { Component } from "react";
import { PublicContent } from "../Public";
import { withRouter, Redirect } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";

class AdminContent extends Component {
    render() {
        return (
            <h2>
                Какие-то Дополнительные кнопки для управления фермой на правах админа
            </h2>
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
                <h2>
                    Здравствуйте, { this.context.fullName }.
                </h2>
                <hr/>
                <PublicContent/>
                <hr/>
                <AdminContent/>
            </div>
        );
    }
}

export default withRouter( AdminPage );
