// 각 좌석을 표시하는데 사용되고, 가용 여부에 따라 색상으로 표시
import React from 'react';

function Seat({ seat }) {
    const seatStyle = {
        fill: seat.is_available ? 'green' : 'red',
        cursor: 'pointer',
    };

    return (
        <rect
            x={seat.x_position}
            y={seat.y_position}
            width={seat.width}
            height={seat.height}
            style={seatStyle}
            onClick={() => alert(`Seat ${seat.row}${seat.number} clicked`)}
        />
    );
}

export default Seat;

