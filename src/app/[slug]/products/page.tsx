'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    seller_id: number;
    category_id: number | null;
    brand_id: number | null;
    image_path: string | null;
}

export default function SellerProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Replace '1' with the actual seller ID (you might get this from context or props)
                const response = await fetch('/api/products?seller_id=1');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError('Failed to load products. Please try again later.');
                console.error('Error fetching products:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return <div className="text-center mt-8">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {product.image_path && (
                            <Image
                                src={product.image_path}
                                alt={product.name}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                            <p className="text-gray-600 mb-2">{product.description}</p>
                            <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
                            <div className="mt-4 flex justify-between">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit</button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
