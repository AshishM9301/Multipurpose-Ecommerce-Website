"use client";

import { useState, useEffect } from 'react';
import { useAuth, roleRoutes } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function CustomerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    const { login, user, loading, checkAuth } = useAuth();

    useEffect(() => {
        const redirectIfAuthenticated = async () => {
            const authUser = await checkAuth();
            if (authUser) {
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
            const result = await login(email, password, true);
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
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-md w-full space-y-8 p-8">
                <h2 className="text-3xl font-bold mb-6">Login</h2>
                <p className="text-sm mb-8">
                    Do not have an account?{' '}
                    <Link href="/register" className="text-blue-600 hover:underline">
                        create a new one
                    </Link>
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Enter Your Email Or Phone
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="michael.joe@xmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Enter Your Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-4">
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Forgot Your Password
                    </Link>
                </div>
                {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}