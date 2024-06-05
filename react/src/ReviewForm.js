import React, { useState } from 'react';

function ReviewForm({ onSubmit }) {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // 폼 데이터를 전송하기 전에 유효성 검사를 수행할 수 있습니다.
        onSubmit({ comment, rating });
        // 리뷰 제출 후 폼 초기화
        setComment('');
        setRating('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Comment:</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)}></textarea>
            </div>
            <div>
                <label>Rating:</label>
                <input type="number" value={rating} onChange={e => setRating(e.target.value)} />
            </div>
            <button type="submit">Submit Review</button>
        </form>
    );
}

export default ReviewForm;
