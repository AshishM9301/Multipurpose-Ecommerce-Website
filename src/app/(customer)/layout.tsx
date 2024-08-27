'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { getAuthStatus } from '@/utility/auth';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const authStatus = await getAuthStatus();
            if (!authStatus || authStatus.role !== 'customer') {
                router.push('/login');
            }
            setIsLoading(false);
        }
        checkAuth();
    }, [router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            {children}
        </>
    );
}