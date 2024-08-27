import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
    return (
        <div >
            <Header />


            {/* Hero Section */}
            <section className="text-center py-20 bg-navy text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Crafting Comfort, Redefining Spaces.</h1>
                    <h2 className="text-3xl font-semibold mb-6 drop-shadow-md">Your Home, Your Signature Style!</h2>
                    <p className="text-xl mb-10 max-w-3xl mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fringilla nunc in molestie feugiat. Nunc auctor consectetur elit, quis pulvina.</p>
                    <div className="flex justify-center">
                        <div className="relative">
                            <input type="text" placeholder="Search An Item" className="px-4 py-2 w-64 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300" />
                            <button className="absolute right-0 top-0 mt-2 mr-2">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>


            <main className="container mx-auto px-4">

                {/* Featured Products Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-200 aspect-square"></div>
                    ))}
                </section>

                {/* Categories Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-gray-200 aspect-video"></div>
                        ))}
                    </div>
                </section>

                {/* Featured Products Carousel */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
                    <div className="flex space-x-4 overflow-x-auto">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-200 w-64 h-64 flex-shrink-0"></div>
                        ))}
                    </div>
                </section>

                {/* Newsletter Signup */}
                <section className="bg-gray-100 p-8 text-center mb-12">
                    <h2 className="text-2xl font-bold mb-4">Sign up for our newsletter</h2>
                    <form className="flex justify-center">
                        <input type="email" placeholder="Enter your email" className="px-4 py-2 w-64 mr-2" />
                        <button type="submit" className="bg-black text-white px-6 py-2">Subscribe</button>
                    </form>
                </section>

                {/* Footer */}
                <footer className="border-t pt-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <h3 className="font-bold mb-2">Footer Column {i + 1}</h3>
                                <ul>
                                    <li><Link href="#">Link 1</Link></li>
                                    <li><Link href="#">Link 2</Link></li>
                                    <li><Link href="#">Link 3</Link></li>
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="text-center pb-8">
                        © 2024 Your Company Name. All rights reserved.
                    </div>
                </footer>
            </main>
        </div>
    );
}