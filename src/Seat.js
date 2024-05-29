import React from 'react';

function Seat({ seat, onClick }) {
    const seatStyle = {
        fill: seat.is_available ? 'rgb(180, 180, 180)' : 'rgb(230, 0, 0)',
        cursor: 'pointer',
    };

    return (
        <>
            <rect
                x={seat.x_position}
                y={seat.y_position}
                width="30"
                height="30"
                style={seatStyle}
                onClick={onClick}
                className="seat"
            />
            <text
                x={seat.x_position + 15}
                y={seat.y_position + 20}
                fill="black"
                textAnchor="middle"
                fontSize="14"
            >
                {seat.number}
            </text>
        </>
    );
}

export default Seat;
