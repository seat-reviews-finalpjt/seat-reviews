import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout({ setIsLoggedIn, setUsername }) {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const logout = async () => {
            try {
                const accessToken = localStorage.getItem('token');
                const refreshToken = localStorage.getItem('refresh_token'); // 리프레시 토큰 추가

                if (!accessToken || !refreshToken) {
                    throw new Error('No token found');
                }

                // 서버로 로그아웃 요청 보내기
                const response = await axios.post('http://localhost:8000/accounts/logout/', {
                    refresh: refreshToken // 리프레시 토큰을 포함하여 전송
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                console.log('Logout response:', response);

                // 로컬 스토리지에서 토큰 제거 및 상태 업데이트
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token'); // 리프레시 토큰 제거
                setIsLoggedIn(false);
                setUsername('');
                setMessage('Logout successful!');
                setTimeout(() => {
                    navigate('/');
                }, 1000); // 1초 후에 메인 페이지로 이동
            } catch (error) {
                console.error('Failed to logout', error);
                setMessage('Failed to logout.');
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
