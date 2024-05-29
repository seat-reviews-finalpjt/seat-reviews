import React from 'react';
import { Link } from 'react-router-dom';

function SeatPopup({ seat, onClose }) {
    const modalStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000
    };

    const modalContentStyle = {
        backgroundColor: 'white',
        borderRadius: '5px',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        maxWidth: '400px' // 모달의 최대 너비 설정
    };

    const closeStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
        fontSize: '20px'
    };

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const linkStyle = {
        display: 'block', // 블록 레벨로 변경
        marginTop: '10px',
        padding: '8px 16px',
        backgroundColor: '#981D26',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
        transition: 'background-color 0.3s',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        textAlign: 'center' // 텍스트 가운데 정렬
    };

    return (
        <div style={modalStyle} onClick={handleOutsideClick}>
            <div style={modalContentStyle}>
                <span style={closeStyle} onClick={onClose}>×</span>
                <h3>{`좌석 ${seat.row}${seat.number}`}</h3>
                <p>{`리뷰: ${seat.reviewsCount !== undefined ? seat.reviewsCount : 0}`}</p>
                <Link to={`/seats/${seat.id}/reviews`} style={linkStyle}>리뷰 보기</Link>
            </div>
        </div>
    );
}

export default SeatPopup;
