import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Logout from './Logout';
import UserProfile from './UserProfile';
import SignUp from './SignUp';
import TheaterList from './TheaterList';
import SeatMap from './SeatMap'; // SeatMap 컴포넌트 import 추가
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setUsername(storedUsername);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
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
                                    <span>{username}님 안녕하세요</span>
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
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
                    <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
                    <Route path="/profile/:username" element={<UserProfile />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/theaters" element={<TheaterList />} />
                    {/* SeatMapWrapper 컴포넌트를 '/theaters/:theaterId' 경로에 매핑 */}
                    <Route path="/theaters/:theaterId" element={<SeatMapWrapper />} />
                </Routes>
            </div>
        </Router>
    );
}

// theaterId를 useParams를 통해 받아와서 SeatMap 컴포넌트에 전달하는 SeatMapWrapper 컴포넌트
const SeatMapWrapper = () => {
    const { theaterId } = useParams();
    return <SeatMap theaterId={theaterId} />;
};

export default App;
