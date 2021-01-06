import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";
import Commander from "./components/Commander";
import ProcessList from "./components/ProcessList";

export class PublicContent extends Component {
    render() {
        return (
            <>
                <ProcessList/>
                <br/>
                <Commander/>
            </>
        );
    }
}
class PublicPage extends Component {
    static contextType = GlobalContext;
    render() {
        if ( this.context.isAuthorized ) {
            return <Redirect to="/admin"/>;
        }
        // return "Страница с графиками и инфой о состоянии теплицы";
        return <PublicContent/>;
    }
}

export default withRouter( PublicPage );
