import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Home from './Home';
import Logout from './Logout';
import UserProfile from './UserProfile';
import SignUp from './SignUp';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8000/accounts/me/', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUsername(response.data.username);
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error('Failed to fetch user info', error);
                }
            }
        };

        checkLoginStatus();
    }, []);

    return (
        <Router>
            <div>
                <nav>
                    <Link to="/">Home</Link>
                    {isLoggedIn ? (
                        <>
                            <span>{username}님 안녕하세요</span>
                            <Link to="/logout" onClick={() => setIsLoggedIn(false)}>Logout</Link>
                            <Link to={`/profile/${username}`}>Profile</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Sign Up</Link>
                        </>
                    )}
                </nav>
                <Routes>
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
                    <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
                    <Route path="/profile/:username" element={<UserProfile />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
