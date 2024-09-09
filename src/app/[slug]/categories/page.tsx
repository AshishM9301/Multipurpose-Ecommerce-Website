'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';

interface Category {
    id: number;
    name: string;
    is_active: boolean;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName }),
            });

            if (!response.ok) throw new Error('Failed to add category');

            const newCategory = await response.json();
            setCategories([...categories, newCategory]);
            setNewCategoryName('');
            setIsModalOpen(false);
        } catch (error) {
            setError('Error adding category. Please try again.');
        }
    };

    const toggleCategoryStatus = async (id: number, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !currentStatus }),
            });

            if (!response.ok) throw new Error('Failed to update category status');

            setCategories(categories.map(cat =>
                cat.id === id ? { ...cat, is_active: !currentStatus } : cat
            ));
        } catch (error) {
            console.error('Error updating category status:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Add Category
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
                    {categories.map((category, index) => (
                        <tr key={category.id}>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                {category.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {category.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                <button
                                    onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${category.is_active
                                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                        }`}
                                >
                                    {category.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Add New Category</h2>
                <form onSubmit={handleAddCategory}>
                    <div className="mb-4">
                        <label htmlFor="categoryName" className="block mb-2">
                            Category Name
                        </label>
                        <input
                            type="text"
                            id="categoryName"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Add Category
                    </button>
                </form>
            </Modal>
        </div>
    );
}
