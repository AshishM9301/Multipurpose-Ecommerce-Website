'use client'

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    return (
        <header className={`${isHomePage ? 'bg-navy' : 'bg-white'} ${isHomePage ? 'text-white' : 'text-gray-800'} py-4`}>
            <div className="max-w-[1440px] mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    <svg className="w-8 h-8 inline-block mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zm-3-8l-5 5-3-3-2 2v4h14v-4l-4-4z" />
                    </svg>
                </Link>
                <nav>
                    <ul className="flex space-x-6">
                        <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
                        <li className="relative group">
                            <Link href="/categories" className="hover:text-gray-300 flex items-center">
                                Categories
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Link>
                        </li>
                        <li><Link href="/contact" className="hover:text-gray-300">Contact Us</Link></li>
                        <li><Link href="/blog" className="hover:text-gray-300">Blog</Link></li>
                    </ul>
                </nav>
                <div className="flex space-x-4 items-center">
                    <div className="relative group">
                        <button className="flex items-center hover:text-gray-300 cursor-pointer">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                            {isAuthenticated ? (
                                <>
                                    <Link href="/account-overview" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account Overview</Link>
                                    <Link href="/address" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Address</Link>
                                    <Link href="/orders/history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Order History</Link>
                                    <Link href="/payment-methods" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Payment Methods</Link>
                                    <Link href="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account Settings</Link>
                                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
                                    <Link href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                    <Link href="/cart" className="hover:text-gray-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </header>
    );
}   