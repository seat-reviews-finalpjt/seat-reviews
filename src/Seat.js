import React from 'react';

function Seat({ seat, onClick }) {
    const seatStyle = {
        fill: seat.is_available ? 'rgb(180, 180, 180)' : 'rgb(230, 0, 0)',
        stroke: 'black',
        strokeWidth: '1',
        cursor: 'pointer',
        transition: 'fill 0.3s ease',
    };

    const seatHoverStyle = {
        fill: seat.is_available ? 'rgb(140, 140, 140)' : 'rgb(200, 0, 0)',
    };

    const handleMouseEnter = (e) => {
        e.target.style.fill = seatHoverStyle.fill;
    };

    const handleMouseLeave = (e) => {
        e.target.style.fill = seatStyle.fill;
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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="seat"
            />
            <text
                x={seat.x_position + 15}
                y={seat.y_position + 20}
                fill="black"
                textAnchor="middle"
                fontSize="14"
                pointerEvents="none"
            >
                {seat.number}
            </text>
        </>
    );
}

export default Seat;
