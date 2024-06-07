import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Logout from './Logout';
import UserProfile from './UserProfile';
import SignUp from './SignUp';
import TheaterList from './TheaterList';
import SeatMap from './SeatMap';
import SeatReviews from './SeatReviews';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [authProvider, setAuthProvider] = useState('');

    useEffect(() => {
        const token = getCookie('token');
        const storedUsername = getCookie('username');
        const storedAuthProvider = getCookie('auth_provider');
        if (token && storedUsername) {
            setUsername(storedUsername);
            setIsLoggedIn(true);
            setAuthProvider(storedAuthProvider);
        }
    }, []);

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const handleLogout = () => {
        if (authProvider === 'kakao') {
            window.location.href = 'http://localhost:8000/accounts/kakaoLogout/';
        } else {
            // 일반 로그아웃
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('username');
            setIsLoggedIn(false);
            setUsername('');
            setAuthProvider('');
            window.location.href = 'http://localhost:3000/';
        }
    };

    const SetCookies = () => {
        const navigate = useNavigate();
        useEffect(() => {
            const token = getCookie('token');
            const username = getCookie('username');
            const authProvider = getCookie('auth_provider');
            document.cookie = `username=${username}; path=/; SameSite=None; Secure`;
            document.cookie = `auth_provider=${authProvider}; path=/; SameSite=None; Secure`;
            document.cookie = `token=${token}; path=/; SameSite=None; Secure`;
            navigate('/');
        }, [navigate]);

        return <div>쿠키를 설정하는 중...</div>;
    };

    return (
        <Router>
            <div>
                <nav className="navbar">
                    <Link to="/" className="nav-logo">좋은 자리 알아봐</Link>
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link to="/theaters">공연장 목록</Link>
                        </li>
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    {authProvider === 'kakao' ? (
                                        <>
                                            <img src="/images/kakao_logo.png" alt="kakao logo" className="kakao-logo-small" />
                                            <span>{username}님 안녕하세요</span>
                                        </>
                                    ) : (
                                        <span>{username}님 안녕하세요</span>
                                    )}
                                </li>
                                <li className="nav-item">
                                    <Link to="/" onClick={handleLogout}>Logout</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={`/profile/${username}`}>Profile</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/signup">Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
                    <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
                    <Route path="/profile/:username" element={<UserProfile />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/theaters" element={<TheaterList />} />
                    <Route path="/theaters/:theaterId" element={<SeatMap />} />
                    <Route path="/theaters/:theaterId/seats/:seatId/reviews" element={<SeatReviews />} />
                    <Route path="/setCookies" element={<SetCookies />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
