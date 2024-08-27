'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Address {
    id: number;
    user_id: number;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

const Address = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [primaryAddressId, setPrimaryAddressId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await fetch('/api/addresses');
            if (response.ok) {
                const data = await response.json();
                setAddresses(data.addresses);
                setPrimaryAddressId(data.primaryAddressId);
            } else {
                console.error('Failed to fetch addresses');
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMakePrimary = async (addressId: number) => {
        try {
            const response = await fetch(`/api/addresses/${addressId}/make-primary`, {
                method: 'PUT',
            });
            if (response.ok) {
                setPrimaryAddressId(addressId);
            } else {
                console.error('Failed to set primary address');
            }
        } catch (error) {
            console.error('Error setting primary address:', error);
        }
    };

    const handleDelete = async (addressId: number) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const response = await fetch(`/api/addresses/${addressId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setAddresses(addresses.filter(address => address.id !== addressId));
                    if (primaryAddressId === addressId) {
                        setPrimaryAddressId(null);
                    }
                } else {
                    console.error('Failed to delete address');
                }
            } catch (error) {
                console.error('Error deleting address:', error);
            }
        }
    };

    if (isLoading) {
        return <div>Loading addresses...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Addresses</h1>
                <Link href="/address/add-address" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                    Add New Address
                </Link>
            </div>
            <div className="space-y-4">
                {addresses.map((address) => (
                    <div key={address.id} className={`border ${address.id === primaryAddressId ? 'border-blue-500' : 'border-gray-300'} rounded-lg p-4 relative`}>
                        <div className="flex justify-between items-start">
                            <div className="flex-grow">
                                <p className="text-gray-600">{address.address_line1}</p>
                                {address.address_line2 && <p className="text-gray-600">{address.address_line2}</p>}
                                <p className="text-gray-600">{`${address.city}, ${address.state} ${address.postal_code}`}</p>
                                <p className="text-gray-600">{address.country}</p>
                            </div>
                            <div className="flex space-x-2">
                                <Link href={`/address/edit-address/${address.id}`} className="text-blue-500 hover:text-blue-600">
                                    <PencilIcon className="h-5 w-5" />
                                </Link>
                                <button onClick={() => handleDelete(address.id)} className="text-red-500 hover:text-red-600">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        {address.id === primaryAddressId ? (
                            <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                                Primary
                            </span>
                        ) : (
                            <button
                                onClick={() => handleMakePrimary(address.id)}
                                className="absolute bottom-2 right-2 text-blue-500 text-sm hover:underline"
                            >
                                Make Primary
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Address;