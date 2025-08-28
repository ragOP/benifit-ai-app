import React from 'react';
import { Snackbar } from 'react-native-paper';

export const Toast = ({ 
  visible, 
  message, 
  type = 'success', 
  onDismiss, 
  duration = 3000 
}) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      style={{
        backgroundColor: type === 'success' ? '#4CAF50' : '#F44336',
      }}
      wrapperStyle={{
        top: 0,
        position: 'absolute',
      }}
      action={{
        label: 'Dismiss',
        onPress: onDismiss,
      }}>
      {message}
    </Snackbar>
  );
}; 