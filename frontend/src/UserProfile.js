import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserProfile.css';
import axios from './api';

function UserProfile({ setIsLoggedIn, setUsername, setNickname, setAuthProvider }) {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({ username: '', nickname: '', profile_image: '' });
    const [isKakaoUser, setIsKakaoUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token') || localStorage.getItem('kakaoToken');
                if (!token) {
                    setMessage('로그인이 필요합니다.');
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`/accounts/${username}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
                setProfileData({
                    username: response.data.username,
                    nickname: response.data.nickname,
                    profile_image: response.data.profile_image
                });
                setIsKakaoUser(response.data.auth_provider === 'kakao');

                // 로그인 상태 업데이트
                if (response.data.username) {
                    setUsername(response.data.username);
                    setNickname(response.data.nickname);
                    setIsLoggedIn(true);
                    setAuthProvider(response.data.auth_provider);
                    localStorage.setItem('username', response.data.username);
                    localStorage.setItem('nickname', response.data.nickname);
                    localStorage.setItem('auth_provider', response.data.auth_provider);
                }
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
    }, [username, navigate, setIsLoggedIn, setUsername, setNickname, setAuthProvider]);

    const handleDeleteClick = () => {
        setShowModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('kakaoToken');
            if (!token) {
                window.alert('로그인이 필요합니다.');
                return;
            }

            await axios.delete(`/accounts/${username}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            window.alert('회원 탈퇴가 완료되었습니다.');
            localStorage.removeItem('token');
            localStorage.removeItem('kakaoToken');
            setIsLoggedIn(false);
            setUsername('');
            setNickname('');
            setAuthProvider('');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                window.alert('로그인이 필요합니다.');
                navigate('/login');
            } else {
                window.alert('회원 탈퇴를 실패하였습니다.');
            }
            console.error('Failed to delete user', error);
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleProfileImageChange = (e) => {
        setProfileData((prevState) => ({
            ...prevState,
            profile_image: e.target.files[0],
        }));
    };

    const handleProfileSave = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('kakaoToken');
            if (!token) {
                window.alert('로그인이 필요합니다.');
                return;
            }

            const formData = new FormData();
            formData.append('username', profileData.username);
            formData.append('nickname', profileData.nickname);
            if (profileData.profile_image instanceof File) {
                formData.append('profile_image', profileData.profile_image);
            }

            const response = await axios.put(`/accounts/${username}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            setUser(response.data);
            setEditMode(false);
            setMessage('프로필이 업데이트되었습니다.');
            localStorage.setItem('nickname', profileData.nickname);
            document.cookie = `nickname=${encodeURIComponent(profileData.nickname)}; path=/; SameSite=None; Secure`;
        } catch (error) {
            window.alert('프로필 업데이트 중 오류가 발생했습니다.');
            console.error('Failed to update profile', error);
        }
    };

    return (
        <div className="user-profile-container">
            <h2>User Profile</h2>
            {message && <p className={message.includes('성공') ? 'success' : 'error'}>{message}</p>}
            {user ? (
                <div className="user-profile-content">
                    {editMode ? (
                        <>
                            <label>
                                아이디
                                <input
                                    type="text"
                                    name="username"
                                    value={profileData.username}
                                    onChange={handleProfileChange}
                                    disabled
                                />
                            </label>
                            <label>
                                닉네임
                                <input
                                    type="text"
                                    name="nickname"
                                    value={profileData.nickname}
                                    onChange={handleProfileChange}
                                />
                            </label>
                            <label>
                                프로필 이미지
                                <input
                                    type="file"
                                    name="profile_image"
                                    onChange={handleProfileImageChange}
                                />
                            </label>
                            <div className="button-group">
                                <button onClick={handleProfileSave}>저장</button>
                                <button onClick={() => setEditMode(false)}>취소</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p>아이디 : {user.username}</p>
                            <p>닉네임 : {user.nickname}</p>
                            {isKakaoUser ? (
                                <>
                                    <p>프로필 이미지</p>
                                    <img src="/images/kakao_logo.png" alt="Kakao Profile" className="kakao-logo" />
                                </>
                            ) : user.profile_image ? (
                                <>
                                    <p>프로필 이미지</p>
                                    <img src={`http://54.252.140.4:8000${user.profile_image}`} alt="Profile" />
                                </>
                            ) : (
                                <>
                                    <p>프로필 이미지</p>
                                    <img src="/media/default_profile_image.png" alt="Profile" />
                                </>
                            )}
                            <div className="button-group">
                                <button onClick={handleEditClick}>프로필 수정</button>
                                <button onClick={handleDeleteClick}>회원 탈퇴</button>
                            </div>
                        </>
                    )}
                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>회원 탈퇴 확인</h2>
                                <p>정말로 회원 탈퇴를 하시겠습니까?</p>
                                <div className="button-group">
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
