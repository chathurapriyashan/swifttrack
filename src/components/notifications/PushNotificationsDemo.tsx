import React, { useState } from 'react';
import { usePushNotificationsContext } from '@/context/PushNotificationsContext';
import { Button } from '@/components/ui/button';

/**
 * Demo component showing how to use push notifications
 */
export const PushNotificationsDemo: React.FC = () => {
  const {
    isConnected,
    isRegistered,
    notifications,
    requestNotificationPermission,
    sendNotification,
    broadcastNotification,
  } = usePushNotificationsContext();

  const [targetUserId, setTargetUserId] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('Order Update');
  const [notificationMessage, setNotificationMessage] = useState('Your package has been delivered');
  const [notificationType, setNotificationType] = useState<'info' | 'success' | 'warning' | 'error'>('info');

  const handleSendNotification = async () => {
    try {
      await sendNotification(
        targetUserId,
        notificationTitle,
        notificationMessage,
        notificationType
      );
      alert('Notification sent successfully!');
    } catch (error) {
      alert('Error sending notification: ' + (error as Error).message);
    }
  };

  const handleBroadcastNotification = async (userType: 'driver' | 'client' | 'warehouse') => {
    try {
      await broadcastNotification(
        userType,
        notificationTitle,
        notificationMessage,
        notificationType
      );
      alert(`Broadcast sent to all ${userType}s!`);
    } catch (error) {
      alert('Error broadcasting notification: ' + (error as Error).message);
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    alert(
      granted
        ? 'Notification permission granted!'
        : 'Notification permission denied'
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Push Notifications Demo</h2>

      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Connection Status</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Connected:</span>{' '}
            <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
              {isConnected ? '✓ Yes' : '✗ No'}
            </span>
          </p>
          <p>
            <span className="font-medium">Registered:</span>{' '}
            <span className={isRegistered ? 'text-green-600' : 'text-red-600'}>
              {isRegistered ? '✓ Yes' : '✗ No'}
            </span>
          </p>
          <p>
            <span className="font-medium">Notifications Received:</span>{' '}
            <span className="font-mono">{notifications.length}</span>
          </p>
        </div>
      </div>

      {/* Send Notification Form */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="font-semibold mb-4">Send Notification to Specific User</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Target User ID</label>
            <input
              type="email"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value as any)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <Button
            onClick={handleSendNotification}
            disabled={!isConnected || !isRegistered || !targetUserId}
            className="w-full"
          >
            Send Notification
          </Button>
        </div>
      </div>

      {/* Broadcast Notifications */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="font-semibold mb-4">Broadcast Notifications</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => handleBroadcastNotification('driver')}
            disabled={!isConnected || !isRegistered}
            variant="outline"
          >
            To Drivers
          </Button>
          <Button
            onClick={() => handleBroadcastNotification('client')}
            disabled={!isConnected || !isRegistered}
            variant="outline"
          >
            To Clients
          </Button>
          <Button
            onClick={() => handleBroadcastNotification('warehouse')}
            disabled={!isConnected || !isRegistered}
            variant="outline"
          >
            To Warehouse
          </Button>
        </div>
      </div>

      {/* Browser Notifications */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="font-semibold mb-4">Browser Notifications</h3>
        <Button onClick={handleRequestPermission} variant="outline" className="w-full">
          Request Permission
        </Button>
      </div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className="p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Recent Notifications ({notifications.length})</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
            {notifications.slice(0, 5).map((notif) => (
              <div key={notif.id} className="p-2 bg-white rounded border border-blue-200">
                <p className="font-medium">{notif.title}</p>
                <p className="text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notif.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PushNotificationsDemo;
