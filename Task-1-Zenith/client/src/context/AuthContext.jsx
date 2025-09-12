import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from './apiClient.js'; // Import the new API client

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiClient('/auth/me');
                setUser(data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await apiClient('/auth/logout', { method: 'POST' });
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const value = { user, setUser, loading, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

