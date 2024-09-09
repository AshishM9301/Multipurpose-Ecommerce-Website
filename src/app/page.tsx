'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import ProductCard from '@/components/Cards/ProductCard';

interface Product {
    id: number;
    name: string;
    price: number;
    image_url: string;
    description: string;
    seller_first_name: string;
    seller_last_name: string;
}

export default function Home() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProducts(1);
    }, []);

    const fetchProducts = async (page: number) => {
        try {
            const response = await fetch(`/api/products?page=${page}&limit=10&sort_by=created_at&sort_order=DESC`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(prevProducts => page === 1 ? data.products : [...prevProducts, ...data.products]);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSeeMore = () => {
        if (currentPage < totalPages) {
            fetchProducts(currentPage + 1);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div>
            <Header />

            {/* Updated Hero Section with Search Functionality */}
            <section className="text-center py-20 bg-gray-800 text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">
                        Crafting Comfort, Redefining Spaces.<br />
                        Your Home, Your Signature Style!
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fringilla nunc in malesuada
                        feugiat. Nunc auctor consectetur elit, quis pulvinar. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Nulla fringilla nunc in malesuada feugiat.
                    </p>
                    <div className="flex justify-center">
                        <form onSubmit={handleSearch} className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search An Item"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-3 px-4 pr-10 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <main className="container mx-auto px-4">
                {/* Featured Products Section */}
                <section className="my-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Featured Products</h2>
                        <p className="text-gray-600">Check out our latest arrivals</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {currentPage < totalPages && (
                        <div className="text-center mt-8">
                            <button
                                onClick={handleSeeMore}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                See More
                            </button>
                        </div>
                    )}
                </section>

                {/* Categories Section */}
                <section className="my-12">
                    <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Add category items here */}
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <h3 className="font-semibold">Electronics</h3>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <h3 className="font-semibold">Clothing</h3>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <h3 className="font-semibold">Home & Garden</h3>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <h3 className="font-semibold">Toys & Games</h3>
                        </div>
                    </div>
                </section>

                {/* Featured Sellers Section */}
                <section className="my-12">
                    <h2 className="text-2xl font-bold mb-6">Featured Sellers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Add featured seller items here */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="font-semibold mb-2">Seller Name</h3>
                            <p className="text-gray-600">Short description about the seller</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="font-semibold mb-2">Seller Name</h3>
                            <p className="text-gray-600">Short description about the seller</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="font-semibold mb-2">Seller Name</h3>
                            <p className="text-gray-600">Short description about the seller</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}