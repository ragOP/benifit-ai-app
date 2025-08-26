import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { X, CheckCircle, XCircle, Users, AlertTriangle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const CustomNotificationBanner = ({ 
  notification, 
  onDismiss, 
  onPress,
  autoHide = true,
  duration = 6000 
}) => {
  const [slideAnim] = useState(new Animated.Value(-height));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      showNotification();
    }
  }, [notification, showNotification]);

  const showNotification = useCallback(() => {
    setIsVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    if (autoHide) {
      setTimeout(() => {
        hideNotification();
      }, duration);
    }
  }, [slideAnim, autoHide, duration]);

  const hideNotification = useCallback(() => {
    Animated.spring(slideAnim, {
      toValue: -height,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setIsVisible(false);
      onDismiss && onDismiss();
    });
  }, [slideAnim, onDismiss]);

  if (!isVisible || !notification) {
    return null;
  }

  const { totalUsers, successCount, failureCount, results } = notification;

  const getStatusIcon = () => {
    if (failureCount === 0) {
      return <CheckCircle size={20} color="#10B981" />;
    } else if (successCount === 0) {
      return <XCircle size={20} color="#EF4444" />;
    } else {
      return <AlertTriangle size={20} color="#F59E0B" />;
    }
  };

  const getStatusColor = () => {
    if (failureCount === 0) return '#10B981';
    if (successCount === 0) return '#EF4444';
    return '#F59E0B';
  };

  const getStatusText = () => {
    if (failureCount === 0) return 'All Successful';
    if (successCount === 0) return 'All Failed';
    return 'Partial Success';
  };

  const getProgressPercentage = () => {
    if (totalUsers === 0) return 0;
    return (successCount / totalUsers) * 100;
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={getStatusColor()} />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Status Bar Background */}
        <View style={[styles.statusBarBackground, { backgroundColor: getStatusColor() }]} />
        
        {/* Main Notification Content */}
        <View style={[styles.content, { borderTopColor: getStatusColor() }]}>
          {/* Header Row */}
          <View style={styles.header}>
            <View style={styles.statusContainer}>
              {getStatusIcon()}
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={hideNotification}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${getProgressPercentage()}%`,
                    backgroundColor: getStatusColor()
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {successCount}/{totalUsers} completed
            </Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalUsers}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>{successCount}</Text>
              <Text style={styles.statLabel}>Success</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#EF4444' }]}>{failureCount}</Text>
              <Text style={styles.statLabel}>Failed</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: getStatusColor() }]}
            onPress={() => {
              onPress && onPress(notification);
              hideNotification();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>
              {failureCount > 0 ? 'Review Issues' : 'View Details'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  statusBarBackground: {
    height: StatusBar.currentHeight || 0,
  },
  content: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dismissButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e5e7eb',
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomNotificationBanner; 