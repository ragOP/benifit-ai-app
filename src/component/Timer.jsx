import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Timer = () => {
  const [secondsLeft, setSecondsLeft] = useState(5 * 60); // 5 minutes in seconds

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60).toString().padStart(2, '0');
    const seconds = (secs % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default Timer;
