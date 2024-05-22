import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn, setUsername }) {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/accounts/login/', {
                username,
                password,
            });
            const token = response.data.access;
            console.log('Received token:', token); // 토큰 확인용 로그
            localStorage.setItem('token', token); // JWT 토큰 저장
            setMessage('Login successful!');
            setIsLoggedIn(true);
            setUsername(username); // 상태 업데이트
            setTimeout(() => {
                navigate('/');
            }, 2000); // 2초 후에 페이지 이동
        } catch (error) {
            setMessage('Login failed. Please check your username and password.');
            console.error('Login failed', error);
        }
    };

    const messageStyle = {
        color: 'green',
        fontWeight: 'bold',
        margin: '10px 0',
    };

    const errorStyle = {
        color: 'red',
        fontWeight: 'bold',
        margin: '10px 0',
    };

    return (
        <div>
            <h2>Login</h2>
            {message && <p style={message.includes('failed') ? errorStyle : messageStyle}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUserName(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
