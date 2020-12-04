import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
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
            <Process title="Полив" activity={true}></Process>
            <Process title="Аэрация" activity={true}></Process>
            <Process title="Свет" activity={false}></Process>
            <Process title="Подогрев почвы"></Process>
        </Container>;
    }
}

export const PublicRoute = withRouter( PublicPage );
