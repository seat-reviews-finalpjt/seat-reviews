import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setMessage('No token found. Please log in.');
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:8000/accounts/${username}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setMessage('Unauthorized. Please log in.');
                    navigate('/login');
                } else {
                    setMessage('Failed to fetch user profile.');
                }
                console.error('Failed to fetch user profile', error);
            }
        };

        fetchUserProfile();
    }, [username, navigate]);

    const handleDeleteClick = () => {
        setShowPasswordInput(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('No token found. Please log in.');
                return;
            }

            await axios.delete(`http://localhost:8000/accounts/${username}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: { password }
            });
            setMessage('회원 탈퇴가 완료되었습니다.');
            localStorage.removeItem('token');
            setTimeout(() => {
                navigate('/');
            }, 2000); // 2초 후에 메인 페이지로 이동
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage('Unauthorized. Please log in.');
                navigate('/login');
            } else {
                setMessage('회원 탈퇴를 실패하였습니다. 비밀번호를 확인해주세요.');
            }
            console.error('Failed to delete user', error);
        }
    };

    return (
        <div className="user-profile-container">
            <h2>User Profile</h2>
            {message && <p>{message}</p>}
            {user ? (
                <div className="user-profile-content">
                    <p>아이디: {user.username}</p>
                    {user.profile_image && (
                        <>
                            <p>프로필 이미지:</p>
                            <img src={`http://localhost:8000${user.profile_image}`} alt="Profile" />
                        </>
                    )}
                    <button onClick={handleDeleteClick}>회원 탈퇴</button>
                    {showPasswordInput && (
                        <div>
                            <label>비밀번호 재확인</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <button onClick={handleDeleteConfirm}>확인</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default UserProfile;
