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
class DynamicRegister extends PureComponent {
    render = () => <> { main }  { this.props.is && register } </>;
}

class Menu extends Component {
    static contextType = GlobalContext;
    constructor( props ) {
        super( props );

        this.dynamicRenders = {
            "/login": () => <> { main }  { <DynamicRegister is={this.context.isRegistrationAllowed}/> && register } </>,
            "/":      () => <> { login } { <DynamicRegister is={this.context.isRegistrationAllowed}/> && register } </>
        };
        this.staticRenders = {
            "/register": <> { main } { login } </>,
            "/admin": <> { logout } </>
        };
    }
    shouldComponentUpdate( nextProps, nextState, nextContext ) {
        console.log('this.props.location.pathname: ', this.props.location.pathname);
        console.log('nextProps.location.pathname: ', nextProps.location.pathname);
        console.log('this.context.isRegistrationAllowed: ', this.context.isRegistrationAllowed);
        console.log('nextContext.isRegistrationAllowed: ', nextContext.isRegistrationAllowed);
        return nextContext.isRegistrationAllowed !== this.context.isRegistrationAllowed || nextProps.location.pathname !== this.props.location.pathname;
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
