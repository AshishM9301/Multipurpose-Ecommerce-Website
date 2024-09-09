'use client';

import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart, removeFromCart, updateQuantity, selectCartItems, saveCart } from '@/redux/cartSlice';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAuthStatus } from '@/utility/auth';

interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    image_path: string;
    images: string[];
    discountPercentage: number;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItems);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await getAuthStatus();
            setIsAuthenticated(!!authStatus);
        };
        checkAuth();
    }, []);

    const cartItem = cartItems.find(item => item.id === product.id);
    const quantity = cartItem ? Number(cartItem.quantity) : 0;

    console.log(quantity)

    const handleAddToCart = () => {
        dispatch(addToCart(product));
        dispatch(saveCart()); // Dispatch the saveCart action
    };

    const handleRemoveFromCart = () => {
        dispatch(removeFromCart(product.id));
        dispatch(saveCart()); // Dispatch the saveCart action
    };

    const handleUpdateQuantity = (newQuantity: number) => {
        if (newQuantity === 0) {
            dispatch(removeFromCart(product.id));
        } else {
            dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
        }
        dispatch(saveCart()); // Dispatch the saveCart action
    };

    // const saveCart = async () => {
    //     if (isAuthenticated) {
    //         try {
    //             await fetch('/api/cart', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    //                 },
    //                 body: JSON.stringify({ cartItems: [...cartItems, product] })
    //             });
    //         } catch (error) {
    //             console.error('Error saving cart to server:', error);
    //         }
    //     } else {
    //         localStorage.setItem('cart', JSON.stringify([...cartItems, product]));
    //     }
    // };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link href={`/product/${product.id}`}>
                <Image
                    src={product.image_path || '/placeholder.jpg'}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover"
                />
            </Link>
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold">${Number(product.price).toFixed(2)}</span>
                    {product.discountPercentage > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                            ${Number(product.originalPrice).toFixed(2)}
                        </span>
                    )}
                </div>
                {quantity === 0 ? (
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Add to Cart
                    </button>
                ) : (
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => handleUpdateQuantity(quantity - 1)}
                            className="bg-gray-200 p-2 rounded-full"
                        >
                            <MinusIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="mx-2">{quantity}</span>
                        <button
                            onClick={() => handleUpdateQuantity(quantity + 1)}
                            className="bg-gray-200 p-2 rounded-full"
                        >
                            <PlusIcon className="h-4 w-4 text-gray-600" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
