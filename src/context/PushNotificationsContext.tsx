import React, {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Notification } from '@/types/notifications';

interface PushNotificationsContextType {
  isConnected: boolean;
  isRegistered: boolean;
  notifications: Notification[];
  requestNotificationPermission: () => Promise<boolean>;
  sendNotification: (
    targetUserId: string,
    title: string,
    message: string,
    type?: Notification['type'],
    data?: Record<string, any>
  ) => Promise<boolean>;
  broadcastNotification: (
    targetUserType: 'driver' | 'client' | 'warehouse',
    title: string,
    message: string,
    type?: Notification['type'],
    data?: Record<string, any>
  ) => Promise<boolean>;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  subscribe: (topic: string, callback: (message: any) => void) => Promise<boolean>;
  unsubscribe: (topic: string) => Promise<boolean>;
}

const PushNotificationsContext = createContext<PushNotificationsContextType | undefined>(undefined);

interface PushNotificationsProviderProps {
  children: ReactNode;
  userId: string;
  userType: 'driver' | 'client' | 'warehouse';
  serverUrl?: string;
  onNotification?: (notification: Notification) => void;
}

export const PushNotificationsProvider: React.FC<PushNotificationsProviderProps> = ({
  children,
  userId,
  userType,
  serverUrl,
  onNotification,
}) => {
  const {
    isConnected,
    isRegistered,
    notifications,
    requestNotificationPermission,
    sendNotification,
    broadcastNotification,
    removeNotification,
    clearNotifications,
    subscribe,
    unsubscribe,
  } = usePushNotifications({
    userId,
    userType,
    serverUrl,
    onNotification,
  });

  const value: PushNotificationsContextType = {
    isConnected,
    isRegistered,
    notifications,
    requestNotificationPermission,
    sendNotification,
    broadcastNotification,
    removeNotification,
    clearNotifications,
    subscribe,
    unsubscribe,
  };

  return (
    <PushNotificationsContext.Provider value={value}>
      {children}
    </PushNotificationsContext.Provider>
  );
};

export const usePushNotificationsContext = (): PushNotificationsContextType => {
  const context = useContext(PushNotificationsContext);
  if (!context) {
    throw new Error(
      'usePushNotificationsContext must be used within PushNotificationsProvider'
    );
  }
  return context;
};
