'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectCartItems, removeFromCart, updateQuantity, setCartItems, addToCart, saveCart } from '@/redux/cartSlice';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import ProductCard from '@/components/Cards/ProductCard';
import { getAuthStatus } from '@/utility/auth';
import { useRouter } from 'next/navigation';

interface SuggestedProduct {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    image_path: string;
    discountPercentage: number;
}

export default function CartPage() {
    const router = useRouter()

    const cartItems = useAppSelector(selectCartItems);
    const dispatch = useAppDispatch();
    const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await getAuthStatus();
            setIsAuthenticated(!!authStatus);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const loadCart = async () => {
            if (isAuthenticated) {
                try {
                    const response = await fetch('/api/cart', {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        dispatch(setCartItems(data.cartItems));
                    } else {
                        console.error('Failed to load cart from server');
                    }
                } catch (error) {
                    console.error('Error loading cart:', error);
                }
            } else {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    dispatch(setCartItems(JSON.parse(savedCart)));
                }
            }
        };
        loadCart();
    }, [isAuthenticated, dispatch]);

    const handleAddToCart = (product: SuggestedProduct) => {
        dispatch(addToCart(product));
        dispatch(saveCart()); // Save cart after adding
    };

    const handleRemoveFromCart = (id: number) => {
        dispatch(removeFromCart(id));
        dispatch(saveCart()); // Save cart after removing
    };

    const handleUpdateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity === 0) {
            handleRemoveFromCart(id);
        } else {
            dispatch(updateQuantity({ id, quantity: newQuantity }));
            dispatch(saveCart()); // Save cart after updating quantity
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    useEffect(() => {
        const fetchSuggestedProducts = async () => {
            try {
                const res = await fetch('/api/products?limit=4');
                if (!res.ok) throw new Error('Failed to fetch suggested products');
                const data = await res.json();
                setSuggestedProducts(data.products);
            } catch (error) {
                console.error('Error fetching suggested products:', error);
            }
        };

        fetchSuggestedProducts();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty. <Link href="/products" className="text-blue-500 hover:underline">Go shopping</Link></p>
            ) : (
                <div className="bg-gray-100 p-8 rounded-lg">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="md:w-2/3">
                            <table className="w-full bg-white">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6">Product</th>
                                        <th className="text-right py-4 px-6">Price</th>
                                        <th className="text-center py-4 px-6">Quantity</th>
                                        <th className="text-right py-4 px-6">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="py-6 px-6 flex items-center">
                                                <button onClick={() => dispatch(removeFromCart(item.id))} className="mr-4 text-gray-400 hover:text-gray-600 text-xl">
                                                    ×
                                                </button>
                                                <Image src={item.image_path || '/next.svg'} alt={item.name} width={60} height={60} className="mr-6" />
                                                {item.name}
                                            </td>
                                            <td className="text-right py-6 px-6">${Number(item.price).toFixed(2)}</td>
                                            <td className="text-center py-6 px-6">
                                                <div className="flex justify-center items-center">
                                                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="border rounded-l px-3 py-1">
                                                        −
                                                    </button>
                                                    <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                                                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="border rounded-r px-3 py-1">
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="text-right py-6 px-6">${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="md:w-1/3">
                            <div className="bg-white p-6">
                                <h2 className="text-xl font-bold mb-8">Cart Total</h2>
                                <div className="flex justify-between items-center mb-6">
                                    <span>SUBTOTAL</span>
                                    <span>${Number(totalPrice).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-6">
                                    <span>DISCOUNT</span>
                                    <span>—</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-lg mt-8 pt-8 border-t">
                                    <span>TOTAL</span>
                                    <span>${Number(totalPrice).toFixed(2)}</span>
                                </div>
                                <button onClick={() => router.push('checkout')} className="w-full text-white py-4 px-6 rounded mt-10 bg-black hover:bg-gray-800">
                                    Proceed To Checkout
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {suggestedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
