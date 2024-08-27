'use client'

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthStatus, clearAuthStatusCache } from '@/utility/auth';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const authStatus = await getAuthStatus();
        setIsAuthenticated(!!authStatus);
        setUser(authStatus);
        setLoading(false);
    };

    const login = (token: string) => {
        // Set the token in a cookie or localStorage
        document.cookie = `auth_token=${token}; path=/;`;
        checkAuthStatus();
    };

    const logout = () => {
        // Remove the token
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        clearAuthStatusCache();
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
