import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Logout from './Logout';
import UserProfile from './UserProfile';
import SignUp from './SignUp';
import TheaterList from './TheaterList'; // 공연장 목록 컴포넌트 추가
import SeatMap from './SeatMap'; // 좌석 배치도 추가
import './App.css';


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
                <nav className="navbar"> {/* 네비게이션 바에 클래스 추가 */}
                    <Link to="/" className="nav-logo">좋은 자리 알아봐</Link> {/* 홈로고에 클래스 추가 */}
                    <ul className="nav-menu"> {/* 네비게이션 메뉴에 클래스 추가 */}
                        <li className="nav-item">
                            <Link to="/theaters">공연장 목록</Link> {/* 공연장 목록 링크 추가 */}
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
                    <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/profile/:username" element={<UserProfile />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/theaters" element={<TheaterList />} />
                    <Route path="/theaters/:theaterId" element={<SeatMapWrapper />} />
                </Routes>
            </div>
        </Router>
    );
}


const SeatMapWrapper = () => {
    const { theaterId } = useParams();
    return <SeatMap selectedTheater={theaterId} />;
};

export default App;
