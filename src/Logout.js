import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout({ setIsLoggedIn, setUsername }) {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const logout = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                
                await axios.post('http://localhost:8000/accounts/logout/', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setUsername('');
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
    }, [navigate, setIsLoggedIn, setUsername]);

    return (
        <div>
            <h2>Logging out...</h2>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Logout;
