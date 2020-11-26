import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

class LogoutPage extends Component {
    static contextType = AuthContext;
    render() {
        if( !this.context.isAuthorized ) {
            return <Redirect to="/" />;
        }
        if( this.context.isAuthorized && !this.isLogoutInProcess ) {
            this.isLogoutInProcess = true;
            this.context.logout().then(() => {
                this.isLogoutInProcess = false;
            });
        }
        return "Выход из аккаунта...";
    }
}

export default withRouter(LogoutPage);
