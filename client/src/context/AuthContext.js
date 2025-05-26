"use client";

import { apiurl } from "@/defaults/apiurl";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState("");
    const [user, setUser] = useState([]);

    const GetUserDetails = async ({ token }) => {
        try {
            const res = await axios.get(`${apiurl}/api/v1/user/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const response = res.data;
            if (response?.status === 'success') {
                setUser(response.data)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        const token = localStorage.getItem("token"); // or sessionStorage / cookie
        const type = localStorage.getItem("type");
        setUserType(type);
        setIsAuthenticated(!!token);
        if (token) {
            GetUserDetails({ token: token })
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userType, setUserType, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
