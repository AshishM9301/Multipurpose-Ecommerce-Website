'use client'

import { withAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', roles: ['super_admin', 'admin', 'seller', 'customer'] },
        { href: '/admin/users', label: 'Manage Users', roles: ['super_admin', 'admin'] },
        { href: '/admin/brands', label: 'Manage Brands', roles: ['super_admin', 'admin'] },
        { href: '/admin/categories', label: 'Manage Categories', roles: ['super_admin', 'admin'] },
        { href: '/admin/settings', label: 'Platform Settings', roles: ['super_admin'] },
        { href: '/seller/products', label: 'Seller Products', roles: ['super_admin', 'seller'] },
        { href: '/customer/orders', label: 'My Orders', roles: ['super_admin', 'customer'] },
        { href: '/customer/profile', label: 'My Profile', roles: ['super_admin', 'customer'] },
    ];

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Horizontal Navigation */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-2xl font-bold text-gray-800">Dashboard</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="ml-3 relative">
                                <div>
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        id="user-menu"
                                        aria-haspopup="true"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src="https://via.placeholder.com/40"
                                            alt=""
                                        />
                                        <span className="ml-3 text-gray-700">{user?.email}</span>
                                    </button>
                                </div>
                                {showDropdown && (
                                    <div
                                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu"
                                    >
                                        <button
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            role="menuitem"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Vertical Navigation */}
                <nav className="w-64 bg-white shadow-md">
                    <div className="p-4">
                        <p className="text-sm text-gray-600">Role: {user?.role}</p>
                    </div>
                    <ul className="mt-4">
                        {navItems.map((item) => (
                            (user?.role === 'super_admin' || item.roles.includes(user?.role || '')) && (
                                <li key={item.href}>
                                    <Link href={item.href}
                                        className={`block py-2 px-4 text-gray-600 hover:bg-gray-200 ${pathname === item.href ? 'bg-gray-200 font-semibold' : ''
                                            }`}>
                                        {item.label}
                                    </Link>
                                </li>
                            )
                        ))}
                    </ul>
                </nav>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default withAuth(DashboardLayout, ['super_admin', 'admin', 'seller', 'customer']);