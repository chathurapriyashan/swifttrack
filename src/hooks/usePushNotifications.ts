import { useEffect, useRef, useCallback, useState } from 'react';
import { Notification, UserType } from '@/types/notifications';

// PubSubSDK is loaded globally from pubsub-sdk.js
declare global {
  class PubSubSDK {
    constructor(userId: string, userType: string, options?: any);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    register(): Promise<boolean>;
    publish(topic: string, data: any): Promise<boolean>;
    subscribe(topic: string, callback: (message: any) => void): Promise<boolean>;
    unsubscribe(topic: string): Promise<boolean>;
    on(event: string, callback: (data: any) => void): void;
    off(event: string, callback: (data: any) => void): void;
    isConnected: boolean;
    isRegistered: boolean;
  }
}

interface UsePushNotificationsOptions {
  userId: string;
  userType: 'driver' | 'client' | 'warehouse';
  serverUrl?: string;
  onNotification?: (notification: Notification) => void;
}

export const usePushNotifications = (options: UsePushNotificationsOptions) => {
  const sdkRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize PubSubSDK
  useEffect(() => {
    const initializePubSub = async () => {
      try {
        // Import SDK dynamically
        const sdk = new PubSubSDK(options.userId, options.userType, {
          serverUrl: options.serverUrl || 'ws://localhost:3008',
          autoConnect: true,
        });

        sdkRef.current = sdk;

        // Listen for connection events
        sdk.on('connect', () => {
          console.log('✓ Connected to PubSub server');
          setIsConnected(true);
        });

        sdk.on('disconnect', () => {
          console.log('✗ Disconnected from PubSub server');
          setIsConnected(false);
          setIsRegistered(false);
        });

        sdk.on('error', (error: any) => {
          console.error('PubSub Error:', error);
        });

        // Wait for connection to be established
        await new Promise((resolve) => {
          const checkConnection = setInterval(() => {
            if (sdk.isConnected) {
              clearInterval(checkConnection);
              resolve(true);
            }
          }, 100);

          setTimeout(() => {
            clearInterval(checkConnection);
            resolve(false);
          }, 10000);
        });

        // Register with the server
        await sdk.register();
        setIsRegistered(true);
        console.log('✓ Registered with PubSub server');

        // Subscribe to user-specific notification topics
        const notificationTopic = `notifications:${options.userId}`;
        await sdk.subscribe(notificationTopic, (message: any) => {
          const notification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            title: message.title || 'Notification',
            message: message.message || message.data?.message || '',
            type: message.type || 'info',
            timestamp: Date.now(),
            data: message.data,
          };

          setNotifications((prev) => [notification, ...prev]);

          if (options.onNotification) {
            options.onNotification(notification);
          }

          // Optional: Show browser notification
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              tag: notification.id,
            });
          }
        });

        // Subscribe to broadcast topics based on user type
        const broadcastTopic = `broadcast:${options.userType}`;
        await sdk.subscribe(broadcastTopic, (message: any) => {
          const notification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            title: message.title || 'Broadcast',
            message: message.message || message.data?.message || '',
            type: message.type || 'info',
            timestamp: Date.now(),
            data: message.data,
          };

          setNotifications((prev) => [notification, ...prev]);

          if (options.onNotification) {
            options.onNotification(notification);
          }
        });
      } catch (error) {
        console.error('Failed to initialize push notifications:', error);
      }
    };

    if (options.userId) {
      initializePubSub();
    }

    return () => {
      if (sdkRef.current) {
        sdkRef.current.disconnect().catch((err: any) => {
          console.error('Error disconnecting PubSub:', err);
        });
      }
    };
  }, [options.userId, options.userType, options.serverUrl, options.onNotification]);

  // Request browser notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }

    return false;
  }, []);

  // Publish a notification to a specific user
  const sendNotification = useCallback(
    async (
      targetUserId: string,
      title: string,
      message: string,
      type: Notification['type'] = 'info',
      data?: Record<string, any>
    ) => {
      if (!sdkRef.current || !isConnected || !isRegistered) {
        throw new Error('PubSub SDK not ready');
      }

      try {
        await sdkRef.current.publish(`notifications:${targetUserId}`, {
          title,
          message,
          type,
          data,
          from: options.userId,
          fromType: options.userType,
          timestamp: Date.now(),
        });
        return true;
      } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
      }
    },
    [isConnected, isRegistered, options.userId, options.userType]
  );

  // Broadcast a notification to all users of a type
  const broadcastNotification = useCallback(
    async (
      targetUserType: 'driver' | 'client' | 'warehouse',
      title: string,
      message: string,
      type: Notification['type'] = 'info',
      data?: Record<string, any>
    ) => {
      if (!sdkRef.current || !isConnected || !isRegistered) {
        throw new Error('PubSub SDK not ready');
      }

      try {
        await sdkRef.current.publish(`broadcast:${targetUserType}`, {
          title,
          message,
          type,
          data,
          from: options.userId,
          fromType: options.userType,
          timestamp: Date.now(),
        });
        return true;
      } catch (error) {
        console.error('Error broadcasting notification:', error);
        throw error;
      }
    },
    [isConnected, isRegistered, options.userId, options.userType]
  );

  // Remove a notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Subscribe to a custom topic
  const subscribe = useCallback(
    async (topic: string, callback: (message: any) => void) => {
      if (!sdkRef.current || !isConnected || !isRegistered) {
        throw new Error('PubSub SDK not ready');
      }

      try {
        await sdkRef.current.subscribe(topic, callback);
        return true;
      } catch (error) {
        console.error(`Error subscribing to topic ${topic}:`, error);
        throw error;
      }
    },
    [isConnected, isRegistered]
  );

  // Unsubscribe from a custom topic
  const unsubscribe = useCallback(async (topic: string) => {
    if (!sdkRef.current || !isConnected || !isRegistered) {
      throw new Error('PubSub SDK not ready');
    }

    try {
      await sdkRef.current.unsubscribe(topic);
      return true;
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
      throw error;
    }
  }, [isConnected, isRegistered]);

  return {
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
    sdk: sdkRef.current,
  };
};

// Re-export Notification type for convenience
export type { Notification };
