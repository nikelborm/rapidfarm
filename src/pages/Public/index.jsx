import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { AuthContext } from "../../components/AuthManager";
import Hello from "./components/Hello";
import ProcessList from "./components/ProcessList";

export class PublicContent extends Component {
    render() {
        return <>
            <Hello/>
            <ProcessList/>
        </>;
    }
}
class PublicPage extends Component {
    static contextType = AuthContext;
    render() {
        if ( this.context.isAuthorized ) {
            return <Redirect to="/admin"/>;
        }
        // return "Страница с графиками и инфой о состоянии теплицы";
        return <PublicContent/>;
    }
}

export default withRouter( PublicPage );
