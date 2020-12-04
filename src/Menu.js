import React, { Component } from "react";
import { withRouter } from "react-router";
import { isRegistrationAllowed } from "./AuthProvider";
import Nav from 'react-bootstrap/Nav';
import LinkContainer from "react-router-bootstrap/lib/LinkContainer";

const MenuPoint = ({ to, text }) => (
    <Nav.Item>
        <LinkContainer to={to}>
            <Nav.Link children={text}/>
        </LinkContainer>
    </Nav.Item>
)
const logout = <MenuPoint to="/logout" text="Выйти из аккаунта..."/>;
const register = isRegistrationAllowed() && <MenuPoint to="/register" text="Создать аккаунт..."/>;
const login = <MenuPoint to="/login" text="Войти в аккаунт..."/>;
const main = <MenuPoint to="/" text="На главную..."/>;
class Menu extends Component {
    constructor(props) {
        super(props);

        this.swither = {
            "/login": <> {main} {register} </>,
            "/register": <> {main} {login} </>,
            "/admin": <> {logout} </>,
            "/": <> {register} {login} </>
        };
    }
    render() {
        const path = this.props.location.pathname;
        return (
            <Nav
                className="justify-content-center"
                children={ path in this.swither ? this.swither[path] : "" }
            />
        );
    }
}

export default withRouter(Menu);
