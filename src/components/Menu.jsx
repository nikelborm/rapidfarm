import React, { PureComponent, Component } from "react";
import { withRouter } from "react-router";
import Nav from "react-bootstrap/Nav";
import LinkContainer from "react-router-bootstrap/lib/LinkContainer";
import { GlobalContext } from "./GlobalContextBasedOnDataFromWS";

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
const blockedReg = <div style={ { padding: ".5rem 1rem" } }>Регистрация отключена</div>;

const sets = {
    "/":         class extends PureComponent { render = () => <> { login } { this.props.isReg ? register : blockedReg } </>},
    "/login":    class extends PureComponent { render = () => <> { main } { this.props.isReg ? register : blockedReg } </>},
    "/register": class extends PureComponent { render = () => <> { main } { login } </> },
    "/admin":    class extends PureComponent { render = () => <> { logout } </> }
}

class Menu extends Component {
    static contextType = GlobalContext;
    shouldComponentUpdate( nextProps, nextState, nextContext ) {
        return nextContext.isRegistrationAllowed !== this.context.isRegistrationAllowed || nextProps.location.pathname !== this.props.location.pathname;
    }
    render() {
        const path = this.props.location.pathname;
        return (
            <Nav
                className="justify-content-center"
                children={ path in sets
                    ? React.createElement(
                        sets[ path ],
                        { isReg: this.context.isRegistrationAllowed }
                    )
                    : ""
                }
            />
        );
    }
}

export default withRouter( Menu );
