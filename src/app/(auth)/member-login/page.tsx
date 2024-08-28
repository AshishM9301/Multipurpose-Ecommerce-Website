'use client'

import { useState, useEffect } from 'react';
import { useAuth, roleRoutes } from '@/contexts/AuthContext';

export default function MemberLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    const { login, user, loading, checkAuth } = useAuth();

    useEffect(() => {
        const redirectIfAuthenticated = async () => {
            const authUser = await checkAuth();
            if (authUser && authUser.role !== 'customer') {
                setRedirectUrl(roleRoutes[authUser.role]);
            }
        };
        redirectIfAuthenticated();
    }, []);

    useEffect(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, [redirectUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const result = await login(email, password, false);
            if (result.success && result.redirectUrl) {
                setRedirectUrl(result.redirectUrl);
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (redirectUrl) {
        return <div>Redirecting...</div>;
    }

    return (
        <div>
            <h1>Member Login</h1>
            <form onSubmit={handleSubmit}>
                {/* Your form inputs here */}
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}


