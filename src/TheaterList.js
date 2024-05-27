import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TheaterList() {
    const [theaters, setTheaters] = useState([]);

    useEffect(() => {
        const fetchTheaters = async () => {
            try {
                const response = await axios.get('http://localhost:8000/articles/theaters/');
                setTheaters(response.data);
            } catch (error) {
                console.error('Failed to fetch theaters', error);
            }
        };

        fetchTheaters();
    }, []);

    return (
        <div>
            <h2>Theater List</h2>
            <ul>
                {theaters.map(theater => (
                    <li key={theater.id}>
                        <Link to={`/theaters/${theater.id}`}>
                            {theater.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TheaterList;
