/**
 * PubSub JavaScript SDK
 * A lightweight SDK for integrating pub/sub messaging in frontend applications
 * 
 * @version 1.0.0
 * @author Chathura Priyashan
 */

class PubSubSDK {
  /**
   * Initialize the PubSub SDK
   * 
   * @param {string} userId - Unique user identifier
   * @param {string} userType - Type of user: 'driver', 'client', or 'warehouse'
   * @param {Object} options - Configuration options
   * @param {string} options.serverUrl - WebSocket server URL (default: ws://localhost:3008)
   * @param {boolean} options.autoConnect - Auto connect on initialization (default: true)
   * @param {number} options.reconnectInterval - Reconnection interval in ms (default: 3000)
   * @param {number} options.heartbeatInterval - Heartbeat interval in ms (default: 30000)
   */
  constructor(userId, userType, options = {}) {
    this.userId = userId;
    this.userType = userType;
    this.serverUrl = options.serverUrl || 'ws://localhost:3008';
    this.autoConnect = options.autoConnect !== false;
    this.reconnectInterval = options.reconnectInterval || 3000;
    this.heartbeatInterval = options.heartbeatInterval || 30000;

    this.ws = null;
    this.isConnected = false;
    this.isRegistered = false;
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
    this.eventHandlers = {
      connect: [],
      disconnect: [],
      error: [],
      message: []
    };
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.heartbeatTimer = null;

    if (this.autoConnect) {
      this.connect();
    }
  }

  /**
   * Connect to the PubSub server
   * @returns {Promise<void>}
   */
  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.serverUrl);

        this.ws.onopen = () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this._emit('connect', { userId: this.userId, userType: this.userType });
          
          // Auto register if not already registered
          if (!this.isRegistered) {
            this.register().then(() => resolve()).catch(reject);
          } else {
            resolve();
          }

          // Start heartbeat
          this._startHeartbeat();
        };

        this.ws.onmessage = (event) => {
          this._handleMessage(JSON.parse(event.data));
        };

        this.ws.onerror = (error) => {
          this._emit('error', { message: 'WebSocket error', error });
          reject(error);
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this._stopHeartbeat();
          this._emit('disconnect', { userId: this.userId });
          this._attemptReconnect();
        };
      } catch (error) {
        this._emit('error', { message: 'Connection failed', error });
        reject(error);
      }
    });
  }

  /**
   * Disconnect from the server
   * @returns {Promise<void>}
   */
  async disconnect() {
    this._stopHeartbeat();
    if (this.ws) {
      this.ws.close();
    }
    this.isConnected = false;
  }

  /**
   * Register the user with the server
   * @returns {Promise<boolean>}
   */
  register() {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('Not connected to server'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Registration timeout'));
      }, 5000);

      const handler = (message) => {
        if (message.type === 'registered' && message.userId === this.userId) {
          clearTimeout(timeout);
          this.messageHandlers.delete('register');
          this.isRegistered = true;
          resolve(true);
        }
      };

      this.messageHandlers.set('register', handler);

      this._send({
        type: 'register',
        userId: this.userId,
        userType: this.userType
      });
    });
  }

  /**
   * Publish a message to a topic
   * 
   * @param {string} topic - Topic name
   * @param {Object} data - Message data
   * @returns {Promise<boolean>}
   * 
   * @example
   * await sdk.publish('delivery-updates', {
   *   status: 'Package picked up',
   *   location: 'Warehouse A'
   * });
   */
  async publish(topic, data) {
    if (!this.isConnected || !this.isRegistered) {
      throw new Error('Not connected or registered');
    }

    if (!topic) {
      throw new Error('Topic is required');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Publish timeout'));
      }, 5000);

      const handler = (message) => {
        if (message.type === 'published' && message.topic === topic) {
          clearTimeout(timeout);
          this.messageHandlers.delete(`publish:${topic}`);
          resolve(message.message === 'Message published successfully');
        }
      };

      this.messageHandlers.set(`publish:${topic}`, handler);

      this._send({
        type: 'publish',
        userId: this.userId,
        topic,
        data
      });
    });
  }

  /**
   * Subscribe to a topic
   * 
   * @param {string} topic - Topic name
   * @param {Function} callback - Callback function for received messages
   * @returns {Promise<boolean>}
   * 
   * @example
   * await sdk.subscribe('delivery-updates', (message) => {
   *   console.log('New delivery update:', message);
   * });
   */
  async subscribe(topic, callback) {
    if (!this.isConnected || !this.isRegistered) {
      throw new Error('Not connected or registered');
    }

    if (!topic) {
      throw new Error('Topic is required');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Subscribe timeout'));
      }, 5000);

      const handler = (message) => {
        if (message.type === 'subscribed' && message.topic === topic) {
          clearTimeout(timeout);
          this.messageHandlers.delete(`subscribe:${topic}`);
          resolve(true);
        }
      };

      this.messageHandlers.set(`subscribe:${topic}`, handler);

      // Store callback for notifications
      if (callback && typeof callback === 'function') {
        this.subscriptions.set(topic, callback);
      }

      this._send({
        type: 'subscribe',
        userId: this.userId,
        topic
      });
    });
  }

  /**
   * Unsubscribe from a topic
   * 
   * @param {string} topic - Topic name
   * @returns {Promise<boolean>}
   * 
   * @example
   * await sdk.unsubscribe('delivery-updates');
   */
  async unsubscribe(topic) {
    if (!this.isConnected || !this.isRegistered) {
      throw new Error('Not connected or registered');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Unsubscribe timeout'));
      }, 5000);

      const handler = (message) => {
        if (message.type === 'unsubscribed' && message.topic === topic) {
          clearTimeout(timeout);
          this.messageHandlers.delete(`unsubscribe:${topic}`);
          resolve(true);
        }
      };

      this.messageHandlers.set(`unsubscribe:${topic}`, handler);
      this.subscriptions.delete(topic);

      this._send({
        type: 'unsubscribe',
        userId: this.userId,
        topic
      });
    });
  }

  /**
   * Get server status and statistics
   * 
   * @returns {Promise<Object>} Server status object
   * 
   * @example
   * const status = await sdk.getStatus();
   * console.log(status.registryStats.totalUsers);
   */
  async getStatus() {
    if (!this.isConnected) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Status request timeout'));
      }, 5000);

      const handler = (message) => {
        if (message.type === 'status') {
          clearTimeout(timeout);
          this.messageHandlers.delete('status');
          resolve(message);
        }
      };

      this.messageHandlers.set('status', handler);
      this._send({ type: 'status' });
    });
  }

  /**
   * Get all registered users
   * 
   * @returns {Promise<Array>} Array of user objects
   * 
   * @example
   * const users = await sdk.getUsers();
   * const drivers = users.filter(u => u.userType === 'driver');
   */
  async getUsers() {
    if (!this.isConnected) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Users request timeout'));
      }, 5000);

      const handler = (message) => {
        if (message.type === 'users') {
          clearTimeout(timeout);
          this.messageHandlers.delete('users');
          resolve(message.users);
        }
      };

      this.messageHandlers.set('users', handler);
      this._send({ type: 'users' });
    });
  }

  /**
   * Register an event listener
   * 
   * @param {string} event - Event name: 'connect', 'disconnect', 'error', 'message'
   * @param {Function} callback - Callback function
   * 
   * @example
   * sdk.on('connect', () => console.log('Connected!'));
   * sdk.on('message', (msg) => console.log('Message:', msg));
   * sdk.on('error', (err) => console.error('Error:', err));
   */
  on(event, callback) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(callback);
  }

  /**
   * Remove an event listener
   * 
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (!this.eventHandlers[event]) return;
    const index = this.eventHandlers[event].indexOf(callback);
    if (index > -1) {
      this.eventHandlers[event].splice(index, 1);
    }
  }

  /**
   * Get subscription list
   * 
   * @returns {Array<string>} Array of subscribed topics
   */
  getSubscriptions() {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * Get connection status
   * 
   * @returns {Object} Connection status object
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isRegistered: this.isRegistered,
      userId: this.userId,
      userType: this.userType,
      subscriptions: this.getSubscriptions(),
      reconnectAttempts: this.reconnectAttempts
    };
  }

  /**
   * Check if user is subscribed to a topic
   * 
   * @param {string} topic - Topic name
   * @returns {boolean}
   */
  isSubscribed(topic) {
    return this.subscriptions.has(topic);
  }

  // ==================== Private Methods ====================

  /**
   * @private
   */
  _send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this._emit('error', {
        message: 'Cannot send message - not connected',
        reason: 'WebSocket is not open'
      });
    }
  }

  /**
   * @private
   */
  _handleMessage(message) {
    const { type, topic } = message;

    // Check if there's a specific handler for this message
    let handled = false;

    // Try topic-specific handlers
    if (type === 'subscribed' && this.messageHandlers.has(`subscribe:${topic}`)) {
      this.messageHandlers.get(`subscribe:${topic}`)(message);
      handled = true;
    }

    // Try type+topic handlers
    const typeHandlerKey = `${type}:${topic}`;
    if (this.messageHandlers.has(typeHandlerKey)) {
      this.messageHandlers.get(typeHandlerKey)(message);
      handled = true;
    }

    // Try general type handlers
    if (this.messageHandlers.has(type)) {
      this.messageHandlers.get(type)(message);
      handled = true;
    }

    // Handle notifications (messages from other users)
    if (type === 'notification' && this.subscriptions.has(topic)) {
      const callback = this.subscriptions.get(topic);
      if (callback && typeof callback === 'function') {
        callback({
          topic,
          from: message.from,
          fromType: message.fromType,
          message: message.message,
          timestamp: message.timestamp
        });
        handled = true;
      }
    }

    // Emit general message event
    this._emit('message', message);

    // Log unhandled messages
    if (!handled && type !== 'published' && type !== 'unsubscribed') {
      console.warn('Unhandled message:', message);
    }
  }

  /**
   * @private
   */
  _emit(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }

  /**
   * @private
   */
  _attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        this.connect().catch(err => {
          console.error('Reconnection failed:', err.message);
        });
      }, this.reconnectInterval);
    } else {
      this._emit('error', {
        message: 'Max reconnection attempts reached',
        attempts: this.maxReconnectAttempts
      });
    }
  }

  /**
   * @private
   */
  _startHeartbeat() {
    this._stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected && this.ws) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, this.heartbeatInterval);
  }

  /**
   * @private
   */
  _stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PubSubSDK;
}
