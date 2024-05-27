// 특정 극장의 좌석 목록을 가져와 JSON 데이터인 각 좌석배치도를 렌더링 함
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Seat from './Seat';

function SeatMap({ selectedTheater }) {
    const [seats, setSeats] = useState([]);

    useEffect(() => {
        const fetchSeats = async () => {
            if (selectedTheater) { // selectedTheater가 정의되어 있는지 확인
                try {
                    const response = await axios.get(`http://localhost:8000/articles/theaters/${selectedTheater}/`);
                    console.log(response.data); // 데이터 확인용 콘솔 출력
                    setSeats(response.data);
                } catch (error) {
                    console.error('Failed to fetch seats', error);
                }
            }
        };

        fetchSeats();
    }, [selectedTheater]);

    return (
        <svg width="800" height="600" style={{ border: '1px solid black' }}>
            {seats.map(seat => (
                <Seat key={seat.id} seat={seat} />
            ))}
        </svg>
    );
}

export default SeatMap;

