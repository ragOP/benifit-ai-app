import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../utils/backendUrl';
import { getAuth, signInWithCredential, GoogleAuthProvider } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/auth/login`,
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
      console.log('Loginpaylod', fcmToken);
      const data = await response.json();
      console.log('LOGIN RESPONSE:', data);

      if (response.ok && data.data && data.data.token) {
        const token = data.data.token;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userName', username);
        console.log('Saved Token:', token);
        console.log('Saved Username:', username);
        navigation.navigate('BottomNavigation');
      } else {
        Alert.alert('Login Failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setGoogleLoading(true);
      
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices();
      
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);
      
      // Sign-in the user with the credential
      const auth = getAuth();
      await signInWithCredential(auth, googleCredential);
      
      console.log('Google sign-in successful');
      // Navigate to main app after successful Google sign-in
      navigation.navigate('BottomNavigation');
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.mainHeading}>Let's Sign you in.</Text>
          <Text style={styles.welcomeText}>Welcome back You've been missed!</Text>
          {/* <Text style={styles.subText}>You've been missed!</Text> */}
        </View>

        <View style={styles.formSection}>
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
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          )}

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={styles.googleButton}
            activeOpacity={0.9}
            onPress={signInWithGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  content: {
    flex: 1,
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingTop: height * 0.08,
    paddingBottom: height * 0.05,
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: height * 0.04,
  },
  formSection: {
    flex: 2,
    justifyContent: 'center',
  },
  mainHeading: {
    fontSize: Math.min(32, width * 0.08),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: Math.min(20, width * 0.06),
    color: '#999',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  subText: {
    fontSize: Math.min(24, width * 0.06),
    color: '#999',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: height * 0.025,
  },
  label: {
    fontSize: Math.min(16, width * 0.04),
    color: 'white',
    marginBottom: height * 0.01,
    fontWeight: '500',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#26262b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333338',
    paddingHorizontal: Math.max(12, width * 0.03),
    height: Math.max(52, height * 0.06),
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
    marginRight: 8,
    paddingVertical: 0,
    fontSize: Math.min(16, width * 0.04),
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
    paddingTop: height * 0.04,
    paddingBottom: height * 0.03,
  },
  registerText: {
    fontSize: Math.min(16, width * 0.04),
    color: '#999',
  },
  registerLink: {
    fontSize: Math.min(16, width * 0.04),
    color: 'white',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: Math.max(18, height * 0.02),
    alignItems: 'center',
    marginTop: height * 0.02,
    justifyContent: 'center',
    height: Math.max(60, height * 0.07),
  },
  loginButtonText: {
    color: 'black',
    fontSize: Math.min(18, width * 0.045),
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    padding: Math.max(18, height * 0.02),
    alignItems: 'center',
    marginTop: height * 0.02,
    justifyContent: 'center',
    height: Math.max(60, height * 0.07),
  },
  googleButtonText: {
    color: '#fff',
    fontSize: Math.min(18, width * 0.045),
    fontWeight: '600',
  },
});

export default LoginScreen;
