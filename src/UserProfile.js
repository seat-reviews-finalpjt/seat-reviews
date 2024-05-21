import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UserProfile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setMessage('No token found. Please log in.');
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

    const handleDelete = async () => {
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
            setMessage('User deleted successfully!');
            localStorage.removeItem('token');
            setTimeout(() => {
                navigate('/');
            }, 2000); // 2초 후에 메인 페이지로 이동
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage('Unauthorized. Please log in.');
                navigate('/login');
            } else {
                setMessage('Failed to delete user. Please check your password.');
            }
            console.error('Failed to delete user', error);
        }
    };

    return (
        <div>
            <h2>User Profile</h2>
            {message && <p>{message}</p>}
            {user ? (
                <div>
                    <p>Username: {user.username}</p>
                    <p>Profile Image: <img src={user.profile_image} alt="Profile" /></p>
                    <div>
                        <label>Password for deletion</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button onClick={handleDelete}>Delete Account</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default UserProfile;
