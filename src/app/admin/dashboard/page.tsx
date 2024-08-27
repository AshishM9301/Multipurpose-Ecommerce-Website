'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (!role || (role !== 'admin' && role !== 'super_admin')) {
            router.push('/admin-login');
        } else {
            setUserRole(role);
        }
    }, []);

    if (!userRole) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{userRole === 'super_admin' ? 'Super Admin' : 'Admin'} Dashboard</h1>
            {/* Implement dashboard features based on user role */}
        </div>
    );
}
