'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';

interface Brand {
    id: number;
    name: string;
    is_active: boolean;
}

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBrandName, setNewBrandName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await fetch('/api/brands');
            if (!response.ok) throw new Error('Failed to fetch brands');
            const data = await response.json();
            setBrands(data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const handleAddBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/brands', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newBrandName }),
            });

            if (!response.ok) throw new Error('Failed to add brand');

            const newBrand = await response.json();
            setBrands([...brands, newBrand]);
            setNewBrandName('');
            setIsModalOpen(false);
        } catch (error) {
            setError('Error adding brand. Please try again.');
        }
    };

    const toggleBrandStatus = async (id: number, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/brands/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !currentStatus }),
            });

            if (!response.ok) throw new Error('Failed to update brand status');

            setBrands(brands.map(brand =>
                brand.id === id ? { ...brand, is_active: !currentStatus } : brand
            ));
        } catch (error) {
            console.error('Error updating brand status:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Brands</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Add Brand
                </button>
            </div>

            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Sl No
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map((brand, index) => (
                        <tr key={brand.id}>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                {brand.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${brand.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {brand.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                <button
                                    onClick={() => toggleBrandStatus(brand.id, brand.is_active)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${brand.is_active
                                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                        }`}
                                >
                                    {brand.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Add New Brand</h2>
                <form onSubmit={handleAddBrand}>
                    <div className="mb-4">
                        <label htmlFor="brandName" className="block mb-2">
                            Brand Name
                        </label>
                        <input
                            type="text"
                            id="brandName"
                            value={newBrandName}
                            onChange={(e) => setNewBrandName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Add Brand
                    </button>
                </form>
            </Modal>
        </div>
    );
}
