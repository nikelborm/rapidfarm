import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";

class LogoutPage extends Component {
    static contextType = GlobalContext;
    componentDidMount() {
        this.context.authorizationActions.logout();
    }
    render() {
        if ( !this.context.isAuthorized ) {
            return <Redirect to="/" />;
        }
        return "Выход из аккаунта...";
    }
}

export default withRouter( LogoutPage );
