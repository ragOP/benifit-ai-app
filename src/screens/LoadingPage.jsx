import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

export default function LoadingPage({navigation, route}) {
  const {
    fullName,
    tags,
    userId,
  } = route.params;
  const [progress, setProgress] = useState(5);
  const [statusText, setStatusText] = useState('Reviewing your answer');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 40;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigation.navigate('Congrats', {
              fullName: fullName,
              tags: tags,
              userId,
            });
          }, 2000);
          return 100;
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setStatusText('Confirming your eligibility');
    } else if (progress >= 66) {
      setStatusText('Matching best option for you');
    } else {
      setStatusText('Reviewing your answer');
    }
  }, [progress]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AnimatedCircularProgress
        size={200}
        width={12}
        fill={progress}
        tintColor="#F6C15B"
        backgroundColor="#2C2C2C"
        rotation={0}
        lineCap="round">
        {fill => <Text style={styles.percentage}>{Math.round(fill)}%</Text>}
      </AnimatedCircularProgress>
      <Text style={styles.statusText}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusText: {
    marginTop: 30,
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});