import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

function Home({ isLoggedIn }) {
    const [query, setQuery] = useState('');
    const [articles, setArticles] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!isLoggedIn) {
            setError('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            // 뮤지컬 검색
            const musicalResponse = await axios.get('http://localhost:8000/searches/', {
                params: { q: query },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (musicalResponse.data.articles.length === 0) {
                setError('해당 게시물은 존재하지 않습니다.');
                setArticles([]);
            } else {
                setArticles(musicalResponse.data.articles);
                setError(null);
            }

            // 극장 검색
            const theaterResponse = await axios.get('http://localhost:8000/searches/', {
                params: { q: query, type: 'theater' },
                headers: { Authorization: `Bearer ${token}` }
            });

            setTheaters(theaterResponse.data.theaters);

        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate('/login');
            } else {
                setError('검색 중 오류가 발생했습니다.');
            }
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
                    <h3>뮤지컬 및 극장 검색</h3>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="검색하세요"
                    />
                    <button onClick={handleSearch}>검색</button>
                    {error && <p className="error">{error}</p>}
                    <div className="search-results">
                        {articles.map((article) => (
                            <div key={article.id} className="article">
                                <h4>{article.title}</h4>
                                <p>{article.content}</p>
                            </div>
                        ))}
                        {theaters.map((theater) => (
                            <div key={theater.id} className="theater">
                                <h4>{theater.name}</h4>
                                <p>{theater.address}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;
