import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminRoute from "./pages/Admin";
import LogoutRoute from "./pages/Logout";
import PublicRoute from "./pages/Public";
import LoginRoute from "./pages/Login";
import RegisterRoute from "./pages/Register";
import Menu from "./components/Menu";
import { createNewWebSocket } from "./tools/SocketManager";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";

class App extends Component {
    componentDidMount() {
        createNewWebSocket();
    }
    render() {
        return (
            <React.StrictMode>
                <BrowserRouter>
                    <AuthProvider>
                        <Menu/>
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
                    </AuthProvider>
                </BrowserRouter>
            </React.StrictMode>
        );
    }
}

export default App;
