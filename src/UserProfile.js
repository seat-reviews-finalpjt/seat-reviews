import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false); // 모달 열림/닫힘 상태
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setMessage('로그인이 필요합니다.');
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
                    setMessage('로그인이 필요합니다.');
                    navigate('/login');
                } else {
                    setMessage('사용자 정보를 가져오는 중 문제가 발생했습니다.');
                }
                console.error('Failed to fetch user profile', error);
            }
        };

        fetchUserProfile();
    }, [username, navigate]);

    const handleDeleteClick = () => {
        setShowModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.alert('로그인이 필요합니다.');
                return;
            }
    
            await axios.delete(`http://localhost:8000/accounts/${username}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: { password }
            });
            window.alert('회원 탈퇴가 완료되었습니다.');
            localStorage.removeItem('token');
            setTimeout(() => {
                navigate('/');
            }, 2000); // 2초 후에 메인 페이지로 이동
        } catch (error) {
            if (error.response && error.response.status === 401) {
                window.alert('로그인이 필요합니다.');
                navigate('/login');
            } else {
                window.alert('회원 탈퇴를 실패하였습니다. 비밀번호를 확인해주세요.');
            }
            console.error('Failed to delete user', error);
        }
    };

    return (
        <div className="user-profile-container">
            <h2>User Profile</h2>
            {message && <p className={message.includes('성공') ? 'success' : 'error'}>{message}</p>}
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
                    {/* 모달 */}
                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>회원 탈퇴 확인</h2>
                                <label>비밀번호 재확인</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                                <div>
                                    <button onClick={handleDeleteConfirm}>확인</button>
                                    <button onClick={() => setShowModal(false)}>취소</button>
                                </div>
                            </div>
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
