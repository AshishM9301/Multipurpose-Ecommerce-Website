"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthStatus, clearAuthStatusCache } from '@/utility/auth';

export default function Login() {


    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     const timeoutId = setTimeout(async () => {
    //         await checkAuth();
    //     }, 5000); // 5 seconds timeout

    //     return () => clearTimeout(timeoutId);
    // }, [router]);

    // async function checkAuth() {
    //     try {
    //         const authStatus = await getAuthStatus();
    //         console.log(authStatus);
    //         if (authStatus) {
    //             clearAuthStatusCache();
    //             router.push('/account-overview');
    //         }
    //     } catch (error) {
    //         console.error('Error checking auth status:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.user.role);
                router.push('/account-overview');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

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