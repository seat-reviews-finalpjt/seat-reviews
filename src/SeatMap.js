import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Seat from './Seat';
import './SeatMap.css';

function SeatMap({ theaterId }) {
    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/articles/theaters/${theaterId}/`);
                setSeats(response.data);
            } catch (error) {
                console.error('Failed to fetch seats', error);
            }
        };
        fetchSeats();
    }, [theaterId]);

    const handleSeatClick = (seat) => {
        setSelectedSeat(seat);
    };

    return (
        <div className="seat-map-container">
            <div className="seat-map">
                {seats.map((seat) => (
                    <Seat key={seat.id} seat={seat} onSeatClick={handleSeatClick} />
                ))}
            </div>
            <div className="selected-seat-info">
                {selectedSeat ? (
                    <div>
                        <h3>Selected Seat: {selectedSeat.row}{selectedSeat.number}</h3>
                        <textarea placeholder="Write your review..." />
                        <select>
                            <option value={1}>1점</option>
                            <option value={2}>2점</option>
                            <option value={3}>3점</option>
                            <option value={4}>4점</option>
                            <option value={5}>5점</option>
                        </select>
                        <button>Submit Review</button>
                    </div>
                ) : (
                    <div>No seat selected</div>
                )}
            </div>
        </div>
    );
}

export default SeatMap;