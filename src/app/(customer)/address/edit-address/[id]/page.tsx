'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddressForm from '@/components/AddressForm';

interface Address {
    id: number;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

export default function EditAddress({ params }: { params: { id: string } }) {
    const [address, setAddress] = useState<Address | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await fetch(`/api/addresses/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAddress(data);
                } else {
                    console.error('Failed to fetch address');
                }
            } catch (error) {
                console.error('Error fetching address:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddress();
    }, [params.id]);

    const handleSubmit = async (formData: Address) => {
        try {
            const response = await fetch(`/api/addresses/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/address');
            } else {
                console.error('Failed to update address');
            }
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!address) {
        return <div>Address not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Address</h1>
            <AddressForm initialData={address} onSubmit={handleSubmit} />
        </div>
    );
}