import React, { Component } from 'react';
import { PublicPage } from "./PublicPage";
import { withRouter, Redirect } from "react-router-dom";

class AdminPage extends Component {
    render() {
        if ( !this.context.isAuthorized ) {
            return <Redirect to="/authorization" />;
        }
        return (
            <div>
                {/* какие-то кнопки для управления фермой */}
                <PublicPage/>
            </div>
        );
    }
}

export default withRouter(AdminPage);
