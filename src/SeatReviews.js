import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SeatReviews({ match }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/seats/${match.params.seatId}/reviews`);
                setReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            }
        };

        fetchReviews();
    }, [match.params.seatId]);

    return (
        <div>
            <h2>Seat Reviews</h2>
            <ul>
                {reviews.map(review => (
                    <li key={review.id}>
                        <p>{review.content}</p>
                        <p>{`작성자: ${review.author}`}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SeatReviews;