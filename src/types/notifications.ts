/**
 * TypeScript Type Definitions for Push Notifications System
 * 
 * Import these types in your components for better type safety:
 * 
 * import type { Notification, NotificationType } from '@/types/notifications';
 */

/**
 * Notification object structure
 */
export interface Notification {
  /**
   * Unique identifier for the notification
   */
  id: string;

  /**
   * Notification title/heading
   */
  title: string;

  /**
   * Notification message content
   */
  message: string;

  /**
   * Type of notification affects styling and icon
   */
  type: NotificationType;

  /**
   * Timestamp when notification was created (milliseconds)
   */
  timestamp: number;

  /**
   * Custom data associated with the notification
   * Can include orderId, location, status, etc.
   */
  data?: Record<string, any>;
}

/**
 * Notification type - affects styling and icon displayed
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * User type in the system
 */
export type UserType = 'driver' | 'client' | 'warehouse';

/**
 * Options for initializing push notifications
 */
export interface PushNotificationOptions {
  /**
   * Unique user identifier (usually email)
   */
  userId: string;

  /**
   * Type of user in the system
   */
  userType: UserType;

  /**
   * WebSocket server URL
   * Default: 'ws://localhost:3008'
   */
  serverUrl?: string;

  /**
   * Callback when notification is received
   */
  onNotification?: (notification: Notification) => void;
}

/**
 * State returned by usePushNotifications hook
 */
export interface PushNotificationsState {
  /**
   * Whether connected to WebSocket server
   */
  isConnected: boolean;

  /**
   * Whether registered with PubSub server
   */
  isRegistered: boolean;

  /**
   * Array of notifications received
   */
  notifications: Notification[];

  /**
   * Request browser notification permission
   */
  requestNotificationPermission: () => Promise<boolean>;

  /**
   * Send notification to specific user
   */
  sendNotification: (
    targetUserId: string,
    title: string,
    message: string,
    type?: NotificationType,
    data?: Record<string, any>
  ) => Promise<boolean>;

  /**
   * Broadcast notification to all users of a type
   */
  broadcastNotification: (
    targetUserType: UserType,
    title: string,
    message: string,
    type?: NotificationType,
    data?: Record<string, any>
  ) => Promise<boolean>;

  /**
   * Remove notification by ID
   */
  removeNotification: (id: string) => void;

  /**
   * Clear all notifications
   */
  clearNotifications: () => void;

  /**
   * Subscribe to a custom topic
   */
  subscribe: (topic: string, callback: (message: any) => void) => Promise<boolean>;

  /**
   * Unsubscribe from a topic
   */
  unsubscribe: (topic: string) => Promise<boolean>;

  /**
   * Reference to the SDK instance (for advanced usage)
   */
  sdk: any;
}

/**
 * Message received from PubSub server
 */
export interface PubSubMessage {
  /**
   * Message type (notification, subscribed, error, etc.)
   */
  type: string;

  /**
   * Topic the message was sent to
   */
  topic?: string;

  /**
   * Notification title
   */
  title?: string;

  /**
   * Notification message
   */
  message?: string;

  /**
   * Notification type
   */
  notificationType?: NotificationType;

  /**
   * User ID who sent the notification
   */
  from?: string;

  /**
   * Type of user who sent the notification
   */
  fromType?: UserType;

  /**
   * Custom data
   */
  data?: Record<string, any>;

  /**
   * Timestamp of message
   */
  timestamp?: number;

  /**
   * Additional message properties
   */
  [key: string]: any;
}

/**
 * Configuration for NotificationContainer component
 */
export interface NotificationContainerProps {
  /**
   * Where to position the notifications
   * @default 'top-right'
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /**
   * How long before auto-dismissing (ms)
   * Set to 0 to disable auto-dismiss
   * @default 5000
   */
  autoRemoveDelay?: number;

  /**
   * Maximum number of notifications to show simultaneously
   * @default 5
   */
  maxNotifications?: number;
}

/**
 * Result of sending a notification
 */
export interface SendNotificationResult {
  /**
   * Whether the notification was sent successfully
   */
  success: boolean;

  /**
   * ID of the notification (for tracking)
   */
  notificationId?: string;

  /**
   * Error message if failed
   */
  error?: string;

  /**
   * Additional metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Connection status of the PubSub SDK
 */
export interface ConnectionStatus {
  /**
   * Is connected to WebSocket server
   */
  isConnected: boolean;

  /**
   * Is registered with PubSub server
   */
  isRegistered: boolean;

  /**
   * User ID
   */
  userId: string;

  /**
   * User type
   */
  userType: UserType;

  /**
   * List of subscribed topics
   */
  subscriptions: string[];

  /**
   * Number of reconnection attempts
   */
  reconnectAttempts: number;
}

/**
 * Topic name constants for type safety
 */
export const NOTIFICATION_TOPICS = {
  /**
   * Topic for user-specific notifications
   * Format: notifications:userId
   */
  USER_NOTIFICATIONS: (userId: string) => `notifications:${userId}`,

  /**
   * Topic for broadcasting to all users of a type
   * Format: broadcast:userType
   */
  BROADCAST: (userType: UserType) => `broadcast:${userType}`,

  /**
   * Topic for order status updates
   * Format: order-status:orderId
   */
  ORDER_STATUS: (orderId: string) => `order-status:${orderId}`,

  /**
   * Topic for delivery updates
   * Format: delivery-updates:deliveryId
   */
  DELIVERY_UPDATES: (deliveryId: string) => `delivery-updates:${deliveryId}`,

  /**
   * Topic for driver location updates
   * Format: driver-location:driverId
   */
  DRIVER_LOCATION: (driverId: string) => `driver-location:${driverId}`,

  /**
   * Topic for system announcements
   */
  ANNOUNCEMENTS: 'announcements',

  /**
   * Topic for promotional notifications
   */
  PROMOTIONS: 'promotions',

  /**
   * Topic for order updates
   */
  ORDER_UPDATES: 'order-updates',
} as const;

/**
 * Helper type for TypeScript when using notification topics
 */
export type NotificationTopic = ReturnType<
  (typeof NOTIFICATION_TOPICS)[keyof typeof NOTIFICATION_TOPICS]
> | typeof NOTIFICATION_TOPICS[keyof typeof NOTIFICATION_TOPICS];

/**
 * Helper function to create user notification payload
 */
export function createUserNotificationPayload(
  title: string,
  message: string,
  type: NotificationType = 'info',
  data?: Record<string, any>
) {
  return {
    title,
    message,
    type,
    data,
    timestamp: Date.now(),
  };
}

/**
 * Helper function to create broadcast notification payload
 */
export function createBroadcastPayload(
  title: string,
  message: string,
  type: NotificationType = 'info',
  data?: Record<string, any>
) {
  return {
    title,
    message,
    type,
    data,
    timestamp: Date.now(),
  };
}

/**
 * Type guard to check if object is a Notification
 */
export function isNotification(obj: any): obj is Notification {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.message === 'string' &&
    ['success', 'error', 'warning', 'info'].includes(obj.type) &&
    typeof obj.timestamp === 'number'
  );
}

/**
 * Type guard for notification type
 */
export function isNotificationType(value: any): value is NotificationType {
  return ['success', 'error', 'warning', 'info'].includes(value);
}

/**
 * Type guard for user type
 */
export function isUserType(value: any): value is UserType {
  return ['driver', 'client', 'warehouse'].includes(value);
}
