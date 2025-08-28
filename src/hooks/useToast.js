import { useState } from 'react';

export const useToast = () => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const hideToast = () => setToastVisible(false);

  const showSuccessToast = (message) => showToast(message, 'success');
  const showErrorToast = (message) => showToast(message, 'error');

  return {
    toastVisible,
    toastMessage,
    toastType,
    showToast,
    hideToast,
    showSuccessToast,
    showErrorToast,
  };
}; 