import { createContext, useState, useEffect, useContext } from "react";
import React from "react";
import { SeasonContext } from './SeasonContext';

export const LoginContext = createContext();

const LoginProvider = ({ children }) => {
    const { setYearSeason } = useContext(SeasonContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setYearSeason(2025)
        setIsLoggedIn(false);
    };

    return (
        <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </LoginContext.Provider>
    )
}

export default LoginProvider;
