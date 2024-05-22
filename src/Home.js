import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

function Home({ isLoggedIn }) {
    const [query, setQuery] = useState('');
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!isLoggedIn) {
            setError('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const token = localStorage.getItem('token');
        console.log('Using token:', token); // 토큰 확인용 로그

        try {
            const response = await axios.get('http://localhost:8000/searches/', {
                params: { q: query },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.articles.length === 0) {
                setError('해당 게시물은 존재하지 않습니다.');
                setArticles([]);
            } else {
                setArticles(response.data.articles);
                setError(null);
            }
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
                <h2>홈</h2>
                <nav>
                    <ul>
                        <li><Link to="/">홈</Link></li>
                        <li><Link to="/about">소개</Link></li>
                        <li><Link to="/contact">연락처</Link></li>
                    </ul>
                </nav>
            </header>
            <main>
                <p>홈 페이지에 오신 것을 환영합니다!</p>
                <div className="home-content">
                    <section>
                        <h3>검색</h3>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="검색어를 입력하세요"
                        />
                        <button onClick={handleSearch}>검색</button>
                        {error && <p className="error">{error}</p>}
                        <div>
                            {articles.map((article) => (
                                <div key={article.id}>
                                    <h4>{article.title}</h4>
                                    <p>{article.content}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Home;
