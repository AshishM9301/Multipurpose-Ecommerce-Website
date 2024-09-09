'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectCartItems } from '@/redux/cartSlice';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch } from '@/redux/hooks';
import { initializeCart } from '@/redux/cartSlice';
import { useEffect } from 'react';
import { getAuthStatus } from '@/utility/auth';

export default function Header() {
    const cartItems = useAppSelector(selectCartItems);
    const dispatch = useAppDispatch();
    const itemCount = cartItems.length;
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, loading, logout } = useAuth();

    useEffect(() => {
        const loadCart = async () => {
            const authStatus = await getAuthStatus();
            if (authStatus) {
                try {
                    const response = await fetch('/api/cart', {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        dispatch(initializeCart(data.cartItems));
                    }
                } catch (error) {
                    console.error('Error loading cart:', error);
                }
            } else {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    console.log(savedCart)
                    dispatch(initializeCart(JSON.parse(savedCart)));
                }
            }
        };
        loadCart();
    }, [dispatch]);

    const isHome = pathname === '/';
    const bgColor = isHome ? 'bg-navy' : 'bg-white';
    const textColor = isHome ? 'text-white' : 'text-black';

    const handleLogout = async () => {
        await logout();
        setDropdownOpen(false);
    };

    return (
        <header className={`${bgColor} shadow-sm`}>
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className={`text-2xl font-bold ${textColor}`}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z" fill="currentColor" />
                        </svg>
                    </Link>
                    <nav className="hidden md:flex space-x-6">
                        <Link href="/" className={`${textColor} hover:text-gray-300`}>Home</Link>
                        <Link href="/products" className={`${textColor} hover:text-gray-300`}>Categories</Link>
                        <Link href="/about-us" className={`${textColor} hover:text-gray-300`}>Contact Us</Link>
                        <Link href="/blog" className={`${textColor} hover:text-gray-300`}>Blog</Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`${textColor} hover:text-gray-300`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    {loading ? (
                                        <div className="px-4 py-2 text-sm text-gray-700">Loading...</div>
                                    ) : user ? (
                                        <>
                                            <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</Link>
                                            <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
                                            <Link href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Register</Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <Link href="/cart" className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}