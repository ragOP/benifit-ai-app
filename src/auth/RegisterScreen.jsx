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
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../utils/backendUrl';
import { useToast } from '../hooks/useToast';
import { Toast } from '../component/Toast';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');

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

  const handleRegister = async () => {
    if (!email || !username || !password) {
      showErrorToast('Please enter email, username and password');
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
            email,
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
        const userId = data.data._id;
        const conversationId = data.data.conversationId;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userName', username);
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userId', userId);
        if (conversationId !== null) {
          console.log('Saved ConversationId:', conversationId);
          await AsyncStorage.setItem('conversationId', conversationId);
        }
        console.log('Saved Username:', username);
        console.log('Saved Email:', email);
        const savedToken = await AsyncStorage.getItem('userToken');
        console.log('Saved Token:', savedToken);
        console.log('Saved UserId', userId);
        console.log('Saved ConversationId', conversationId);

        showSuccessToast('Account created successfully! Welcome!');
        setTimeout(() => {
          navigation.navigate('BottomNavigation');
        }, 1500);
      } else {
        showErrorToast(
          data.message || 'Registration failed. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error during Register:', error);
      showErrorToast('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <Text style={styles.mainHeading}>Create Account</Text>
            <Text style={styles.welcomeText}>Join us create your account!</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputBox}>
                <Mail size={22} color="#a1a1aa" style={styles.leftIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#a1a1aa"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputBox}>
                <User size={22} color="#a1a1aa" style={styles.leftIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#a1a1aa"
                  value={username}
                  onChangeText={setUsername}
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
    alignItems: 'center',
    paddingBottom: 50, // Add some padding at the bottom for the register text
  },
  content: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    paddingBottom: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 20,
    color: '#999',
    paddingBottom: 40,
    textAlign: 'center',
  },
  subText: {
    fontSize: 24,
    color: '#999',
    marginBottom: 60,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
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
    paddingTop: 20,
    marginTop: 'auto',
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
    width: '100%',
  },
  loginButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RegisterScreen;
