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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../utils/backendUrl';
import { useToast } from '../hooks/useToast';
import { Toast } from '../component/Toast';
// import { getAuth, signInWithCredential, GoogleAuthProvider } from '@react-native-firebase/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

const LoginScreen = ({ navigation }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Use the custom toast hook
  const {
    toastVisible,
    toastMessage,
    toastType,
    showSuccessToast,
    showErrorToast,
    hideToast,
  } = useToast();

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
    if (!emailOrUsername || !password) {
      showErrorToast('Please enter both email/username and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: emailOrUsername,
          password,
          fcmToken,
        }),
      });
      console.log('PAYLOAD', {
        loginId: emailOrUsername,
        password,
        fcmToken,
      });
      const data = await response.json();
      console.log('LOGIN RESPONSE:', data);

      if (response.ok && data.data && data.data.token) {
        console.log('Login successful! Welcome back!');
        const token = data?.data?.token;
        const userId = data?.data?._id;
        const conversationId = data?.data?.conversationId;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userName', emailOrUsername);
        await AsyncStorage.setItem('userId', userId);
        if (conversationId !== null) {
          console.log('Saved ConversationId:', conversationId);
          await AsyncStorage.setItem('conversationId', conversationId);
        }
        console.log('Saved Token:', token);
        console.log('Saved Username:', emailOrUsername);
        console.log('Saved UserId:', userId);
        console.log('Saved ConversationId:', conversationId);
        showSuccessToast('Login successful! Welcome back!');
        setTimeout(() => {
          navigation.navigate('BottomNavigation');
        }, 1500);
      } else {
        showErrorToast(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      showErrorToast('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // const signInWithGoogle = async () => {
  //   try {
  //     setGoogleLoading(true);

  //     // Check if your device supports Google Play
  //     await GoogleSignin.hasPlayServices();

  //     // Get the users ID token
  //     const { idToken } = await GoogleSignin.signIn();

  //     // Create a Google credential with the token
  //     const googleCredential = GoogleAuthProvider.credential(idToken);

  //     // Sign-in the user with the credential
  //     const auth = getAuth();
  //     await signInWithCredential(auth, googleCredential);

  //     console.log('Google sign-in successful');
  //     // Navigate to main app after successful Google sign-in
  //     navigation.navigate('BottomNavigation');

  //   } catch (error) {
  //     console.error('Google sign-in error:', error);
  //     Alert.alert('Error', 'Google sign-in failed. Please try again.');
  //   } finally {
  //     setGoogleLoading(false);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.mainHeading}>Let's Sign you in.</Text>
              <Text style={styles.welcomeText}>
                Welcome back You've been missed!
              </Text>
              {/* <Text style={styles.subText}>You've been missed!</Text> */}
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email / Username</Text>
                <View style={styles.inputBox}>
                  <Mail size={22} color="#a1a1aa" style={styles.leftIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email or username"
                    placeholderTextColor="#a1a1aa"
                    value={emailOrUsername}
                    onChangeText={setEmailOrUsername}
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
              {/* <TouchableOpacity
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
              </TouchableOpacity> */}
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => {
                  console.log('Register button pressed');
                  console.log('Navigation object:', navigation);
                  try {
                    navigation.navigate('Register');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    Alert.alert(
                      'Error',
                      'Navigation failed. Please try again.',
                    );
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Toast Notification */}
      <Toast
        visible={toastVisible}
        onDismiss={hideToast}
        message={toastMessage}
        type={toastType}
      />
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingTop: height * 0.08,
    paddingBottom: height * 0.05,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    paddingBottom: height * 0.04,
    marginTop: height * 0.05,
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: height * 0.02,
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
    marginTop: 'auto',
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
