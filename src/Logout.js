import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './api';

function Logout({ setIsLoggedIn, setUsername, setNickname }) {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const logout = async () => {
            try {
                const authProvider = localStorage.getItem('auth_provider');
                if (authProvider === 'kakao') {
                    window.location.href = '/accounts/kakaoLogout/';
                } else {
                    const accessToken = localStorage.getItem('token');
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (!accessToken || !refreshToken) {
                        throw new Error('No token found');
                    }

                    await axios.post('http://54.252.140.4:8000/accounts/logout/', {
                        refresh: refreshToken
                    }, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });

                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('nickname');
                    localStorage.removeItem('auth_provider');
                    deleteAllCookies();
                    setIsLoggedIn(false);
                    setUsername('');
                    setNickname('');
                    setMessage('로그아웃 되었습니다.');
                    navigate('/');
                }
            } catch (error) {
                console.error('Logout failed', error);
                setMessage('로그아웃 중 오류가 발생했습니다.');
            }
        };

        logout();
    }, [navigate, setIsLoggedIn, setUsername, setNickname]);

    const deleteAllCookies = () => {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=54.252.140.4;SameSite=None;Secure";
        }
    };

    return (
        <div>
            <p>{message}</p>
        </div>
    );
}

export default Logout;
