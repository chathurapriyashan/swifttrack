import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Notification } from '@/types/notifications';
import { usePushNotificationsContext } from '@/context/PushNotificationsContext';

interface NotificationToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
  autoRemoveDelay?: number;
}

const getNotificationStyle = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: CheckCircle,
        iconColor: 'text-green-500',
      };
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: AlertCircle,
        iconColor: 'text-red-500',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: AlertTriangle,
        iconColor: 'text-yellow-500',
      };
    case 'info':
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: Info,
        iconColor: 'text-blue-500',
      };
  }
};

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onRemove,
  autoRemoveDelay = 5000,
}) => {
  useEffect(() => {
    if (autoRemoveDelay > 0) {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, autoRemoveDelay);

      return () => clearTimeout(timer);
    }
  }, [notification.id, onRemove, autoRemoveDelay]);

  const style = getNotificationStyle(notification.type);
  const IconComponent = style.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${style.bg} ${style.border} ${style.text} shadow-md`}
    >
      <IconComponent className={`h-5 w-5 mt-0.5 flex-shrink-0 ${style.iconColor}`} />
      <div className="flex-1">
        <h3 className="font-semibold">{notification.title}</h3>
        <p className="text-sm mt-1">{notification.message}</p>
      </div>
      <button
        onClick={() => onRemove(notification.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

interface NotificationContainerProps {
  autoRemoveDelay?: number;
  maxNotifications?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  autoRemoveDelay = 5000,
  maxNotifications = 5,
  position = 'top-right',
}) => {
  const { notifications, removeNotification } = usePushNotificationsContext();

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const displayedNotifications = notifications.slice(0, maxNotifications);

  return (
    <div
      className={`fixed ${positionClasses[position]} flex flex-col gap-3 z-50 pointer-events-none`}
    >
      {displayedNotifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationToast
            notification={notification}
            onRemove={removeNotification}
            autoRemoveDelay={autoRemoveDelay}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
