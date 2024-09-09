'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import ProductCard from '@/components/Cards/ProductCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    discountPercentage: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();

    const category = searchParams.get('category');




    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const search = searchParams.get('search') || '';
                setSearchTerm(search);
                const response = await fetch(`/api/products?search=${search}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
                // You might want to set an error state here and display it to the user
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
            params.set('search', searchTerm);

        } else {
            params.delete('search');
        }
        router.push(`/products?${params.toString()}`);
    };

    return (
        <>
            <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search An Item"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </button>
                </div>
            </form>

            {isLoading ? (
                <p>Loading products...</p>
            ) : (
                <>
                    <p className="text-sm text-gray-600 mb-2">
                        Showing 1-{products.length} of {products.length} item(s) <span className="font-bold">{category ? category : ''}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-6">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}
