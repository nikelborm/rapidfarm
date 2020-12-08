import React, { Component } from "react";
import { PublicContent } from "../Public";
import { withRouter, Redirect } from "react-router-dom";
import { AuthContext } from "../../components/AuthManager";

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
    static contextType = AuthContext;
    render() {
        if ( !this.context.isAuthorized ) {
            return <Redirect to="/login" />;
        }
        return (
            <div>
                <PublicContent/>
                <AdminContent/>
            </div>
        );
    }
}

export default withRouter( AdminPage );
