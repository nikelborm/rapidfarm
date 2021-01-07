import React, { Component } from "react";
import OneTimeChanger from "./OneTimeChanger";

class TimingsRow extends Component {
    render() {
        const [ from, to ] = this.props;
        return (
            <div>
                от <OneTimeChanger changerIndex={ 0 } initTime={ from }/>,
                до <OneTimeChanger changerIndex={ 1 } initTime={ to }/>
            </div>
        );
    }
}

export default TimingsRow;
