import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './TheaterList.css';

function TheaterList() {
    const [theaters, setTheaters] = useState([]);
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

    return (
        <div className="theater-list">
            <h2>공연장 목록</h2>
            <ul>
                {theaters.map((theater) => (
                    <li key={theater.id}>
                        <Link to={`/theaters/${theater.id}`}>{theater.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TheaterList;
