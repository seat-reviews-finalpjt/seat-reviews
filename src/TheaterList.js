import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './TheaterList.css';

function TheaterList() {
    const [theaters, setTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTheaters = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8000/articles/theaters/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTheaters(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                } else {
                    console.error('Failed to fetch theaters', error);
                }
            }
        };

        fetchTheaters();
    }, [navigate]);

    const handleTheaterSelect = (e) => {
        setSelectedTheater(e.target.value);
        // 선택된 공연장에 대한 추가 작업을 수행할 수 있습니다.
    };

    return (
        <div className="theater-list">
            <h2>공연장 목록</h2>
            <div className="select-container">
                <select value={selectedTheater} onChange={handleTheaterSelect}>
                    <option value="">공연장 선택</option>
                    {theaters.map((theater) => (
                        <option key={theater.id} value={theater.id}>{theater.name}</option>
                    ))}
                </select>
            </div>
            {selectedTheater && (
                <Link className="link" to={`/theaters/${selectedTheater}`}>선택한 공연장으로 이동</Link>
            )}
        </div>
    );
}

export default TheaterList;
