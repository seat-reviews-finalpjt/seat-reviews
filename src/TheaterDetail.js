import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TheaterDetail() {
    const { theaterId } = useParams();
    const [seatingPlan, setSeatingPlan] = useState([]);

    useEffect(() => {
        const fetchSeatingPlan = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/theaters/${theaterId}/seating`);
                setSeatingPlan(response.data);
            } catch (error) {
                console.error('Failed to fetch seating plan', error);
            }
        };

        fetchSeatingPlan();
    }, [theaterId]);

    const handleSeatSelection = (seatId) => {
        // 선택한 좌석에 대한 추가 작업 수행
    };

    return (
        <div>
            <h2>Seating Plan</h2>
            <div>
                {seatingPlan.map(seat => (
                    <div key={seat.id} onClick={() => handleSeatSelection(seat.id)}>
                        {seat.isAvailable ? 'Available' : 'Occupied'}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TheaterDetail;
