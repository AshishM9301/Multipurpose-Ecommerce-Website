import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SellerLogin() {
    const router = useRouter();

    useEffect(() => {
        // Check if seller is logged in
        const token = localStorage.getItem('sellerToken');
        if (token) {
            router.push('/seller/dashboard');
        }
    }, []);

    return (
        <div>
            <h1>Seller Login</h1>
            {/* Add seller login form here */}
        </div>
    );
}
