import UIKit
import UserNotifications
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

import Firebase
import FirebaseMessaging

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {
  var window: UIWindow?

  // React Native factory (your existing setup)
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  // MARK: - UIApplicationDelegate
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
  ) -> Bool {

    // Firebase
    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }

    // Notification delegates
    UNUserNotificationCenter.current().delegate = self
    Messaging.messaging().delegate = self

    // Ask for notification permission (alert, sound, badge)
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, _ in
      DispatchQueue.main.async {
        // Register with APNs (required to obtain APNs token)
        UIApplication.shared.registerForRemoteNotifications()
      }
      print("🔔 Notification permission granted? \(granted)")
    }

    // --- React Native bootstrap (unchanged) ---
    let delegate = ReactNativeDelegate()
    let factory  = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory  = factory

    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "MyBenifitAiApp",   // << keep your module name
      in: window,
      launchOptions: launchOptions
    )
    // -----------------------------------------

    return true
  }

  // MARK: - APNs registration results
  func application(_ application: UIApplication,
                   didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {

    // Provide APNs token to FCM so FCM can route notifications via APNs
    Messaging.messaging().apnsToken = deviceToken

    // Log APNs hex token (use this in Xcode's Push tester)
    let tokenParts = deviceToken.map { String(format: "%02.2hhx", $0) }
    let apnsHex = tokenParts.joined()
    print("🍏 APNs Device Token (hex): \(apnsHex)")
  }

  func application(_ application: UIApplication,
                   didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("❌ Failed to register for remote notifications: \(error)")
  }

  // MARK: - UNUserNotificationCenterDelegate
  // Show notifications while app is in foreground
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.banner, .list, .sound, .badge])
  }

  // Tapped a notification
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              didReceive response: UNNotificationResponse,
                              withCompletionHandler completionHandler: @escaping () -> Void) {
    // You can forward response.notification.request.content.userInfo to JS if needed
    completionHandler()
  }

  // MARK: - Firebase MessagingDelegate
  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    guard let token = fcmToken else { return }
    print("🔥 FCM Token: \(token)")
    // TODO: send the token to your backend if you need to target this device
  }
}

// Your existing React delegate (unchanged)
class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
      RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
