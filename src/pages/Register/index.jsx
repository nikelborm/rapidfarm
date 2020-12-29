import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";

class Register extends Component {
    static contextType = GlobalContext;
    render() {
        return (
            this.context.isRegistrationAllowed
                ? <AuthForm formType="register"/>
                : <Redirect to="/"/>
        );
    }
}

export default withRouter( Register );
