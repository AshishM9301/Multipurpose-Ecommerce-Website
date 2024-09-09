'use client';

import { useState, useEffect } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    products_count: number;
    orders_count: string;
    sales_count: string;
    total_earned: string;
    total_spent: string;
}

type SortKey = keyof User;

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users/stats');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const sortUsers = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedUsers = [...users].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });

        setUsers(sortedUsers);
    };

    const getSortIcon = (key: SortKey) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <FaSort />;
        }
        return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <button className="flex items-center" onClick={() => sortUsers('first_name')}>
                                    Name {getSortIcon('first_name')}
                                </button>
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <button className="flex items-center" onClick={() => sortUsers('email')}>
                                    Email {getSortIcon('email')}
                                </button>
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <button className="flex items-center" onClick={() => sortUsers('role')}>
                                    Role {getSortIcon('role')}
                                </button>
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <button className="flex items-center" onClick={() => sortUsers('products_count')}>
                                    Products {getSortIcon('products_count')}
                                </button>
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <button className="flex items-center" onClick={() => sortUsers('sales_count')}>
                                    Sales {getSortIcon('sales_count')}
                                </button>
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <button className="flex items-center" onClick={() => sortUsers('orders_count')}>
                                    Orders {getSortIcon('orders_count')}
                                </button>
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <button className="flex items-center" onClick={() => sortUsers('total_spent')}>
                                    Total Spent {getSortIcon('total_spent')}
                                </button>
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <button className="flex items-center" onClick={() => sortUsers('total_earned')}>
                                    Total Earned {getSortIcon('total_earned')}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">{user.first_name} {user.last_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">{user.products_count}</td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">{user.sales_count}</td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">{user.orders_count}</td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">${Number(user.total_spent).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">${Number(user.total_earned).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
