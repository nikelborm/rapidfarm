import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";

class LogoutPage extends Component {
    static contextType = GlobalContext;
    render() {
        if ( !this.context.isAuthorized ) {
            return <Redirect to="/" />;
        }
        this.context.authorizationActions.logout();
        return "Выход из аккаунта...";
    }
}

export default withRouter( LogoutPage );
