'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectCartItems } from '@/redux/cartSlice';
import Link from 'next/link';
import Modal from '@/components/Modal';
import { FaCheck, FaCheckCircle } from 'react-icons/fa';

const CheckoutPage = () => {
    const cartItems = useAppSelector(selectCartItems);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [shippingMethod, setShippingMethod] = useState('Standard');
    const [isBilling, setIsBilling] = useState(false); // State to toggle between address and billing
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    useEffect(() => {
        // Fetch addresses from API or local storage
        const fetchAddresses = async () => {
            const response = await fetch('/api/addresses');
            const data = await response.json();
            setAddresses(data.addresses);
            setSelectedAddress(data.addresses.find(v => v.id === data.primaryAddressId));
        };
        fetchAddresses();
    }, []);

    const handleProceed = () => {
        setIsBilling(true); // Switch to billing form
    };

    const handlePaymentConfirmation = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate payment processing

        let payload = {
            products: cartItems.map(v => ({
                id: v.id,
                price: Number(v.price),
                quantity: v.quantity,
                name: v.name
            })),
            total_amount: total,
        };


        const response = await fetch('/api/order', { method: 'POST', body: JSON.stringify(payload) });
        const data = await response.json();

        console.log(data)


        // setIsModalOpen(true); // Open the modal on payment confirmation
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const shippingCost = shippingMethod === 'Express' ? 10 : 5; // Example shipping costs
    const subtotal = calculateSubtotal();
    const total = subtotal + shippingCost;

    const Billing = () => {
        return (
            <div className="w-2/3 max-w-xl px-4 py-5 border shadow border-gray-300 rounded-md">
                <h2 className="text-2xl font-semibold mb-4">Billing Information</h2>
                <form onSubmit={handlePaymentConfirmation}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name On Card*</label>
                        <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Card Number*</label>
                        <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div className="flex space-x-4 mb-4 justify-start">
                        <div className="w-[120px]">
                            <label className="block text-sm font-medium text-gray-700">Valid Through*</label>
                            <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div className="w-[120px]">
                            <label className="block text-sm font-medium text-gray-700">CVV*</label>
                            <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        </div>
                    </div>
                    <div className="flex items-center mb-4">
                        <input type="checkbox" id="saveAsDefault" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                        <label htmlFor="saveAsDefault" className="ml-2 block text-sm text-gray-900">Save As Default Payment Method</label>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Confirm Payment</button>
                </form>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className='flex justify-between w-full gap-x-3'>
                {!isBilling ? <div className='w-2/3'>
                    {/* Address Selection Section */}
                    <div className="mb-8">
                        <div className='flex justify-between pr-4 mb-6' >
                            <h2 className="text-2xl font-semibold mb-4">Select Shipping Address</h2>
                            <Link href="/address" className="text-blue-100 hover:bg-blue-900 hover:text-white bg-blue-600 rounded-md px-6 py-3">Add New Address</Link>
                        </div>
                        {addresses.length === 0 ? (<div>
                            <p>No addresses found. Please add an address.</p>

                        </div>
                        ) : (
                            <div className="space-y-4">
                                {addresses.map((address) => (<div key={address.id} onClick={(e) => setSelectedAddress(address)} className={`border p-4 rounded flex gap-x-2 ${selectedAddress?.id === address.id ? 'border-blue-500' : 'border-gray-300'}`}>
                                    <div>
                                        <input onChange={(e) => setSelectedAddress(address)} type="radio" id="html" name="fav_language" defaultValue="HTML" checked={address === selectedAddress} />
                                    </div>
                                    <div >
                                        <p>{address.address_line1}</p>
                                        {address.address_line2 && <p>{address.address_line2}</p>}
                                        <p>{`${address.city}, ${address.state} ${address.postal_code}`}</p>
                                        <p>{address.country}</p>
                                    </div>
                                </div>
                                ))}
                                {/* <Link href="/address" className="text-blue-600 hover:underline">Add New Address</Link> */}
                            </div>
                        )}
                    </div>

                    <button onClick={handleProceed} className="bg-blue-500 text-white py-2 px-4 rounded">Proceed to Billing</button>
                </div> : <Billing />}
                <div className="w-1/3 mt-8 md:mt-0 border px-4 pt-6 pb-3 rounded-md border-gray-300 shadow">
                    <h2 className="text-2xl font-semibold mb-4">Cart Details</h2>
                    <div className="bg-white p-4 rounded shadow">
                        {/* Table Header */}
                        <div className="flex justify-between font-bold border-b pb-2">
                            <span>PRODUCT</span>
                            <span>Quantity</span>
                            <span>SUBTOTAL</span>
                        </div>
                        <div className="space-y-2 mt-2">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center border-b py-2 font-semibold text-gray-600">
                                    <div className='flex-1'>
                                        <p className="font-medium">{item.name}</p>
                                    </div>
                                    <div className="flex flex-1 items-center">
                                        <p className="mr-2 flex-1">{item.quantity < 10 ? `0${item.quantity}` : item.quantity}</p>
                                        <p className=' flex-1 text-right'>${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 border-t pt-2 flex items-center justify-between">
                            <h3 className="font-semibold">SUBTOTAL</h3>
                            <div className="font-semibold text-gray-600 ">
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mt-4 border-t pt-2">

                            <div className="flex justify-between mt-2">
                                <span className='font-semibold '>{shippingMethod}</span>
                                <span className='font-semibold text-gray-600'>${shippingCost}</span>
                            </div>
                        </div>
                        <div className="mt-4 border-t border-teal-300 pt-2">

                            <div className="flex justify-between mt-2">
                                <span className='font-semibold '>Total</span>
                                <span className='font-semibold text-gray-600'>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal for Payment Confirmation */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} >
                <div className='min-w-[600px] flex flex-col align-center justify-center'>
                    <div className='flex justify-center my-8'>
                        <FaCheckCircle className='text-center' size={52} />
                    </div>
                    <h1 className='text-center text-3xl font-medium text-gray-700 my-4' >Thank You</h1>
                    <p className='text-sm text-gray-600 max-w-[440px] text-center mx-auto'>Your order has been confirmed & it is on the way. Check your email for the details.</p>
                    <div className="flex gap-x-10 my-10 self-center">
                        <Link href="/" className="bg-gray-800 text-white px-4 py-2 rounded-full px-4 py-3">Go to Homepage</Link>
                        <Link href="/order-details" className="bg-gray-200 text-gray-900 border border-gray-900 rounded-full px-4 py-3">Check Order Details</Link>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CheckoutPage;
