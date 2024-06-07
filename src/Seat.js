import React from 'react';
import './Seat.css';

function Seat({ seat, onSeatClick, x, y }) {
    const handleSeatClick = () => {
        if (seat.status === 0) {
            alert('해당 좌석은 일반 좌석이 아닙니다.');
        }
        onSeatClick(seat);
    };

    return (
        <div 
            className={`seat ${seat.status === 1 ? 'available' : seat.status === 2 ? 'limited' : 'unavailable'}`} 
            onClick={handleSeatClick}
            style={{
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`
            }}
        >
            <span className="seat-label">{seat.row}{seat.number}</span>
        </div>
    );
}

export default Seat;
