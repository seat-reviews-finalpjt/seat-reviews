import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import axios from './api';

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [birthday, setBirthday] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('nickname', nickname);
        formData.append('name', name);
        formData.append('gender', gender);
        formData.append('birthday', birthday);
        if (profileImage) {
            formData.append('profile_image', profileImage);
        }
    
        try {
            const response = await axios.post('/accounts/signup/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            window.alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            setTimeout(() => {
                navigate('/login');
            }, 2000); // 2초 후에 로그인 페이지로 이동
        } catch (error) {
            console.error('회원가입 실패', error.response.data);
            setMessage('회원가입 실패. 입력한 정보를 확인해주세요.');
        }
    };

    const handleFileChange = (event) => {
        setProfileImage(event.target.files[0]);
    };

    const handleKakaoSignup = () => {
        window.location.href = '/accounts/kakaoLoginLogic';
    };

    const messageStyle = {
        color: message.includes('실패') ? 'red' : 'green',
        fontWeight: 'bold',
        margin: '10px 0',
    };

    return (
        <div className="signup-container">
            <h2>회원 가입</h2>
            {message && <p style={messageStyle}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>아이디</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>비밀번호</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>닉네임</label>
                    <input 
                        type="text" 
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>이름</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>성별</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">성별 선택</option>
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>생년월일</label>
                    <input 
                        type="date" 
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>프로필 이미지</label>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                    />
                </div>
                <button type="submit" className="signup-btn">회원 가입</button>
                <button className="kakao-signup-btn" onClick={handleKakaoSignup}>
                <img src="/images/kakao_logo.png" alt="Kakao Logo" width="20" height="20" />
                카카오로 회원가입
            </button>
            </form>
        </div>
    );
}

export default SignUp;
