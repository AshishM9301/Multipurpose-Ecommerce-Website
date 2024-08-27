'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navigation() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('adminToken');
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push('/');
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
            <ul className="flex space-x-4">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/products">Products</Link></li>
                {userRole && ['admin', 'super_admin', 'seller'].includes(userRole) ? (
                    <>
                        <li><Link href="/account">My Account</Link></li>
                        <li><Link href="/orders">Orders</Link></li>
                        {userRole === 'seller' && (
                            <>
                                <li><Link href="/seller/products">My Products</Link></li>
                                <li><Link href="/seller/orders">My Orders</Link></li>
                            </>
                        )}
                        {['admin', 'super_admin'].includes(userRole) && (
                            <>
                                <li><Link href="/admin/dashboard">Admin Dashboard</Link></li>
                                <li><Link href="/admin/users">Manage Users</Link></li>
                            </>
                        )}
                        {userRole === 'super_admin' && (
                            <li><Link href="/admin/settings">Platform Settings</Link></li>
                        )}
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : userRole === 'customer' ? (
                    <>
                        <li><Link href="/account">My Account</Link></li>
                        <li><Link href="/orders">My Orders</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link href="/login">Login</Link></li>
                        <li><Link href="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}
