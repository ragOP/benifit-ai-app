import NotificationPermissions from '../utils/NotificationPermissions';

export class NotificationService {
  /**
   * Initialize notification service
   */
  static async initialize() {
    try {
      console.log('Initializing notification service...');
      
      // Request notification permission
      const hasPermission = await NotificationPermissions.requestPermissionWithFallback();
      
      if (hasPermission) {
        console.log('✅ Notification service initialized successfully');
        return true;
      } else {
        console.log('❌ Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('❌ Error initializing notification service:', error);
      return false;
    }
  }

  /**
   * Check if notifications are enabled
   */
  static async areNotificationsEnabled() {
    return await NotificationPermissions.checkNotificationPermission();
  }

  /**
   * Get detailed permission status
   */
  static async getPermissionStatus() {
    return await NotificationPermissions.getPermissionStatus();
  }

  /**
   * Request notification permission explicitly
   */
  static async requestPermission() {
    return await NotificationPermissions.requestNotificationPermission();
  }

  /**
   * Test notification permission
   */
  static async testNotificationPermission() {
    try {
      const status = await this.getPermissionStatus();
      console.log('📱 Notification Permission Status:', status);
      
      if (status.granted) {
        console.log('✅ Notifications are enabled');
        return true;
      } else {
        console.log('❌ Notifications are disabled');
        console.log('📋 Status:', status.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error testing notification permission:', error);
      return false;
    }
  }

  /**
   * Show a test notification (placeholder for now)
   */
  static async showTestNotification() {
    try {
      const hasPermission = await this.areNotificationsEnabled();
      
      if (!hasPermission) {
        console.log('❌ Cannot show notification: permission not granted');
        return false;
      }

      // For now, we'll just log the notification
      // Later you can integrate with actual notification libraries
      console.log('🔔 Test Notification Sent!');
      console.log('📱 Title: Benefits Update');
      console.log('📝 Body: You have new benefits available!');
      
      return true;
    } catch (error) {
      console.error('❌ Error showing test notification:', error);
      return false;
    }
  }
}

export default NotificationService; 