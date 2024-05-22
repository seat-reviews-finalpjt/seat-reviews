import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setIsLoggedIn, setUsername }) {
    const [username, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/accounts/login/', {
                username,
                password
            });

            const { access, refresh } = response.data; // 서버에서 받은 액세스 및 리프레시 토큰
            localStorage.setItem('token', access);
            localStorage.setItem('refresh_token', refresh); // 리프레시 토큰 저장
            setIsLoggedIn(true);
            setUsername(username);
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            setError('아이디 또는 비밀번호를 잘못 입력했습니다.입력하신 내용을 다시 확인해주세요.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>좋은 자리 알아봐</h2>
                <div className="form-group">
                    <label>아이디:</label>
                    <input type="text" value={username} onChange={(e) => setUsernameInput(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>비밀번호:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="login-btn">로그인</button>
            </form>
        </div>
    );
}

export default Login;
