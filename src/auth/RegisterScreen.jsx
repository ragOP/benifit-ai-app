import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../utils/backendUrl';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    const fetchFcmToken = async () => {
      try {
        const token = await AsyncStorage.getItem('fcmToken');
        if (token) {
          setFcmToken(token);
          console.log('Fetched FCM token from storage:', token);
        } else {
          console.warn('FCM token not found in storage.');
        }
      } catch (error) {
        console.error('Error retrieving FCM token:', error);
      }
    };

    fetchFcmToken();
  }, []);

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/auth/register`,
        // 'http://10.0.2.2:9005/api/v1/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            fcmToken,
          }),
        },
      );
      console.log('paylod', fcmToken);
      const data = await response.json();
      console.log('Register RESPONSE:', data);

      if (response.ok && data.data && data.data.token) {
        const token = data.data.token;
        await AsyncStorage.setItem('userToken', token);
        const savedToken = await AsyncStorage.getItem('userToken');
        console.log('Saved Token:', savedToken);

        navigation.navigate('Home');
      } else {
        Alert.alert('Register Failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error during Register:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.mainHeading}>Create Account</Text>
        <Text style={styles.welcomeText}>Join us</Text>
        <Text style={styles.subText}>Create your account!</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputBox}>
            <Mail size={22} color="#a1a1aa" style={styles.leftIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#a1a1aa"
              value={username}
              onChangeText={setUsername}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <Lock size={22} color="#a1a1aa" style={styles.leftIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#a1a1aa"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.rightIconArea}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            >
              {showPassword ? (
                <Eye size={22} color="#a1a1aa" />
              ) : (
                <EyeOff size={22} color="#a1a1aa" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loginButton}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.9}
            onPress={handleRegister}
          >
            <Text style={styles.loginButtonText}>Create</Text>
          </TouchableOpacity>
        )}

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.registerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  content: {
    flex: 1,
    margin: 20,
    marginTop: 60,
    paddingTop: 50,
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    color: '#999',
    marginBottom: 8,
  },
  subText: {
    fontSize: 24,
    color: '#999',
    marginBottom: 60,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#26262b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333338',
    paddingHorizontal: 12,
    height: 52,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: 2,
  },
  rightIconArea: {
    marginLeft: 2,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  registerText: {
    fontSize: 16,
    color: '#999',
  },
  registerLink: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    height: 60,
  },
  loginButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RegisterScreen;
