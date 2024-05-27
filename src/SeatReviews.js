import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SeatReviews({ seatId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/seats/${seatId}/reviews`);
                setReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            }
        };

        fetchReviews();
    }, [seatId]);

    const handleReviewSubmission = (reviewData) => {
        // 리뷰를 서버에 제출하는 함수
    };

    return (
        <div>
            <h3>Seat Reviews</h3>
            <ul>
                {reviews.map(review => (
                    <li key={review.id}>
                        <p>{review.comment}</p>
                        <p>Rating: {review.rating}</p>
                    </li>
                ))}
            </ul>
            {/* 리뷰 작성 양식 */}
            <ReviewForm onSubmit={handleReviewSubmission} />
        </div>
    );
}

export default SeatReviews;
