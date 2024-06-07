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
                const refreshToken = localStorage.getItem('refresh_token');
                const authProvider = localStorage.getItem('auth_provider');

                if (!accessToken || !refreshToken) {
                    throw new Error('No token found');
                }

                if (authProvider === 'kakao') {
                    // 카카오 로그아웃 처리
                    if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
                        window.Kakao.Auth.logout(() => {
                            console.log('카카오 로그아웃 성공');
                        });
                    }
                    window.location.href = 'http://localhost:8000/accounts/kakaoLogout/';
                } else {
                    // 일반 로그아웃 처리
                    const response = await axios.post('http://localhost:8000/accounts/logout/', {
                        refresh: refreshToken
                    }, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });

                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('username');
                    setIsLoggedIn(false);
                    setUsername('');
                    setMessage('로그아웃 되었습니다.');
                    navigate('/');
                }
            } catch (error) {
                console.error('Logout failed', error);
                setMessage('로그아웃 중 오류가 발생했습니다.');
            }
        };

        logout();
    }, [navigate, setIsLoggedIn, setUsername]);

    return (
        <div>
            <p>{message}</p>
        </div>
    );
}

export default Logout;
