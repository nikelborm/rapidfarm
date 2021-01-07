import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import AdminRoute from "./pages/Admin";
import LogoutRoute from "./pages/Logout";
import PublicRoute from "./pages/Public";
import LoginRoute from "./pages/Login";
import RegisterRoute from "./pages/Register";

import Menu from "./components/Menu";
import Divider from "./components/Divider";
import GlobalContextBasedOnDataFromWS from "./components/GlobalContextBasedOnDataFromWS";

class App extends Component {
    render() {
        return (
            <React.StrictMode>
                <Container>
                    <GlobalContextBasedOnDataFromWS>
                        <BrowserRouter>
                            <Menu/>
                            <Divider/>
                            <Switch>
                                <LoginRoute    path="/login"    exact/>
                                <RegisterRoute path="/register" exact/>
                                <LogoutRoute   path="/logout"   exact/>
                                <AdminRoute    path="/admin"    exact/>
                                <PublicRoute   path="/"         exact/>
                                <Route path="*">
                                    <Redirect to="/"/>
                                </Route>
                            </Switch>
                        </BrowserRouter>
                    </GlobalContextBasedOnDataFromWS>
                </Container>
            </React.StrictMode>
        );
    }
}

export default App;
