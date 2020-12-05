import React, { Component } from "react";
import { PublicPage } from "../Public";
import { withRouter, Redirect } from "react-router-dom";
import AuthContext from "../../tools/AuthContext";

class AdminPage extends Component {
    static contextType = AuthContext;
    render() {
        if ( !this.context.isAuthorized ) {
            return <Redirect to="/login" />;
        }
        return (
            <div>
                <PublicPage/>
                Какие-то Дополнительные кнопки для управления фермой на правах админа
            </div>
        );
    }
}

export default withRouter( AdminPage );
