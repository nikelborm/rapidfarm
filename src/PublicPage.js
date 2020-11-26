import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export class PublicPage extends Component {
    static contextType = AuthContext;
    render() {
        if (this.context.isAuthorized) {
            return <Redirect to="/admin"/>;
        }
        return "Страница с графиками и инфой о состоянии теплицы";
    }
}


export const PublicRoute = withRouter(PublicPage);

