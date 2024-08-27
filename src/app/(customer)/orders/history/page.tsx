import React from 'react';

const OrderHistory = () => {
    const orders = [
        { id: 2133, item: 'Double Bed & Dressing', status: 'In Progress', trackingId: '217641387612', deliveryDate: '23/07/2021', price: '$168.20' },
        { id: 2133, item: 'Double Bed & Dressing', status: 'In Progress', trackingId: '217641387612', deliveryDate: '23/07/2021', price: '$168.20' },
        { id: 2133, item: 'Double Bed & Dressing', status: 'In Progress', trackingId: '217641387612', deliveryDate: '23/07/2021', price: '$168.20' },
        { id: 2133, item: 'Double Bed & Dressing', status: 'In Progress', trackingId: '217641387612', deliveryDate: '23/07/2021', price: '$168.20' },
        { id: 2133, item: 'Double Bed & Dressing', status: 'In Progress', trackingId: '217641387612', deliveryDate: '23/07/2021', price: '$168.20' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Order History</h1>
            <p className="mb-6 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Order no</th>
                            <th className="p-3 text-left">Items</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Tracking ID</th>
                            <th className="p-3 text-left">Delivery Date</th>
                            <th className="p-3 text-left">Price</th>
                            <th className="p-3 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-3">{order.id}</td>
                                <td className="p-3">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gray-300 mr-3"></div>
                                        <span>{order.item}</span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-3">{order.trackingId}</td>
                                <td className="p-3">
                                    {order.deliveryDate}
                                    <br />
                                    <span className="text-gray-500 text-sm">(Expected)</span>
                                </td>
                                <td className="p-3">{order.price}</td>
                                <td className="p-3">
                                    <button className="text-blue-500 hover:underline">Re-Order →</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderHistory;