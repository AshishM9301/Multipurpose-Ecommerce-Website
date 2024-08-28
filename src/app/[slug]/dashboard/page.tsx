'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

// Mock data fetching functions - replace with actual API calls
const fetchAdminStats = async () => ({ totalUsers: 1000, totalProducts: 5000, totalOrders: 10000 });
const fetchSellerStats = async () => ({ totalProducts: 100, totalSales: 5000, pendingOrders: 20 });
const fetchCustomerStats = async () => ({ orderCount: 50, totalSpent: 2500, wishlistItems: 10 });

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const loadStats = async () => {
            let fetchedStats;
            switch (user?.role) {
                case 'super_admin':
                case 'admin':
                    fetchedStats = await fetchAdminStats();
                    break;
                case 'seller':
                    fetchedStats = await fetchSellerStats();
                    break;
                case 'customer':
                    fetchedStats = await fetchCustomerStats();
                    break;
            }
            setStats(fetchedStats);
        };
        if (user) {
            loadStats();
        }
    }, [user]);

    if (!stats) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Welcome, {user?.role}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h2>
                        <p className="text-3xl font-bold">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}