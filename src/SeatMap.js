import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Seat from './Seat';
import SeatPopup from './SeatPopup'; // 모달 컴포넌트를 import합니다.
import './SeatMap.css';

function SeatMap({ selectedTheater }) {
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeat, setSelectedSeat] = useState(null); // 선택된 좌석을 상태로 관리합니다.

    useEffect(() => {
        const fetchSeats = async () => {
            if (selectedTheater) {
                try {
                    const response = await axios.get(`http://localhost:8000/articles/theaters/${selectedTheater}/`);
                    setSeats(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Failed to fetch seats', error);
                }
            }
        };

        fetchSeats();
    }, [selectedTheater]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleSeatClick = (seat) => {
        setSelectedSeat(seat); // 선택된 좌석을 설정합니다.
    };

    const handleCloseModal = () => {
        setSelectedSeat(null); // 모달을 닫을 때 선택된 좌석을 초기화합니다.
    };

    return (
        <div className="seat-map-container">
            <svg width="800" height="600" className="seat-map-svg">
                {seats.map(seat => (
                    <Seat key={seat.id} seat={seat} onClick={() => handleSeatClick(seat)} />
                ))}
            </svg>
            {/* 선택된 좌석이 있을 경우 모달을 렌더링합니다. */}
            {selectedSeat && <SeatPopup seat={selectedSeat} onClose={handleCloseModal} />}
        </div>
    );
}

export default SeatMap;
