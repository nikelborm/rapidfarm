import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import AuthContext from "../../tools/AuthContext";
import Container from "react-bootstrap/Container";
import Process from "./Process";

export class PublicPage extends Component {
    static contextType = AuthContext;
    render() {
        if ( this.context.isAuthorized ) {
            return <Redirect to="/admin"/>;
        }
        // return "Страница с графиками и инфой о состоянии теплицы";
        return <Container>
            <Process title="Полив" activity={true}/>
            <Process title="Аэрация" activity={true}/>
            <Process title="Свет" activity={false}/>
            <Process title="Подогрев почвы"/>
        </Container>;
    }
}

export default withRouter( PublicPage );
