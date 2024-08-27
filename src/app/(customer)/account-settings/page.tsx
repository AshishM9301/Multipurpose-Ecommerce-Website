'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthStatus } from '@/utility/auth';
import { Country, State } from 'country-state-city';

interface Address {
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    shippingAddress: Address;
}

export default function AccountSetting() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);

    useEffect(() => {
        async function fetchUserData() {
            const authStatus = await getAuthStatus();
            if (!authStatus || authStatus.role !== 'customer') {
                router.push('/login');
            } else {
                try {
                    const response = await fetch('/api/user', {
                        credentials: 'include'
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUserData({
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            phone: data.phone,
                            shippingAddress: {
                                country: data.shippingAddress?.country || '',
                                address_line1: data.shippingAddress?.address_line1 || '',
                                address_line2: data.shippingAddress?.address_line2 || '',
                                city: data.shippingAddress?.city || '',
                                state: data.shippingAddress?.state || '',
                                postal_code: data.shippingAddress?.postal_code || '',
                            }
                        });

                    } else {
                        console.error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        }
        fetchUserData();
    }, [router]);

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (userData?.shippingAddress.country) {
            const countryStates = State.getStatesOfCountry(userData.shippingAddress.country);
            setStates(countryStates);
        }
    }, [userData?.shippingAddress.country]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData(prev => {
            if (!prev) return null;
            if (name.startsWith('shippingAddress.')) {
                const addressField = name.split('.')[1];
                return {
                    ...prev,
                    shippingAddress: {
                        ...prev.shippingAddress,
                        [addressField]: value
                    }
                };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
                credentials: 'include'
            });

            if (response.ok) {
                console.log('Profile updated successfully');
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Settings</h2>
                        <p className="text-gray-600 mb-6">Update your account information below.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Profile Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={userData?.firstName || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={userData?.lastName || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            disabled
                                            value={userData?.email || ''}
                                            onChange={handleInputChange}
                                            className=" w-full px-3 py-2 border bg-gray-300 border-gray-300 rounded-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={userData?.phone || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Address Information</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">Shipping address</label>
                                        <input
                                            type="text"
                                            id="shippingAddress"
                                            name="shippingAddress"
                                            value={userData?.shippingAddress.address_line1 + " " + userData?.shippingAddress.address_line2 || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <select
                                                id="country"
                                                name="country"
                                                value={userData?.shippingAddress.country || ''}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select a country</option>
                                                {countries.map((country) => (
                                                    <option key={country.isoCode} value={country.isoCode}>
                                                        {country.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                            <select
                                                id="state"
                                                name="state"
                                                value={userData?.shippingAddress.state || ''}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select a state</option>
                                                {states.map((state) => (
                                                    <option key={state.isoCode} value={state.isoCode}>
                                                        {state.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={userData?.shippingAddress.city || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                            <input
                                                type="text"
                                                id="zipCode"
                                                name="zipCode"
                                                value={userData?.shippingAddress.postal_code || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-semibold">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}