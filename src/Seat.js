import React from 'react';
import './Seat.css';

function getSeatColor(averageScore, status) {
    if (status === 0) return '#1E90FF'; // Blue
    if (averageScore >= 4) return '#5cb85c'; // Green
    if (averageScore >= 3) return '#f0ad4e'; // Yellow
    if (averageScore > 0) return '#d9534f'; // Red
    return '#808080'; // Grey
}

function Seat({ seat, onSeatClick, x, y }) {
    const handleSeatClick = () => {
        if (seat.status === 0) {
            alert('해당 좌석은 일반 좌석이 아닙니다.');
        }
        onSeatClick(seat);
    };

    const seatColor = getSeatColor(seat.average_score, seat.status);

    return (
        <div 
            className="seat"
            onClick={handleSeatClick}
            style={{
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`,
                backgroundColor: seatColor
            }}
        >
            <span className="seat-label">{seat.row}{seat.number}</span>
        </div>
    );
}

export default Seat;
