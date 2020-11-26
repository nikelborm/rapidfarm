import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import AdminRoute from "./AdminPage";
import LogoutRoute from "./LogoutPage";
import AuthorizationRoute from "./AuthorizationPage";
import { PublicRoute } from "./PublicPage";

class App extends Component {
    render() {
        return (
            <Switch>
                <AuthorizationRoute exact path="/authorization" />
                <LogoutRoute exact path="/logout"/>
                <AdminRoute  exact path="/admin" />
                <PublicRoute exact path="/"      />
                <Route path="*">
                    <Redirect to="/"/>
                </Route>
            </Switch>
        );
    }
}

export default App;
