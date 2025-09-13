import { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../apiClient.js'; 
import Spinner from '../components/Spinner.jsx';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiClient('/auth/me');
                setUser(data);
            } catch (error) {
                // This is expected if the user is not logged in
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

    const value = {
        user,
        isAuthenticated: !!user,
        logout,
    };

    if (loading) {
        return (
            <div className="bg-[#2D283E] min-h-screen flex justify-center items-center">
                <Spinner />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

