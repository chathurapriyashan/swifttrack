/**
 * INTEGRATION EXAMPLES
 * 
 * This file shows practical examples of how to integrate push notifications
 * into your existing pages.
 */

// ============================================================================
// EXAMPLE 1: Send Notification on Order Creation
// ============================================================================

// In OrderCreateForm.tsx or similar:
import { usePushNotificationsContext } from '@/context/PushNotificationsContext';

export function OrderCreateForm() {
  const { sendNotification, isConnected, isRegistered } = usePushNotificationsContext();

  const handleCreateOrder = async (orderData: any) => {
    try {
      // Create order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();

        // Send notification to warehouse team
        if (isConnected && isRegistered) {
          await sendNotification(
            'warehouse@example.com', // or get from database
            'New Order Created',
            `Order #${order.id} has been created and needs processing`,
            'success',
            { 
              orderId: order.id,
              amount: order.totalAmount,
              items: order.items.length
            }
          );
        }

        alert('Order created successfully!');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    // Form JSX...
  );
}

// ============================================================================
// EXAMPLE 2: Broadcast Update to All Drivers
// ============================================================================

// In WarehouseDashboard.tsx or similar:
export function WarehouseDashboard() {
  const { broadcastNotification, isConnected, isRegistered } = usePushNotificationsContext();

  const handleAnnounceEmergencyUpdate = async () => {
    if (!isConnected || !isRegistered) {
      alert('Notification service not ready');
      return;
    }

    try {
      await broadcastNotification(
        'driver',
        'Traffic Alert',
        'Major traffic on Route 5. Use alternate routes.',
        'warning',
        { route: '5', affectedArea: 'Downtown' }
      );

      alert('Alert sent to all drivers');
    } catch (error) {
      alert('Failed to send alert: ' + (error as Error).message);
    }
  };

  return (
    <button onClick={handleAnnounceEmergencyUpdate}>
      Send Alert to All Drivers
    </button>
  );
}

// ============================================================================
// EXAMPLE 3: Real-time Order Status Updates
// ============================================================================

// In OrderDetails.tsx or similar:
import { useEffect } from 'react';

export function OrderDetails({ orderId }: { orderId: string }) {
  const { subscribe, unsubscribe } = usePushNotificationsContext();

  useEffect(() => {
    const setupOrderTracking = async () => {
      const topic = `order-status:${orderId}`;

      try {
        await subscribe(topic, (message) => {
          // Message from warehouse/driver about this order
          console.log('Order status update:', message);

          // Update UI state with new status
          setOrderStatus(message.status);
          setLocation(message.location);
        });

        // Cleanup on unmount
        return async () => {
          await unsubscribe(topic);
        };
      } catch (error) {
        console.error('Failed to setup order tracking:', error);
      }
    };

    setupOrderTracking();
  }, [orderId, subscribe, unsubscribe]);

  return (
    // Order details JSX...
  );
}

// ============================================================================
// EXAMPLE 4: Using useNotify Hook (Simplest)
// ============================================================================

// In any component:
import { useNotify } from '@/hooks/useNotify';

export function CheckoutForm() {
  const notify = useNotify();

  const handleSubmit = async (formData: any) => {
    try {
      // Process payment...
      notify.success(
        'Payment Successful',
        'Your payment has been processed'
      );
    } catch (error) {
      notify.error(
        'Payment Failed',
        'Could not process your payment. Please try again.'
      );
    }
  };

  return (
    // Form JSX...
  );
}

// ============================================================================
// EXAMPLE 5: Listen to Multiple Topics
// ============================================================================

// In ClientDashboard.tsx:
export function ClientDashboard() {
  const { subscribe } = usePushNotificationsContext();

  useEffect(() => {
    const setupSubscriptions = async () => {
      try {
        // Subscribe to order updates
        await subscribe('order-updates', (message) => {
          console.log('Order update:', message);
          // Refresh orders list
          refetchOrders();
        });

        // Subscribe to promotion notifications
        await subscribe('promotions', (message) => {
          console.log('New promotion:', message);
          showPromotion(message.data);
        });

        // Subscribe to system announcements
        await subscribe('announcements', (message) => {
          console.log('Announcement:', message);
          // Show modal or banner
        });
      } catch (error) {
        console.error('Failed to setup subscriptions:', error);
      }
    };

    setupSubscriptions();
  }, [subscribe]);

  return (
    // Dashboard JSX...
  );
}

// ============================================================================
// EXAMPLE 6: Permission Request on First Login
// ============================================================================

// In Login.tsx or after authentication:
export function AuthCallback() {
  const { requestNotificationPermission } = usePushNotificationsContext();
  const navigate = useNavigate();

  useEffect(() => {
    const requestPermissions = async () => {
      // Give user immediate feedback
      const granted = await requestNotificationPermission();

      if (granted) {
        console.log('Browser notifications enabled');
      } else {
        console.log('User denied notification permission');
      }

      // Continue to dashboard regardless
      navigate('/dashboard');
    };

    // Show permission prompt
    setTimeout(() => {
      requestPermissions();
    }, 1000);
  }, [requestNotificationPermission, navigate]);

  return <div>Setting up your account...</div>;
}

// ============================================================================
// EXAMPLE 7: Conditional Notifications Based on User Type
// ============================================================================

// Helper function to use across your app:
export async function notifyUser(
  userId: string,
  userType: 'driver' | 'client' | 'warehouse',
  options: {
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    data?: Record<string, any>;
  }
) {
  const { sendNotification } = usePushNotificationsContext();

  try {
    // Customize notification based on user type
    const notificationOptions = {
      ...options,
      data: {
        ...options.data,
        recipientType: userType,
      },
    };

    await sendNotification(
      userId,
      notificationOptions.title,
      notificationOptions.message,
      notificationOptions.type || 'info',
      notificationOptions.data
    );
  } catch (error) {
    console.error('Failed to notify user:', error);
  }
}

// ============================================================================
// EXAMPLE 8: Error Notification Wrapper
// ============================================================================

export function useErrorNotification() {
  const notify = useNotify();

  return {
    handleError: (error: unknown, defaultMessage = 'Something went wrong') => {
      const message = error instanceof Error ? error.message : defaultMessage;
      notify.error('Error', message);
      console.error('Application error:', error);
    },

    handleApiError: (response: Response) => {
      notify.error('Request Failed', `Server error: ${response.status}`);
    },

    handleValidationError: (field: string, message: string) => {
      notify.warning('Validation Error', `${field}: ${message}`);
    },
  };
}

// ============================================================================
// EXAMPLE 9: Progress Updates
// ============================================================================

// Perfect for long-running operations:
export function FileUpload() {
  const notify = useNotify();
  const { subscribe } = usePushNotificationsContext();

  useEffect(() => {
    const topic = 'upload-progress';

    subscribe(topic, (message) => {
      const { progress, status } = message;

      if (progress === 100) {
        notify.success('Upload Complete', 'Your file has been uploaded');
      } else if (status === 'error') {
        notify.error('Upload Failed', message.error);
      }
      // Don't show intermediate progress notifications to avoid spam
    });
  }, [subscribe, notify]);

  return (
    // Upload form JSX...
  );
}

// ============================================================================
// EXAMPLE 10: Integration with Forms
// ============================================================================

import { useForm } from 'react-hook-form';

export function DeliveryForm() {
  const { handleSubmit, control } = useForm();
  const notify = useNotify();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/deliveries', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to submit');

      const delivery = await response.json();

      notify.success(
        'Delivery Scheduled',
        `Delivery #${delivery.id} has been scheduled for ${delivery.date}`
      );

      // Reset form, navigate, etc.
    } catch (error) {
      notify.error(
        'Submission Failed',
        error instanceof Error ? error.message : 'An error occurred'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields... */}
    </form>
  );
}

// ============================================================================
// USAGE SUMMARY
// ============================================================================

/*
QUICK REFERENCE:

1. USE useNotify() HOOK FOR SIMPLE NOTIFICATIONS:
   - notify.success(title, message)
   - notify.error(title, message)
   - notify.warning(title, message)
   - notify.info(title, message)
   - Works immediately, no need to check connection status

2. USE CONTEXT FOR ADVANCED FEATURES:
   - sendNotification(userId, title, message, type, data)
   - broadcastNotification(userType, title, message, type, data)
   - subscribe(topic, callback)
   - Check isConnected and isRegistered first

3. BEST PLACES TO INTEGRATE:
   - Form submissions → Use useNotify for success/error
   - Order creation → Send notification to warehouse
   - Status updates → Use subscribe for real-time updates
   - User broadcasts → Use broadcastNotification
   - Error handling → Use error type notifications

4. REMEMBER:
   - Notifications auto-dismiss after 5 seconds
   - Users can manually close notifications
   - Browser notifications require permission
   - Always handle errors gracefully
   - Check connection before critical operations
*/
