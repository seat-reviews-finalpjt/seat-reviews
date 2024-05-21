import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
            const response = await axios.post('http://localhost:8000/accounts/signup/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Sign up successful!');
            setTimeout(() => {
                navigate('/login');
            }, 2000); // 2초 후에 로그인 페이지로 이동
        } catch (error) {
            setMessage('Sign up failed. Please check your details.');
            console.error('Sign up failed', error);
        }
    };

    const handleFileChange = (event) => {
        setProfileImage(event.target.files[0]);
    };

    const messageStyle = {
        color: message.includes('failed') ? 'red' : 'green',
        fontWeight: 'bold',
        margin: '10px 0',
    };

    return (
        <div>
            <h2>Sign Up</h2>
            {message && <p style={messageStyle}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Nickname</label>
                    <input 
                        type="text" 
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="남성">Male</option>
                        <option value="여성">Female</option>
                        <option value="또 다른 성">Other</option>
                    </select>
                </div>
                <div>
                    <label>Birthday</label>
                    <input 
                        type="date" 
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Profile Image</label>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;
