# Push Notifications System - Quick Start Guide

## What's Been Implemented

A complete push notification system has been integrated into your application with the following features:

### ✅ Core Features
- **WebSocket-based real-time notifications** using the existing PubSub SDK
- **Automatic server registration** on app startup
- **Topic-based subscriptions** (user-specific, broadcast, custom topics)
- **Browser notification support** with permission management
- **Beautiful notification UI** with auto-dismiss
- **Type-safe TypeScript** implementation
- **React Context API** for app-wide access
- **Multiple notification types** (success, error, warning, info)

### ✅ Files Created/Modified

#### New Files Created:
1. **`src/hooks/usePushNotifications.ts`** - Core hook managing notifications
2. **`src/hooks/useNotify.ts`** - Simplified notification helper hook
3. **`src/context/PushNotificationsContext.tsx`** - React context provider
4. **`src/components/notifications/NotificationContainer.tsx`** - Display component
5. **`src/components/notifications/PushNotificationsDemo.tsx`** - Demo/test component
6. **`PUSH_NOTIFICATIONS_GUIDE.md`** - Comprehensive documentation
7. **`PUSH_NOTIFICATIONS_EXAMPLES.md`** - Practical integration examples
8. **`.env.example`** - Environment configuration template

#### Modified Files:
1. **`src/App.tsx`** - Wrapped with PushNotificationsProvider

---

## Quick Setup

### 1. Environment Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_PUBSUB_SERVER_URL=ws://localhost:3008
VITE_GOOGLE_CLIENT_ID=your_client_id
```

### 2. Start the Application

The push notifications are automatically initialized when the app loads:

```bash
npm run dev
```

The system will:
- Connect to the PubSub server
- Register the user
- Subscribe to notification topics
- Display NotificationContainer on the page

### 3. Verify It's Working

Check browser console for:
```
✓ Connected to PubSub server
✓ Registered with PubSub server
```

---

## Usage - Choose Your Style

### Option A: Simple Notifications (Recommended for Most Cases)

```tsx
import { useNotify } from '@/hooks/useNotify';

export function MyComponent() {
  const notify = useNotify();

  const handleAction = () => {
    notify.success('Success!', 'Action completed');
    // Or: notify.error(), notify.warning(), notify.info()
  };

  return <button onClick={handleAction}>Do Something</button>;
}
```

### Option B: Send to Specific User

```tsx
import { usePushNotificationsContext } from '@/context/PushNotificationsContext';

export function NotifyUser() {
  const { sendNotification, isConnected, isRegistered } = usePushNotificationsContext();

  const handleNotify = async () => {
    if (!isConnected || !isRegistered) {
      alert('Service not ready');
      return;
    }

    await sendNotification(
      'user@example.com',
      'Order Update',
      'Your order #123 is ready',
      'success'
    );
  };

  return <button onClick={handleNotify}>Notify User</button>;
}
```

### Option C: Broadcast to All Users of a Type

```tsx
export function BroadcastAlert() {
  const { broadcastNotification } = usePushNotificationsContext();

  const sendAlert = async () => {
    await broadcastNotification(
      'driver', // 'driver' | 'client' | 'warehouse'
      'Alert',
      'Traffic on Route 5',
      'warning'
    );
  };

  return <button onClick={sendAlert}>Alert All Drivers</button>;
}
```

---

## Integration Examples

### 1. Order Creation Success Notification

```tsx
const handleCreateOrder = async (orderData) => {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });

    const order = await response.json();
    
    // Notify user
    notify.success(
      'Order Created',
      `Order #${order.id} created successfully`
    );

    // Notify warehouse to process
    await sendNotification(
      'warehouse@example.com',
      'New Order',
      `Order #${order.id} needs processing`,
      'info'
    );
  } catch (error) {
    notify.error('Error', 'Failed to create order');
  }
};
```

### 2. Real-time Status Updates

```tsx
useEffect(() => {
  subscribe('order-status', (message) => {
    // Update order status when warehouse posts update
    setOrderStatus(message.status);
    setLocation(message.location);
  });
}, [subscribe]);
```

### 3. Emergency Broadcast

```tsx
const sendEmergencyAlert = async () => {
  // Alert all drivers
  await broadcastNotification(
    'driver',
    'Emergency Alert',
    'Traffic incident on main route',
    'error'
  );

  // Alert all warehouse staff
  await broadcastNotification(
    'warehouse',
    'System Maintenance',
    'System will go offline for maintenance',
    'warning'
  );
};
```

---

## Testing the System

### Using the Demo Component

Add to any page temporarily:

```tsx
import PushNotificationsDemo from '@/components/notifications/PushNotificationsDemo';

export function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <PushNotificationsDemo />
    </div>
  );
}
```

Then visit that page in your browser. You'll see:
- Connection status
- Form to send notifications to specific users
- Buttons to broadcast to different user types
- List of received notifications

### Manual Testing via Browser Console

```javascript
// Get the context through a component's hook (requires component render)
// Or test by clicking demo buttons in PushNotificationsDemo component
```

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Your Application (React)        │
├─────────────────────────────────────────┤
│  PushNotificationsProvider (App.tsx)   │
├─────────────────────────────────────────┤
│  usePushNotifications Hook              │ ← Manages connection
│  PubSubSDK (WebSocket)                  │
├─────────────────────────────────────────┤
│  Subscribe to Topics:                   │
│  - notifications:${userId}              │
│  - broadcast:${userType}                │
│  - Custom topics                        │
├─────────────────────────────────────────┤
│  NotificationContainer                  │ ← Displays notifications
└─────────────────────────────────────────┘
         ↓
    PubSub Server
  (ws://localhost:3008)
         ↓
    Other Users/Services
```

---

## Notification Lifecycle

1. **User logs in** → App initializes PushNotificationsProvider
2. **Connection established** → Connects to WebSocket server
3. **Registration** → Registers user with PubSub server
4. **Subscriptions** → Subscribes to user topics and broadcast topics
5. **Send notification** → `sendNotification()` or `broadcastNotification()`
6. **Receive notification** → Message arrives via WebSocket
7. **Display** → NotificationContainer shows notification
8. **Auto-dismiss** → After 5 seconds (configurable)

---

## Notification Types & Styling

| Type | Color | Icon | Use For |
|------|-------|------|---------|
| `success` | Green ✓ | CheckCircle | Order placed, item delivered, action successful |
| `error` | Red ✗ | AlertCircle | Failure, error, problem |
| `warning` | Yellow ! | AlertTriangle | Caution, maintenance, alerts |
| `info` | Blue ℹ️ | Info | General information, updates |

---

## Configuration Options

### NotificationContainer Props

```tsx
<NotificationContainer
  position="top-right"      // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  autoRemoveDelay={5000}    // ms, 0 = no auto-dismiss
  maxNotifications={5}      // max concurrent notifications
/>
```

### Environment Variables

```env
VITE_PUBSUB_SERVER_URL=ws://localhost:3008
```

---

## API Reference Quick Reference

### `useNotify()` Hook
```typescript
notify.success(title, message, data?)
notify.error(title, message, data?)
notify.warning(title, message, data?)
notify.info(title, message, data?)
notify.broadcastSuccess(userType, title, message, data?)
notify.broadcastError(userType, title, message, data?)
notify.broadcastWarning(userType, title, message, data?)
notify.broadcastInfo(userType, title, message, data?)
```

### `usePushNotificationsContext()` Hook
```typescript
{
  isConnected: boolean
  isRegistered: boolean
  notifications: Notification[]
  requestNotificationPermission: () => Promise<boolean>
  sendNotification: (...) => Promise<boolean>
  broadcastNotification: (...) => Promise<boolean>
  removeNotification: (id: string) => void
  clearNotifications: () => void
  subscribe: (topic, callback) => Promise<boolean>
  unsubscribe: (topic) => Promise<boolean>
}
```

---

## Troubleshooting

### Notifications Not Showing?
- ✓ Check console for "Connected" message
- ✓ Verify PubSub server is running on correct URL
- ✓ Check VITE_PUBSUB_SERVER_URL environment variable
- ✓ Open browser DevTools → Application → Console

### Connection Failed?
- ✓ Ensure PubSub server is running: `ws://localhost:3008`
- ✓ Check server logs for errors
- ✓ Verify network connection
- ✓ Try different server URL if needed

### Browser Notifications Not Working?
- ✓ Call `requestNotificationPermission()` first
- ✓ Check browser notification settings
- ✓ Some browsers require user interaction before notifications

---

## Next Steps

1. **Test the demo**: Add `<PushNotificationsDemo />` to a page
2. **Integrate into pages**: Follow examples in PUSH_NOTIFICATIONS_EXAMPLES.md
3. **Customize styling**: Modify NotificationContainer styles in components/notifications/
4. **Deploy**: Ensure PubSub server URL is correct in production
5. **Monitor**: Check browser console for any connection issues

---

## Important Notes

⚠️ **Make sure PubSub server is running**:
- URL: `ws://localhost:3008` (default)
- Configure in `.env` → `VITE_PUBSUB_SERVER_URL`

⚠️ **User Authentication**:
- Uses `user.email` as userId
- Ensure user is logged in before notifications work
- Adjust in App.tsx if you use different user identifier

⚠️ **Production Deployment**:
- Update `VITE_PUBSUB_SERVER_URL` for your production server
- Request browser notification permission from users
- Handle WebSocket connection securely (wss:// protocol)

---

## Documentation Files

- **PUSH_NOTIFICATIONS_GUIDE.md** - Complete API documentation
- **PUSH_NOTIFICATIONS_EXAMPLES.md** - Practical integration examples
- **.env.example** - Configuration template

---

## Support

For issues or questions:
1. Check the documentation files
2. Review examples in PUSH_NOTIFICATIONS_EXAMPLES.md
3. Test using PushNotificationsDemo component
4. Check browser console for error messages

Happy notifying! 🚀
