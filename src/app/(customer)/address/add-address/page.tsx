'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddressForm from '@/components/AddressForm';

interface Address {
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

export default function AddAddress() {
    const router = useRouter();

    const handleSubmit = async (formData: Address) => {
        try {
            const response = await fetch('/api/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/address');
            } else {
                console.error('Failed to add address');
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Add New Address
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <AddressForm onSubmit={handleSubmit} showDefaultOption={true} />
            </div>
        </div>
    );
}