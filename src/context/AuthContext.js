'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Check for token on load
    useEffect(() => {
        const currentToken = Cookies.get('token');
        if (currentToken) {
            setToken(currentToken);
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (phone) => {
        setLoading(true);
        setError(null);
        // Centralize state updates here
    };

    // Handle successful login
    const loginSuccess = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
        setIsAuthenticated(true);
        setLoading(false);
        setError(null);
        Cookies.set('token', tokenData, { expires: 7 });
    };

    const loginFailure = (message) => {
        setLoading(false);
        setError(message);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        Cookies.remove('token');
    };

    const setLoadingState = (isLoading) => setLoading(isLoading);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            loading,
            error,
            loginSuccess,
            loginFailure,
            logout,
            setLoading: setLoadingState
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
