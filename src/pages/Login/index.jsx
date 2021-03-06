import React from "react";
import { withRouter } from "react-router-dom";
import AuthForm from "../../components/AuthForm";

const Login = props => <AuthForm formType="login"/>;

export default withRouter( Login );
