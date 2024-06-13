// 알림 팝업 관리 컨테이너
import React from 'react';
import { useNotifications } from './NotificationContext';
import NotificationPopup from './NotificationPopup';

const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotifications();

    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <NotificationPopup
                    key={notification.id}
                    id={notification.id}
                    message={notification.message}
                    removeNotification={removeNotification}
                />
            ))}
        </div>
    );
};

export default NotificationContainer;
