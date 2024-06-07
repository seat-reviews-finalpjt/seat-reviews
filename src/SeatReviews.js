import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './SeatReviews.css';

function SeatReviews() {
    const { theaterId, seatId } = useParams();
    const [seatReviews, setSeatReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeatReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/articles/reviews/?seat=${seatId}`);
                if (response.data) {
                    setSeatReviews(response.data);
                } else {
                    console.error('Seat reviews not found');
                }
            } catch (error) {
                console.error('Failed to fetch seat reviews', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSeatReviews();
    }, [seatId]);

    const renderStars = (score) => {
        const filledStars = Array(score).fill('★');
        const emptyStars = Array(5 - score).fill('☆');
        return (
            <span className="star-rating">
                {filledStars.map((star, index) => (
                    <span key={index} className="star filled">{star}</span>
                ))}
                {emptyStars.map((star, index) => (
                    <span key={index + score} className="star empty">{star}</span>
                ))}
            </span>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="seat-reviews-container">
            <h2>선택한 좌석 : {seatId}</h2>
            <Link to={`/theaters/${theaterId}`}>공연장 돌아가기</Link>
            {seatReviews.length > 0 ? (
                seatReviews.map((review) => (
                    <div key={review.id} className="review">
                        <p><strong>{review.author}</strong></p>
                        <p>{review.content}</p>
                        <p>{renderStars(review.score)}</p>
                        {review.photo && <img src={review.photo} alt="Review" />}
                    </div>
                ))
            ) : (
                <p>해당 좌석에 리뷰가 없습니다.</p>
            )}
        </div>
    );
}

export default SeatReviews;
