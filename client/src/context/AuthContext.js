"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState("");
    const [user, setUser] = useState([]);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token")); // or sessionStorage / cookie
        const type = JSON.parse(localStorage.getItem("type"));
        setUserType(type);
        setIsAuthenticated(!!token);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userType, setUserType, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
