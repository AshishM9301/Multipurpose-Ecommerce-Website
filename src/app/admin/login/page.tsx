import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
    const router = useRouter();

    useEffect(() => {
        // Check if admin is logged in
        const token = localStorage.getItem('adminToken');
        if (token) {
            router.push('/admin/dashboard');
        }
    }, []);

    return (
        <div>
            <h1>Admin Login</h1>
            {/* Add admin login form here */}
        </div>
    );
}
