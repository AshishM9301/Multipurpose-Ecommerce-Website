'use client'

import { useRouter } from 'next/router';
import React, { createContext, useState, useEffect, useContext } from 'react';

type Role = 'super_admin' | 'admin' | 'seller' | 'customer';

interface User {
    id: string;
    email: string;
    role: Role;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string, isCustomer: boolean) => Promise<{ success: boolean; redirectUrl?: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const roleRoutes: Record<Role, string> = {
    super_admin: '/admin/dashboard',
    admin: '/admin/dashboard',
    seller: '/seller/dashboard',
    customer: '/account-overview',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.isAuthenticated) {
                setUser(data.user);
                return data.user;
            } else {
                setUser(null);
                return null;
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string, isCustomer: boolean) => {
        try {
            const endpoint = isCustomer ? '/api/login' : '/api/auth/admin/login';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            if (response.ok) {
                const { data } = await response.json();
                setUser({ id: data.id, email: data.email, role: data.role });
                return { success: true, redirectUrl: roleRoutes[data.role] };
            } else {
                return { success: false };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false };
        }
    };

    const logout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setUser(null);
                // Clear any client-side storage if you're using it
                localStorage.removeItem('userRole');
                // Optionally, you can redirect to the login page here
                // window.location.href = '/login';
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
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

export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    allowedRoles: Role[]
) {
    return function AuthComponent(props: P) {
        const { user, loading, checkAuth } = useAuth();
        const [isAuthorized, setIsAuthorized] = useState(false);

        useEffect(() => {
            const verifyAuth = async () => {
                const authUser = await checkAuth();
                if (!authUser || (authUser.role !== 'super_admin' && !allowedRoles.includes(authUser.role))) {
                    window.location.href = '/member-login';
                } else {
                    setIsAuthorized(true);
                }
            };
            verifyAuth();
        }, []);

        if (loading) {
            return <div>Loading...</div>;
        }

        if (!isAuthorized) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}
// export { AuthProvider, useAuth, withAuth };