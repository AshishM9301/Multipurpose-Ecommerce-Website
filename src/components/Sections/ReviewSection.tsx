import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Review {
    id: number;
    name: string;
    review_text: string;
    rating: number;
    created_at: string;
}

interface ReviewSectionProps {
    productId: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [newReview, setNewReview] = useState({ name: '', email: '', review_text: '', rating: 0 });
    const { data: session } = useSession();

    useEffect(() => {
        fetchReviews();
    }, [currentPage, productId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews/${productId}?page=${currentPage}`);
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();
            setReviews(data.reviews);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    userId: session?.userId,
                    ...newReview
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to submit review');
            }
            setNewReview({ name: '', email: '', review_text: '', rating: 0 });
            fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };



    return (
        <div className="review-section">
            <h2>Reviews</h2>
            {reviews.map((review) => (
                <div key={review.id} className="review-item">
                    <h3>{review.name}</h3>
                    <p>{review.review_text}</p>
                    <div>Rating: {review.rating}/5</div>
                </div>
            ))}

            {totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? 'active' : ''}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            <h3>Add a Review</h3>
            <form onSubmit={handleSubmitReview}>
                {!session && (
                    <>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={newReview.name}
                            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={newReview.email}
                            onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                            required
                        />
                    </>
                )}
                <textarea
                    placeholder="Your Review"
                    value={newReview.review_text}
                    onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                />
                <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                    required
                >
                    <option value="">Select Rating</option>
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                            {rating} Star{rating > 1 ? 's' : ''}
                        </option>
                    ))}
                </select>
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
};

export default ReviewSection;
