import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Seat from './Seat';
import './SeatMap.css';

Modal.setAppElement('#root');

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function SeatMap() {
    const { theaterId } = useParams();
    const [theater, setTheater] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewScore, setReviewScore] = useState(1);
    const [reviewPhoto, setReviewPhoto] = useState(null);

    useEffect(() => {
        const fetchTheater = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/articles/theaters/${theaterId}/`);
                setTheater(response.data);
            } catch (error) {
                console.error('Failed to fetch theater', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTheater();
    }, [theaterId]);

    const handleSeatClick = (seat) => {
        setSelectedSeat(seat);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedSeat(null);
        setReviewContent('');
        setReviewScore(1);
        setReviewPhoto(null);
    };

    const handleReviewContentChange = (e) => {
        setReviewContent(e.target.value);
    };

    const handleReviewScoreChange = (score) => {
        setReviewScore(score);
    };

    const handleReviewPhotoChange = (e) => {
        setReviewPhoto(e.target.files[0]);
    };

    const handleSubmitReview = async () => {
        if (!reviewPhoto) {
            alert("사진은 꼭 포함되어야 합니다.");
            return;
        }

        const formData = new FormData();
        formData.append('content', reviewContent);
        formData.append('score', reviewScore);
        formData.append('photo', reviewPhoto);
        formData.append('seat', selectedSeat.id);

        const token = localStorage.getItem('token');
        const csrfToken = getCookie('csrftoken');

        try {
            const response = await axios.post(`http://localhost:8000/articles/reviews/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                    'X-CSRFToken': csrfToken
                }
            });
            console.log(response.data);  // 서버 응답 확인
            closeModal();
            navigate(`/theaters/${theaterId}/seats/${selectedSeat.id}/reviews`);  // 리뷰 작성 후 리뷰 페이지로 이동
        } catch (error) {
            console.error('Failed to submit review', error);
        }
    };

    const handleViewReviews = () => {
        navigate(`/theaters/${theaterId}/seats/${selectedSeat.id}/reviews`);
    };

    const renderStars = () => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= reviewScore ? 'filled' : ''}`}
                        onClick={() => handleReviewScoreChange(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!theater || !theater.seats) {
        return <div>No theater data available</div>;
    }

    return (
        <div className="seat-map-container">
            <div className="screen">SCREEN</div>
            <div className="seat-map">
                {theater.seats.map((seat) => (
                    <Seat 
                        key={seat.id} 
                        seat={seat} 
                        onSeatClick={handleSeatClick}
                        x={seat.x}
                        y={seat.y}
                    />
                ))}
            </div>
            <Modal 
                isOpen={modalIsOpen} 
                onRequestClose={closeModal}
                contentLabel="Review Modal"
                className="Modal"
                overlayClassName="Overlay"
            >
                {selectedSeat && (
                    <div>
                        <h3>선택한 좌석 : {selectedSeat.row}{selectedSeat.number}</h3>
                        <textarea 
                            placeholder="리뷰를 작성해주세요" 
                            className="modal-textarea"
                            value={reviewContent}
                            onChange={handleReviewContentChange}
                        />
                        {renderStars()}
                        <input 
                            type="file"
                            accept="image/*"
                            onChange={handleReviewPhotoChange}
                        />
                        <div className="modal-buttons">
                            <button className="button button-submit" onClick={handleSubmitReview}>리뷰 달기</button>
                            <button className="button button-cancel" onClick={closeModal}>취소</button>
                            <button className="button button-view-reviews" onClick={handleViewReviews}>리뷰 보기</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default SeatMap;
