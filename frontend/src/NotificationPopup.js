// 알림 팝업 컴포넌트
import React, { useEffect } from 'react';

const NotificationPopup = ({ id, message, removeNotification }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            removeNotification(id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, removeNotification]);

    return (
        <div className="notification-popup">
            {message}
        </div>
    );
};

export default NotificationPopup;
