import { usePushNotificationsContext } from '@/context/PushNotificationsContext';

/**
 * Hook to easily send notifications
 * Usage: const notify = useNotify();
 *        notify.success('Order Created', 'Your order has been created successfully');
 */
export const useNotify = () => {
  const { sendNotification, broadcastNotification } = usePushNotificationsContext();

  return {
    success: async (title: string, message: string, data?: Record<string, any>) => {
      return sendNotification('', title, message, 'success', data);
    },

    error: async (title: string, message: string, data?: Record<string, any>) => {
      return sendNotification('', title, message, 'error', data);
    },

    warning: async (title: string, message: string, data?: Record<string, any>) => {
      return sendNotification('', title, message, 'warning', data);
    },

    info: async (title: string, message: string, data?: Record<string, any>) => {
      return sendNotification('', title, message, 'info', data);
    },

    broadcastSuccess: async (
      targetType: 'driver' | 'client' | 'warehouse',
      title: string,
      message: string,
      data?: Record<string, any>
    ) => {
      return broadcastNotification(targetType, title, message, 'success', data);
    },

    broadcastError: async (
      targetType: 'driver' | 'client' | 'warehouse',
      title: string,
      message: string,
      data?: Record<string, any>
    ) => {
      return broadcastNotification(targetType, title, message, 'error', data);
    },

    broadcastWarning: async (
      targetType: 'driver' | 'client' | 'warehouse',
      title: string,
      message: string,
      data?: Record<string, any>
    ) => {
      return broadcastNotification(targetType, title, message, 'warning', data);
    },

    broadcastInfo: async (
      targetType: 'driver' | 'client' | 'warehouse',
      title: string,
      message: string,
      data?: Record<string, any>
    ) => {
      return broadcastNotification(targetType, title, message, 'info', data);
    },
  };
};
