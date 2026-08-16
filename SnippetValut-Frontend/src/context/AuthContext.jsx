import { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, forgotPasswordApi, logoutApi, validateTokenApi, resetPasswordApi } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('snippet_vault_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await loginApi(email, password);
            // Backend might only return {success: true}
            // Ensure we at least keep the email for identification
            const userData = {
                email,
                ...(data.user || (data.success ? data : {}))
            };
            // Clean up success flag if it's just a boolean
            if (userData.success === true) delete userData.success;

            setUser(userData);
            localStorage.setItem('snippet_vault_user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const updateUser = (data) => {
        setUser(prev => {
            const updated = { ...prev, ...data };
            localStorage.setItem('snippet_vault_user', JSON.stringify(updated));
            return updated;
        });
    };

    const signup = async (name, username, email, password, phoneNo) => {
        try {
            const data = await registerApi(name, username, email, password, phoneNo);
            const userData = data.user || data;
            setUser(userData);
            localStorage.setItem('snippet_vault_user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout API failed", error);
        } finally {
            setUser(null);
            localStorage.removeItem('snippet_vault_user');
        }
    };

    const resetPasswordRequest = async (email) => {
        try {
            await forgotPasswordApi(email);
        } catch (error) {
            throw error;
        }
    };

    const resetPassword = async (token, password) => {
        try {
            await resetPasswordApi(token, password);
        } catch (error) {
            throw error;
        }
    };

    const validateToken = async (token) => {
        try {
            await validateTokenApi(token);
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading, resetPasswordRequest, resetPassword, validateToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
