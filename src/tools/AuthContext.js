import React from "react";

const AuthContext = React.createContext( {
    isAuthorized: false,
    fullName: "",
    logout: async () => {},
    register: async () => {},
    login: async () => {}
});

export default AuthContext;
