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
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchSeatReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/articles/reviews/?seat=${seatId}`);
                setSeatReviews(response.data);
                console.log('Seat reviews:', response.data);
            } catch (error) {
                console.error('Failed to fetch seat reviews', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8000/accounts/current/', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setCurrentUser(response.data);
                    console.log('Current user:', response.data);
                } catch (error) {
                    console.error('Failed to fetch current user', error);
                }
            }
        };

        fetchSeatReviews();
        fetchCurrentUser();
    }, [seatId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="seat-reviews-container">
            <Link to={`/theaters/${theaterId}`} className="back-button">공연장 돌아가기</Link>
            {seatReviews.length > 0 ? (
                seatReviews.map((review) => (
                    <ReviewWithComments key={review.id} review={review} renderStars={renderStars} currentUser={currentUser} />
                ))
            ) : (
                <p>해당 좌석에 리뷰가 없습니다.</p>
            )}
        </div>
    );
}

function ReviewWithComments({ review, renderStars, currentUser }) {
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditingReview, setIsEditingReview] = useState(false);
    const [editedReviewContent, setEditedReviewContent] = useState(review.content);
    const [editedReviewScore, setEditedReviewScore] = useState(review.score);
    const [originalCommentContent, setOriginalCommentContent] = useState({});

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/articles/reviews/${review.id}/comments/`);
                setComments(response.data);
                console.log('Comments:', response.data);
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
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setComments([...comments, response.data]);
            setCommentContent('');
        } catch (error) {
            console.error('Failed to post comment', error);
        }
    };

    const handleReviewDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/articles/reviews/${review.id}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            window.location.reload();
        } catch (error) {
            console.error('Failed to delete review', error);
        }
    };

    const handleReviewEdit = async () => {
        try {
            await axios.patch(
                `http://localhost:8000/articles/reviews/${review.id}/`,
                { content: editedReviewContent, score: editedReviewScore },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setIsEditingReview(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to edit review', error);
        }
    };

    const handleReviewEditToggle = () => {
        setIsEditingReview(!isEditingReview);
        if (!isEditingReview) {
            setEditedReviewContent(review.content);
        }
    };

    const handleLikeReview = async () => {
        try {
            await axios.post(`http://localhost:8000/articles/reviews/${review.id}/like/`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            window.location.reload();
        } catch (error) {
            console.error('Failed to like review', error);
        }
    };

    const handleCommentEditToggle = (commentId) => {
        setComments(comments.map(comment =>
            comment.id === commentId ? { ...comment, isEditing: !comment.isEditing, originalContent: comment.content } : comment
        ));
    };

    const handleCommentEdit = async (commentId, content) => {
        try {
            await axios.patch(
                `http://localhost:8000/articles/reviews/${review.id}/comments/${commentId}/`,
                { content },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setComments(comments.map(comment =>
                comment.id === commentId ? { ...comment, content, isEditing: false } : comment
            ));
        } catch (error) {
            console.error('Failed to edit comment', error);
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8000/articles/reviews/${review.id}/comments/${commentId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            await axios.post(`http://localhost:8000/articles/reviews/${review.id}/comments/${commentId}/like/`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            window.location.reload();
        } catch (error) {
            console.error('Failed to like comment', error);
        }
    };

    const handleCommentCancelEdit = (commentId) => {
        setComments(comments.map(comment =>
            comment.id === commentId ? { ...comment, content: comment.originalContent, isEditing: false } : comment
        ));
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
                    <div className="review-header-info">
                        <p><strong>{review.author}</strong></p>
                        {currentUser && currentUser.nickname === review.author && (
                            <div className="review-actions">
                                <button onClick={handleReviewEditToggle}>수정</button>
                                <button onClick={handleReviewDelete}>삭제</button>
                            </div>
                        )}
                    </div>
                </div>
                {isEditingReview ? (
                    <div className="edit-review">
                        <textarea
                            value={editedReviewContent}
                            onChange={(e) => setEditedReviewContent(e.target.value)}
                        />
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${star <= editedReviewScore ? 'filled' : ''}`}
                                    onClick={() => setEditedReviewScore(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <div className="edit-actions">
                            <button onClick={handleReviewEdit}>저장</button>
                            <button onClick={handleReviewEditToggle}>취소</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p>{review.content}</p>
                        <p>{renderStars(review.score)}</p>
                        {review.photo && <img src={review.photo} alt="Review" />}
                        <div className="like-section">
                            <button className="like-button" onClick={handleLikeReview}>
                                {review.is_liked ? '❤️' : '🤍'} {review.likes_count}
                            </button>
                        </div>
                    </>
                )}
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
                                {comment.isEditing ? (
                                    <>
                                        <textarea
                                            value={comment.content}
                                            onChange={(e) => setComments(comments.map(c =>
                                                c.id === comment.id ? { ...c, content: e.target.value } : c
                                            ))}
                                        />
                                        <div className="comment-actions">
                                            <button onClick={() => handleCommentEdit(comment.id, comment.content)}>저장</button>
                                            <button onClick={() => handleCommentCancelEdit(comment.id)}>취소</button>
                                        </div>
                                    </>
                                ) : (
                                    <p>{comment.content}</p>
                                )}
                                {currentUser && currentUser.nickname === comment.commenter && !comment.isEditing && (
                                    <div className="comment-actions">
                                        <button onClick={() => handleCommentEditToggle(comment.id)}>수정</button>
                                        <button onClick={() => handleCommentDelete(comment.id)}>삭제</button>
                                    </div>
                                )}
                                <div className="like-section">
                                    <button className="like-button" onClick={() => handleCommentLike(comment.id)}>
                                        {comment.is_liked ? '❤️' : '🤍'} {comment.likes_count}
                                    </button>
                                </div>
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
