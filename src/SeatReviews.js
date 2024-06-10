import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './SeatReviews.css';

function renderStars(score) {
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
}

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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="seat-reviews-container">
            <h2>선택한 좌석 : {seatId}</h2>
            <Link to={`/theaters/${theaterId}`} className="back-button">공연장 돌아가기</Link>
            {seatReviews.length > 0 ? (
                seatReviews.map((review) => (
                    <ReviewWithComments key={review.id} review={review} renderStars={renderStars} />
                ))
            ) : (
                <p>해당 좌석에 리뷰가 없습니다.</p>
            )}
        </div>
    );
}

function ReviewWithComments({ review, renderStars }) {
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/articles/reviews/${review.id}/comments/`);
                setComments(response.data);
            } catch (error) {
                console.error('Failed to fetch comments', error);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [review.id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:8000/articles/reviews/${review.id}/comments/`,
                { content: commentContent, review: review.id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // 토큰이 있는 경우 추가
                    }
                }
            );
            setComments([...comments, response.data]);
            setCommentContent('');
        } catch (error) {
            console.error('Failed to post comment', error);
        }
    };

    return (
        <div className="review-with-comments">
            <div className="review">
                <div className="review-header">
                    {review.author_profile_image && (
                        <img
                            src={review.author_profile_image}
                            alt={`${review.author}의 프로필`}
                            className="profile-image"
                        />
                    )}
                    <p><strong>{review.author}</strong></p>
                </div>
                <p>{review.content}</p>
                <p>{renderStars(review.score)}</p>
                {review.photo && <img src={review.photo} alt="Review" />}
            </div>
            <div className="comments">
                <h3>댓글</h3>
                {loading ? (
                    <div>Loading comments...</div>
                ) : (
                    <div>
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                <p><strong>{comment.commenter}</strong></p>
                                <p>{comment.content}</p>
                            </div>
                        ))}
                    </div>
                )}
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="댓글을 작성하세요..."
                        required
                    />
                    <button type="submit">댓글 달기</button>
                </form>
            </div>
        </div>
    );
}

export default SeatReviews;
