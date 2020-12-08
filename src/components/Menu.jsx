import React, { PureComponent, Component } from "react";
import { withRouter } from "react-router";
import Nav from "react-bootstrap/Nav";
import LinkContainer from "react-router-bootstrap/lib/LinkContainer";
import { isRegistrationAllowed } from "./AuthManager";

class MenuPoint extends PureComponent {
    render() {
        const { to, text } = this.props;
        return (
            <Nav.Item>
                <LinkContainer to={ to }>
                    <Nav.Link children={ text }/>
                </LinkContainer>
            </Nav.Item>
        );
    }
}
const logout =   <MenuPoint to="/logout"   text="Выйти из аккаунта..."/>;
const register = <MenuPoint to="/register" text="Создать аккаунт..."  />;
const login =    <MenuPoint to="/login"    text="Войти в аккаунт..."  />;
const main =     <MenuPoint to="/"         text="На главную..."       />;
class Menu extends Component {
    constructor( props ) {
        super( props );

        this.dynamicRenders = {
            "/login": () => <> { main }  { isRegistrationAllowed() && register } </>,
            "/":      () => <> { login } { isRegistrationAllowed() && register } </>
        };
        this.staticRenders = {
            "/register": <> { main } { login } </>,
            "/admin": <> { logout } </>
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.location.pathname !== this.props.location.pathname;
    }
    render() {
        const path = this.props.location.pathname;
        return (
            <Nav
                className="justify-content-center"
                children={
                    path in this.dynamicRenders
                        ? this.dynamicRenders[ path ]()
                        : path in this.staticRenders
                            ? this.staticRenders[ path ]
                            : ""
                }
            />
        );
    }
}

export default withRouter( Menu );
