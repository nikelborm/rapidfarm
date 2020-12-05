import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminRoute from "./pages/Admin";
import LogoutRoute from "./pages/Logout";
import PublicRoute from "./pages/Public";
import LoginRoute from "./pages/Login";
import RegisterRoute from "./pages/Register";
import Menu from "./components/Menu";

class App extends Component {
    render() {
        return (
            <>
                <Menu/>
                <Switch>
                    <LoginRoute exact path="/login"/>
                    <RegisterRoute exact path="/register"/>
                    <LogoutRoute exact path="/logout"/>
                    <AdminRoute  exact path="/admin" />
                    <PublicRoute exact path="/"      />
                    <Route path="*">
                        <Redirect to="/"/>
                    </Route>
                </Switch>
            </>
        );
    }
}

export default App;
