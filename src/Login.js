import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from './api';

function Login({ setIsLoggedIn, setUsername, setNickname }) {
    const [username, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCSRFToken = async () => {
            try {
                await axios.get('/accounts/kakaoLoginLogic/');
            } catch (error) {
                console.error('Error fetching CSRF token', error);
            }
        };
        fetchCSRFToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/accounts/login/', {
                username,
                password
            });

            const { access, refresh } = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refresh_token', refresh);
            setIsLoggedIn(true);
            setUsername(username);
            setNickname(username); // Assuming nickname is the same as username for simplicity
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            setError('아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.');
        }
    };

    const handleKakaoLogin = () => {
        window.location.href = '/accounts/kakaoLoginLogic/';
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>좋은 자리 알아봐</h2>
                <div className="form-group">
                    <label htmlFor="username">아이디:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        autoComplete="username"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="login-btn">로그인</button>
                <button type="button" className="kakao-btn" onClick={handleKakaoLogin}>
                    <img src="/images/kakao_logo.png" alt="kakao logo" className="kakao-logo" />
                    카카오로 시작하기
                </button>
            </form>
        </div>
    );
}

export default Login;
