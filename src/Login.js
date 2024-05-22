import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsernameInput(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p>{error}</p>}
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
