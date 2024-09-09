'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { StarIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { useParams } from 'next/navigation';
import { getAuthStatus } from '@/utility/auth';
import ProductCard from '@/components/Cards/ProductCard';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    rating: number;
    reviewCount: number;
    discountPercentage: number;
    originalPrice: number;
    category: string;
    brand: string;
    seller: string;
}

interface SimilarProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    rating: number;
    reviewCount: number;
}

interface Review {
    id: number;
    name: string;
    review_text: string;
    rating: number;
    created_at: string;
}

export default function ProductDetailPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newReview, setNewReview] = useState({ name: '', email: '', reviewText: '', rating: 0 });
    const [user, setUser] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error('Failed to fetch product');
                const data = await res.json();
                setProduct(data.product);
                setSimilarProducts(data.similarProducts);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails();
    }, [id]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews?productId=${id}&page=${currentPage}`);
                if (!res.ok) throw new Error('Failed to fetch reviews');
                const data = await res.json();
                setReviews(data.reviews);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [id, currentPage]);

    useEffect(() => {
        const checkUser = async () => {
            const authStatus = await getAuthStatus();
            setUser(authStatus);
        };

        checkUser();
    }, []);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newReview, productId: id, userId: user?.id }),
            });
            if (!res.ok) throw new Error('Failed to submit review');
            setNewReview({ name: '', email: '', reviewText: '', rating: 0 });
            // Refresh reviews
            const reviewsRes = await fetch(`/api/reviews?productId=${id}&page=1`);
            const reviewsData = await reviewsRes.json();
            setReviews(reviewsData.reviews);
            setTotalPages(reviewsData.totalPages);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                    <Image src={product.images[0]} alt={product.name} width={500} height={500} className="w-full" />
                    <div className="grid grid-cols-4 gap-2">
                        {product.images.slice(1).map((img, index) => (
                            <Image key={index} src={img} alt={`${product.name} ${index + 2}`} width={100} height={100} className="w-full" />
                        ))}
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    {/* Category Link */}
                    <Link href={`/products?category=${product.category}`} className="border border-blue-800 bg-blue-200 rounded-full px-3 py-1 text-sm text-blue-800">
                        {product.category}
                    </Link>
                    <div className="flex items-center my-4">
                        <span className="text-2xl font-bold mr-2">${product.price.toFixed(2)}</span>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className={`h-5 w-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                            <span className="ml-2 text-sm text-gray-500">({product.reviewCount} reviews)</span>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-4">{product.description.slice(0, 150)}...</p>
                    <div className="flex items-center mb-4">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="bg-gray-200 p-2 rounded-full">
                            <MinusIcon className="h-5 w-5" />
                        </button>
                        <span className="mx-4 text-xl">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="bg-gray-200 p-2 rounded-full">
                            <PlusIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <button className="bg-black text-white py-2 px-4 rounded-full w-full">Add to Cart</button>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex border-b">
                    <button
                        className={`py-2 px-4 ${activeTab === 'description' ? 'border-b-2 border-black' : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Description
                    </button>
                    <button
                        className={`py-2 px-4 ${activeTab === 'reviews' ? 'border-b-2 border-black' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                </div>
                <div className="mt-4">
                    {activeTab === 'description' ? (
                        <p>{product.description}</p>
                    ) : (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                            {reviews.map((review) => (
                                <div key={review.id} className="mb-4 border-b pb-4">
                                    <div className="flex items-center mb-2">
                                        <span className="font-semibold mr-2">{review.name}</span>
                                        <span className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                    </div>
                                    <p>{review.review_text}</p>
                                </div>
                            ))}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-4">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`mx-1 px-3 py-1 border ${currentPage === page ? 'bg-gray-200' : ''}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <form onSubmit={handleSubmitReview} className="mt-6">
                                <h4 className="text-lg font-semibold mb-2">Write a Review</h4>
                                {!user && (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={newReview.name}
                                            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                            required
                                            className="w-full p-2 border mb-2"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            value={newReview.email}
                                            onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                                            required
                                            className="w-full p-2 border mb-2"
                                        />
                                    </>
                                )}
                                <textarea
                                    placeholder="Your Review"
                                    value={newReview.reviewText}
                                    onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                                    required
                                    className="w-full p-2 border mb-2"
                                ></textarea>
                                <select
                                    value={newReview.rating}
                                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                    required
                                    className="w-full p-2 border mb-2"
                                >
                                    <option value="">Select Rating</option>
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <option key={rating} value={rating}>
                                            {rating} Star{rating > 1 ? 's' : ''}
                                        </option>
                                    ))}
                                </select>
                                <button type="submit" className="bg-black text-white py-2 px-4 rounded-full">
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {similarProducts.map((prod) => (
                        <ProductCard key={prod.id} product={prod} />
                    ))}
                </div>
            </div>
        </div>
    );
}