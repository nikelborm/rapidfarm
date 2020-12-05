import React from "react";
import { Redirect, withRouter } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import { isRegistrationAllowed } from "../../components/AuthProvider";

const Register = props => (
    isRegistrationAllowed()
        ? <AuthForm formType="register"/>
        : <Redirect to="/"/>
);

export default withRouter( Register );
