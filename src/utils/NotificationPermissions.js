// import { Platform } from 'react-native';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// export class NotificationPermissions {
//   /**
//    * Get the appropriate notification permission for the platform
//    */
//   static getNotificationPermission() {
//     if (Platform.OS === 'android') {
//       if (Platform.Version >= 33) {
//         return PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
//       } else {
//         // Android 12 and below - permission is automatically granted
//         return null;
//       }
//     } else if (Platform.OS === 'ios') {
//       return PERMISSIONS.IOS.NOTIFICATIONS;
//     }
//     return null;
//   }

//   /**
//    * Check if notification permission is granted
//    */
//   static async checkNotificationPermission() {
//     try {
//       const permission = this.getNotificationPermission();
      
//       if (!permission) {
//         // For Android < 13, permission is always granted
//         return true;
//       }

//       const result = await check(permission);
      
//       switch (result) {
//         case RESULTS.UNAVAILABLE:
//           console.log('This feature is not available on this device');
//           return false;
//         case RESULTS.DENIED:
//           console.log('Permission denied');
//           return false;
//         case RESULTS.LIMITED:
//           console.log('Permission limited');
//           return true;
//         case RESULTS.GRANTED:
//           console.log('Permission granted');
//           return true;
//         case RESULTS.BLOCKED:
//           console.log('Permission blocked');
//           return false;
//         default:
//           return false;
//       }
//     } catch (error) {
//       console.error('Error checking notification permission:', error);
//       return false;
//     }
//   }

//   /**
//    * Request notification permission
//    */
//   static async requestNotificationPermission() {
//     try {
//       const permission = this.getNotificationPermission();
      
//       if (!permission) {
//         // For Android < 13, permission is always granted
//         return true;
//       }

//       const result = await request(permission);
      
//       switch (result) {
//         case RESULTS.UNAVAILABLE:
//           console.log('This feature is not available on this device');
//           return false;
//         case RESULTS.DENIED:
//           console.log('Permission denied');
//           return false;
//         case RESULTS.LIMITED:
//           console.log('Permission limited');
//           return true;
//         case RESULTS.GRANTED:
//           console.log('Permission granted');
//           return true;
//         case RESULTS.BLOCKED:
//           console.log('Permission blocked');
//           return false;
//         default:
//           return false;
//       }
//     } catch (error) {
//       console.error('Error requesting notification permission:', error);
//       return false;
//     }
//   }

//   /**
//    * Request permission with proper error handling and user guidance
//    */
//   static async requestPermissionWithFallback() {
//     try {
//       // First check if we already have permission
//       const hasPermission = await this.checkNotificationPermission();
      
//       if (hasPermission) {
//         return true;
//       }

//       // Request permission
//       const granted = await this.requestNotificationPermission();
      
//       if (!granted) {
//         // Show explanation and guide user to settings
//         this.showPermissionExplanation();
//       }

//       return granted;
//     } catch (error) {
//       console.error('Error in requestPermissionWithFallback:', error);
//       return false;
//     }
//   }

//   /**
//    * Get detailed permission status
//    */
//   static async getPermissionStatus() {
//     try {
//       const permission = this.getNotificationPermission();
      
//       if (!permission) {
//         return {
//           granted: true,
//           platform: Platform.OS,
//           androidVersion: Platform.Version,
//           permission: 'AUTO_GRANTED'
//         };
//       }

//       const result = await check(permission);
      
//       return {
//         granted: result === RESULTS.GRANTED || result === RESULTS.LIMITED,
//         status: result,
//         platform: Platform.OS,
//         androidVersion: Platform.Version,
//         permission: permission
//       };
//     } catch (error) {
//       console.error('Error getting permission status:', error);
//       return {
//         granted: false,
//         error: error.message,
//         platform: Platform.OS,
//         androidVersion: Platform.Version
//       };
//     }
//   }

//   /**
//    * Show permission explanation dialog
//    */
//   static showPermissionExplanation() {
//     // You can implement a custom alert or use a library like react-native-alert
//     console.log('Notification permission is required for this app to function properly.');
//     console.log('Please enable notifications in your device settings.');
//   }
// }

// export default NotificationPermissions; 