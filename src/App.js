import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Logout from './Logout';
import UserProfile from './UserProfile';
import SignUp from './SignUp';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // 로그인 상태를 로컬 스토리지에서 확인
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setUsername(storedUsername);
            setIsLoggedIn(true);
        }
    }, []);

    // 로그아웃 함수
    const handleLogout = () => {
        // 로컬 스토리지에서 토큰과 유저명 제거
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
    };

    return (
        <Router>
            <div>
                <nav>
                    <Link to="/">Home</Link>
                    {isLoggedIn ? (
                        <>
                            <span>{username}님 안녕하세요</span>
                            {/* 로그아웃 버튼에 onClick 이벤트 추가 */}
                            <Link to="/" onClick={handleLogout}>Logout</Link>
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
                    {/* Home 컴포넌트에 isLoggedIn 상태 전달 */}
                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
                    {/* Logout 컴포넌트에 setIsLoggedIn 함수 전달 */}
                    <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/profile/:username" element={<UserProfile />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
