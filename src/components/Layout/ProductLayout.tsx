'use client'

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

const priceRanges = ['$20.00 - $50.00', '$20.00 - $50.00', '$20.00 - $50.00', '$20.00 - $50.00'];

export default function ProductsLayout({ children }: { children: ReactNode }) {

    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('api/categories');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategories(data.categories); // Adjust based on your API response structure
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);


    return (
        <div className="container mx-auto px-4 py-8">

            <h1 className="text-3xl font-bold mb-6">Our Collection Of Products</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-1/4">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Categories</h2>
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search A Category"
                            className="border rounded p-2 mb-4 w-full"
                        />
                        {loading ? (
                            <p>Loading categories...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <>
                                <p className="text-sm mb-2">Showing {categories.length} category(ies)</p>
                                <ul>
                                    {categories.map((category, index) => (
                                        <Link key={index} href={`/products?category=${category.name.toString()}`} className="mb-2 flex items-center">
                                            <ChevronDownIcon className="h-4 w-4 mr-2" />
                                            <span>{category.name} ({index + 1})</span>
                                        </Link>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Price Range</h2>
                        <ul>
                            {priceRanges.map((range, index) => (
                                <li key={index} className="mb-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        {range}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main content */}
                <div className="w-full md:w-3/4">
                    {children}
                </div>
            </div>
        </div>
    );
}
