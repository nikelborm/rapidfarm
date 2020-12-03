import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import AdminRoute from "./AdminPage";
import LogoutRoute from "./LogoutPage";
import { AuthForm } from "./AuthForm";
import { PublicRoute } from "./PublicPage";
import Menu from "./Menu";
import { isRegistrationAllowed } from "./AuthProvider";

class App extends Component {
    render() {
        return (<>
            <Menu/>
            <Switch>
                <Route exact path="/login">
                    <AuthForm formType="login"/>
                </Route>
                <Route
                    exact
                    path="/register"
                    render={()=> isRegistrationAllowed ? <Redirect to="/"/> : <AuthForm formType="register"/>}
                />
                <LogoutRoute exact path="/logout"/>
                <AdminRoute  exact path="/admin" />
                <PublicRoute exact path="/"      />
                <Route path="*">
                    <Redirect to="/"/>
                </Route>
            </Switch>
        </>);
    }
}

export default App;
