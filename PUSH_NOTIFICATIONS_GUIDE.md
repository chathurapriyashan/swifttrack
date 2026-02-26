# Push Notifications Integration Guide

This guide explains how to use the push notifications system integrated with the PubSub SDK.

## Overview

The push notifications system provides:
- **Real-time messaging** via WebSocket (PubSub Server)
- **Automatic registration** with the PubSub server
- **Topic-based subscriptions** for targeted notifications
- **Browser notifications** support
- **Notification display component** with auto-dismiss
- **Type-safe** notification handling

## Architecture

### Components

1. **usePushNotifications Hook** - Core hook managing SDK connection and subscriptions
2. **PushNotificationsContext** - React Context for app-wide access
3. **PushNotificationsProvider** - Provider component wrapping the app
4. **NotificationContainer** - Display component for showing notifications
5. **useNotify Hook** - Simplified helper for sending notifications

### Data Flow

```
App.tsx (wrapped with PushNotificationsProvider)
  ↓
PubSub WebSocket Connection (to server)
  ↓
Subscribe to Topics (notifications:userId, broadcast:userType)
  ↓
Receive Messages → Notifications Array → NotificationContainer (displays)
```

## Setup

### 1. Update Environment Variables

Add to `.env`:

```env
VITE_PUBSUB_SERVER_URL=ws://localhost:3008
```

Or use the default `ws://localhost:3008`

### 2. Configuration in App.tsx

The app is already configured. The provider wraps the entire app:

```tsx
<PushNotificationsProvider
  userId={user.email || 'anonymous'}
  userType="client"
  serverUrl={import.meta.env.VITE_PUBSUB_SERVER_URL || 'ws://localhost:3008'}
>
  <NotificationContainer position="top-right" autoRemoveDelay={5000} />
  {/* Routes... */}
</PushNotificationsProvider>
```

## Usage Examples

### 1. Using the Context (Full Control)

```tsx
import { usePushNotificationsContext } from '@/context/PushNotificationsContext';

export function MyComponent() {
  const {
    isConnected,
    isRegistered,
    notifications,
    sendNotification,
    broadcastNotification,
    subscribe,
    unsubscribe,
  } = usePushNotificationsContext();

  const handleSendNotification = async () => {
    try {
      await sendNotification(
        'user@example.com',
        'Order Status',
        'Your order has been shipped',
        'success',
        { orderId: '12345' }
      );
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  return (
    <div>
      <p>Connected: {isConnected ? '✓' : '✗'}</p>
      <p>Registered: {isRegistered ? '✓' : '✗'}</p>
      <button onClick={handleSendNotification}>
        Send Notification
      </button>
    </div>
  );
}
```

### 2. Using the useNotify Hook (Simplified)

```tsx
import { useNotify } from '@/hooks/useNotify';

export function OrderForm() {
  const notify = useNotify();

  const handleSubmit = async () => {
    try {
      // Create order...
      notify.success('Order Created', 'Your order has been created successfully');
    } catch (error) {
      notify.error('Order Failed', 'Could not create order');
    }
  };

  return <button onClick={handleSubmit}>Create Order</button>;
}
```

### 3. Broadcasting to User Type

```tsx
const { broadcastNotification } = usePushNotificationsContext();

// Send to all drivers
await broadcastNotification(
  'driver',
  'New Delivery Available',
  'A new delivery order is available for pickup',
  'info',
  { orderId: '12345' }
);

// Send to all clients
await broadcastNotification(
  'client',
  'System Maintenance',
  'System will be under maintenance from 10 PM to 11 PM',
  'warning'
);
```

### 4. Subscribing to Custom Topics

```tsx
useEffect(() => {
  const setupSubscription = async () => {
    await subscribe('order-tracking', (message) => {
      console.log('Order update:', message);
      // Update UI based on message
    });
  };

  setupSubscription();
}, [subscribe]);
```

### 5. Requesting Browser Notifications

```tsx
const { requestNotificationPermission } = usePushNotificationsContext();

const handleEnableNotifications = async () => {
  const granted = await requestNotificationPermission();
  if (granted) {
    console.log('Browser notifications enabled');
  }
};
```

## Notification Topics

The system automatically subscribes to these topics:

### User-Specific Topics
- `notifications:${userId}` - Sends notification to a specific user
- Automatically subscribed when user registers

### Broadcast Topics
- `broadcast:driver` - All drivers receive this
- `broadcast:client` - All clients receive this
- `broadcast:warehouse` - All warehouse users receive this
- Automatically subscribed based on user type

### Custom Topics
- Subscribe using `subscribe(topic, callback)`
- Useful for real-time updates (order status, location tracking, etc.)

## Notification Types

Four notification types with different styling:

```tsx
type NotificationType = 'success' | 'error' | 'warning' | 'info';
```

- **success** - Green, CheckCircle icon (orders placed, items delivered)
- **error** - Red, AlertCircle icon (failures, errors)
- **warning** - Yellow, AlertTriangle icon (warnings, cautions)
- **info** - Blue, Info icon (general information)

## Features

### Auto-Dismiss
Notifications auto-dismiss after 5 seconds (configurable):

```tsx
<NotificationContainer
  position="top-right"
  autoRemoveDelay={5000}  // milliseconds
  maxNotifications={5}     // max shown at once
/>
```

### Positions
- `top-right`
- `top-left`
- `bottom-right`
- `bottom-left`

### Notification Object

```tsx
interface Notification {
  id: string;              // Unique identifier
  title: string;           // Notification title
  message: string;         // Notification message
  type: NotificationType;  // Type of notification
  timestamp: number;       // When it was created
  data?: Record<string, any>; // Custom data
}
```

## Server Integration

The system connects to a PubSub WebSocket server. Expected message format:

```json
{
  "type": "notification",
  "topic": "notifications:user@example.com",
  "title": "Order Update",
  "message": "Your order has been shipped",
  "type": "success",
  "from": "warehouse@example.com",
  "fromType": "warehouse",
  "timestamp": 1609459200000
}
```

## Connection States

```tsx
const { isConnected, isRegistered } = usePushNotificationsContext();

// Initial state: not connected
// After connection: isConnected = true
// After registration: isRegistered = true

// Can only send/receive when both are true
```

## Error Handling

```tsx
const { sendNotification } = usePushNotificationsContext();

try {
  await sendNotification(userId, title, message, 'success');
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    // Handle based on error message:
    // - 'Not connected or registered'
    // - 'Publish timeout'
    // - Network errors
  }
}
```

## Testing

Use the demo component to test notifications:

```tsx
import PushNotificationsDemo from '@/components/notifications/PushNotificationsDemo';

// Add to a page for testing
<PushNotificationsDemo />
```

## Best Practices

1. **Always check connection status** before sending notifications
2. **Use appropriate types** (success, error, warning, info)
3. **Keep messages concise** - users should understand at a glance
4. **Batch notifications** - don't spam users
5. **Request permission** for browser notifications using `requestNotificationPermission()`
6. **Use custom topics** for real-time updates (location, status, etc.)
7. **Include relevant data** in `data` property for context
8. **Handle errors gracefully** - users should know what failed and why

## Troubleshooting

### Notifications Not Showing?
- Check connection status in browser console
- Verify PubSub server is running
- Ensure `VITE_PUBSUB_SERVER_URL` is correct

### Connection Fails?
- Check server URL configuration
- Verify server is accessible
- Check browser console for WebSocket errors
- Ensure server supports WebSocket

### Registration Timeout?
- May indicate server is overloaded or unreachable
- Check network connection
- Verify PubSub server is running

### Browser Notifications Not Working?
- Request permission using `requestNotificationPermission()`
- Check browser notification settings
- Some browsers require user interaction before showing notifications

## Advanced Usage

### Custom Reconnection Handler

```tsx
const { sdk } = usePushNotificationsContext();

// The SDK automatically handles reconnection with exponential backoff
// Max 10 reconnection attempts
```

### High-Volume Notifications

```tsx
// For dashboard with many updates, subscribe to a batched topic
await subscribe('batch-updates', (message) => {
  // Handle multiple updates at once
  message.updates.forEach(update => {
    // Process update
  });
});
```

### Notification Persistence

```tsx
// Notifications are stored in useState, cleared on page refresh
// To persist, save to localStorage or database:
const [notifications, setNotifications] = useState(() => {
  const saved = localStorage.getItem('notifications');
  return saved ? JSON.parse(saved) : [];
});
```

## API Reference

### usePushNotificationsContext()

```tsx
interface PushNotificationsContextType {
  isConnected: boolean;
  isRegistered: boolean;
  notifications: Notification[];
  requestNotificationPermission(): Promise<boolean>;
  sendNotification(
    targetUserId: string,
    title: string,
    message: string,
    type?: NotificationType,
    data?: Record<string, any>
  ): Promise<boolean>;
  broadcastNotification(
    targetUserType: 'driver' | 'client' | 'warehouse',
    title: string,
    message: string,
    type?: NotificationType,
    data?: Record<string, any>
  ): Promise<boolean>;
  removeNotification(id: string): void;
  clearNotifications(): void;
  subscribe(topic: string, callback: (message: any) => void): Promise<boolean>;
  unsubscribe(topic: string): Promise<boolean>;
}
```

### useNotify()

Simplified API for common operations:

```tsx
notify.success(title, message, data?)
notify.error(title, message, data?)
notify.warning(title, message, data?)
notify.info(title, message, data?)
notify.broadcastSuccess(userType, title, message, data?)
notify.broadcastError(userType, title, message, data?)
notify.broadcastWarning(userType, title, message, data?)
notify.broadcastInfo(userType, title, message, data?)
```
