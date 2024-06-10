// 알림 상태를 관리하는 컨텍스트 파일
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem('token');
    const userId = token ? jwtDecode(token).user_id : null;

    useEffect(() => {
        if (userId) {
            const ws = new WebSocket(`ws://localhost:8000/ws/notifications/${userId}/`);

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setNotifications((prev) => [...prev, { message: data.message, id: Date.now() }]);
            };

            ws.onclose = () => {
                console.log('WebSocket closed');
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            return () => {
                ws.close();
            };
        }
    }, [userId]);

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter(notification => notification.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
