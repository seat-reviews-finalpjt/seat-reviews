import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post('http://localhost:8000/accounts/logout/', null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                localStorage.removeItem('token');
                navigate('/login');
            } catch (error) {
                console.error('Failed to logout', error);
            }
        };

        logout();
    }, [navigate]);

    return (
        <div>
            <h2>Logging out...</h2>
        </div>
    );
}

export default Logout;
