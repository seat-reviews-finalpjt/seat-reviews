import React from 'react';

function Seat({ seat, onSeatClick }) {
    const handleSeatClick = () => {
        onSeatClick(seat);
    };

    return (
        <div className={`seat ${seat.status === 0 ? 'unavailable' : seat.status === 1 ? 'available' : 'limited'}`} onClick={handleSeatClick}>
            <span>{seat.row}{seat.number}</span>
        </div>
    );
}

export default Seat;
