import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
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
            localStorage.setItem('token', response.data.access); // 저장하는 토큰 확인
            setMessage('Login successful!');
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
                        onChange={(e) => setUsername(e.target.value)} 
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
