import Link from 'next/link';
import Image from 'next/image';

const AccountOverview = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Account Overview</h1>
            <p className="text-gray-600 mb-8">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Upcoming Orders</h2>
                    <Link href="/track-order" className="text-blue-600 hover:underline flex items-center">
                        Track An Order
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left">Order no</th>
                            <th className="p-2 text-left">Items</th>
                            <th className="p-2 text-left">Delivery Date</th>
                            <th className="p-2 text-left">Tracking ID</th>
                            <th className="p-2 text-left">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2].map((_, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2">2133</td>
                                <td className="p-2">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 bg-gray-300 mr-2"></div>
                                        <span>Double Bed & Dressing</span>
                                    </div>
                                </td>
                                <td className="p-2">
                                    23-07-2021<br />
                                    <span className="text-gray-500">(Expected)</span>
                                </td>
                                <td className="p-2">
                                    <Link href="#" className="text-blue-600 hover:underline flex items-center">
                                        2176413876
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </Link>
                                </td>
                                <td className="p-2">$168.20</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Billing Methods</h2>
                    <Link href="/payment-methods" className="text-blue-600 hover:underline flex items-center">
                        View All payment and Billing Methods
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Mastercard (Default)</p>
                        <div className="flex items-center bg-gray-100 rounded-full p-2 w-full max-w-xs border border-gray-300">
                            <div className="w-8 h-8 bg-gray-400 rounded-full mr-2"></div>
                            <span className="text-gray-800">2736 3286 8332 2138</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Visa Card</p>
                        <div className="flex items-center bg-gray-100 rounded-full p-2 w-full max-w-xs border border-gray-300">
                            <div className="w-8 h-8 bg-gray-400 rounded-full mr-2"></div>
                            <span className="text-gray-800">2736 3286 8332 2138</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountOverview;