import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import axios from './api';

function Home({ isLoggedIn }) {
    const [query, setQuery] = useState('');
    const [theaters, setTheaters] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!isLoggedIn) {
            alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
            setError('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (query.trim() === '') {
            setError('검색어를 입력해주세요.');
            setTheaters([]);
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await axios.get('/searches/', {
                params: { q: query },
                headers: { Authorization: `Bearer ${token}` }
            });

            const { theaters } = response.data;
            if (theaters.length === 0) {
                setError(`'${query}'에 대한 검색 결과가 없습니다.`);
                setTheaters([]);
            } else {
                setTheaters(theaters);
                setError(null);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                navigate('/login');
            } else {
                setError('검색 중 오류가 발생했습니다.');
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h2>좋은 자리 알아봐</h2>
                <nav>
                    <ul>
                        <li><Link to="/">홈</Link></li>
                    </ul>
                </nav>
            </header>
            <main>
                <div className="search-section">
                    <h3>극장 검색</h3>
                    <div className="search-input">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="검색하세요"
                        />
                        <button onClick={handleSearch}>검색</button>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div className="search-results">
                        {theaters.map((theater) => (
                            <div key={theater.id} className="theater">
                                <h4>
                                    <Link to={`/theaters/${theater.id}`}>{theater.name}</Link>
                                </h4>
                                <p>{theater.location}</p>
                                <p>{theater.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;
