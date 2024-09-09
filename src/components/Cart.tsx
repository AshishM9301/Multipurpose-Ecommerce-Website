'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { removeFromCart, updateQuantity } from '@/redux/cartSlice';

export default function Cart() {
    const cartItems = useAppSelector(state => state.cart.items);
    const dispatch = useAppDispatch();

    const handleRemove = (id: number) => {
        dispatch(removeFromCart(id));
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        dispatch(updateQuantity({ id, quantity }));
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center mb-2">
                            <span>{item.name}</span>
                            <div>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                    className="w-16 mr-2 p-1 border rounded"
                                />
                                <button onClick={() => handleRemove(item.id)} className="text-red-500">Remove</button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4">
                        <strong>Total: ${total.toFixed(2)}</strong>
                    </div>
                </>
            )}
        </div>
    );
}
