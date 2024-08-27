'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerDashboard() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (!role || role !== 'seller') {
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
            <h1>Seller Dashboard</h1>
            {/* Implement seller dashboard features */}
        </div>
    );
}
