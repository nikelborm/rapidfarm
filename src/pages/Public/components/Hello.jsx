import React, { Component } from 'react';
import { AuthContext } from "../../../components/AuthManager";

class Hello extends Component {
    static contextType = AuthContext;
    render() {
        return (
            <h1>
                Здравствуйте, { this.context.fullname }.
            </h1>
        );
    }
}

export default Hello;
