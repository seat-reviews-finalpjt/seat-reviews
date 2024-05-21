import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post('http://localhost:8000/accounts/logout/', null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                localStorage.removeItem('token');
                setMessage('Logout successful!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000); // 2초 후에 로그인 페이지로 이동
            } catch (error) {
                setMessage('Failed to logout.');
                console.error('Failed to logout', error);
            }
        };

        logout();
    }, [navigate]);

    return (
        <div>
            <h2>Logging out...</h2>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Logout;
