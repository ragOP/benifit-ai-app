import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../utils/backendUrl';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TestimonialSlider from '../component/TestimonialSlider';
import FaqSection from '../component/FAQSection';
import InfinityLoader from '../component/InfinityLoader';
import NotificationService from '../services/NotificationService';

const { width } = Dimensions.get('window');

const COLORS = {
  black: '#000000',
  dark: '#0c1a17',
  bg: '#f6f7f2',
  white: '#ffffff',
  teal: '#015d54',
  tealDark: '#0a6a5c',
  text: '#121517',
  sub: '#6b7a78',
  pill: '#0f0f10',
  checkBg: '#e7f4f1',
  checkIcon: '#0c7a6a',
  claim: '#2fbfa6',
};

const CheckRow = ({ text }) => (
  <View style={styles.checkRow}>
    <View style={styles.checkIconWrap}>
      <Icon name="check" size={18} color="white" />
    </View>
    <Text style={styles.checkText}>{text}</Text>
  </View>
);

export default function HomeScreen({ navigation }) {
  const [counter, setCounter] = useState(1200);
  const [claimingCounter, setClaimingCounter] = useState(69);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  // const [redirectTimer, setRedirectTimer] = useState(5);
  // const [isCheckingUser, setIsCheckingUser] = useState(false);
  // const [hasCompletedFlow, setHasCompletedFlow] = useState(false);
  const fingerAnimation = useRef(new Animated.Value(0)).current;
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval;
    if (isAnimating) {
      interval = setInterval(() => {
        setCounter(prev => {
          if (prev + 90 <= 2500) {
            return prev + 90;
          } else {
            clearInterval(interval);
            return 2500;
          }
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  // Load claiming counter from async storage on mount
  useEffect(() => {
    const loadClaimingCounter = async () => {
      try {
        const stored = await AsyncStorage.getItem('claimingCounter');
        if (stored) {
          const count = parseInt(stored, 10);
          // Ensure the stored value is within 69-90 range
          const validCount = Math.max(69, Math.min(90, count));
          setClaimingCounter(validCount);
          if (validCount !== count) {
            await AsyncStorage.setItem('claimingCounter', validCount.toString());
          }
        } else {
          // Start with 80 if no stored value (middle of 69-90 range)
          setClaimingCounter(80);
          await AsyncStorage.setItem('claimingCounter', '80');
        }
      } catch (error) {
        console.error('Error loading claiming counter:', error);
        setClaimingCounter(80);
      }
    };
    
    loadClaimingCounter();
  }, []);



  // Dynamic claiming counter that increases slowly and randomly
  useEffect(() => {
    if (claimingCounter === 0) return; // Don't start until loaded
    
    const claimingInterval = setInterval(() => {
      setClaimingCounter(prev => {
        let newCount;
        
        // If we're at the upper limit, gradually decrease instead of random jump
        if (prev >= 87) {
          // Decrease by 1-2 to bring it back down naturally
          const decrement = Math.floor(Math.random() * 2) + 1;
          newCount = Math.max(69, prev - decrement);
        } else {
          // Normal increment between 1-3
          const increment = Math.floor(Math.random() * 3) + 1;
          newCount = Math.min(90, prev + increment);
        }
        
        // Save to async storage
        AsyncStorage.setItem('claimingCounter', newCount.toString()).catch(console.error);
        
        return newCount;
      });
    }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds

    return () => clearInterval(claimingInterval);
  }, [claimingCounter]);

  useEffect(() => {
    const initNotifications = async () => {
      await NotificationService.initialize();
    };
    initNotifications();
  }, []);

  // useEffect(() => {
  //   const checkStoredUserFlow = async () => {
  //     try {
  //       const storedUserFlow = await AsyncStorage.getItem('userFlowCompleted');
  //       console.log("storedUserFlow >>>", storedUserFlow)
  //       if (storedUserFlow) {
  //         const userData = JSON.parse(storedUserFlow);
  //         if (userData.success && userData.data && userData.data.userId) {
  //           setHasCompletedFlow(true);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error checking stored user flow:', error);
  //     }
  //   };

  //   checkStoredUserFlow();
  // }, []);

  useEffect(() => {
    const moveFinger = () => {
      Animated.sequence([
        Animated.timing(fingerAnimation, {
          toValue: 10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fingerAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => moveFinger());
    };
    moveFinger();
  }, [fingerAnimation]);

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };
    shimmer();
  }, [shimmerAnimation]);

  const formatNumber = number => `$${number.toFixed(0)}`;
  const checkUserFlow = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      // if (!userId) {
      //   // No userId, start new flow
      //   setShowLoader(true);
      //   setIsAnimating(false);
      //   setTimeout(() => {
      //     setShowLoader(false);
      //     navigation.navigate('Question');
      //   }, 1500);
      //   return;
      // }

      setShowLoader(true);
      setIsAnimating(false);
      setTimeout(() => {
        setShowLoader(false);
        navigation.navigate('Question');
      }, 1500);

      // User has userId, check if they've completed the flow
      // setIsCheckingUser(true);
      // const response = await fetch(
      //   `${BACKEND_URL}/api/v1/users/qualified-user?userId=${userId}`,
      //   {
      //     method: 'GET',
      //     headers: { 'Content-Type': 'application/json' },
      //   }
      // );

      // const data = await response.json();


      // // if (data.success && data.data && data.data.userId) {
      //   if (data.success && data.data && data.data.userId) {
      //   // User has completed the flow - store in AsyncStorage
      //   await AsyncStorage.setItem('userFlowCompleted', JSON.stringify(data));
      //   // setHasCompletedFlow(true);
      //   setShowCongratulations(true);
      //   // setIsCheckingUser(false);

      //   // Start countdown timer - 5 seconds
      //   let timer = 5;
      //   // setRedirectTimer(timer);

      //   const countdown = setInterval(() => {
      //     timer -= 1;
      //     // setRedirectTimer(timer);

      //     if (timer <= 0) {
      //       clearInterval(countdown);
      //       // Reset navigation stack to ensure fresh state
      //       navigation.reset({
      //         index: 0,
      //         routes: [
      //           { name: 'BottomNavigation', params: { initialTab: 1 } }
      //         ],
      //       });
      //     }
      //   }, 1000);
      // } else {
      //   // User doesn't exist or hasn't completed flow, start new flow
      //   setShowLoader(true);
      //   setIsAnimating(false);
      //   setTimeout(() => {
      //     setShowLoader(false);
      //     navigation.navigate('Question');
      //   }, 1500);
      // }
    } catch (error) {
      console.error('Error checking user flow:', error);
      // On error, start new flow
      // setShowLoader(true);
      // setIsAnimating(false);
      // setTimeout(() => {
      //   setShowLoader(false);
      //   navigation.navigate('Question');
      // }, 1500);
    } finally {
      // setIsCheckingUser(false);
    }
  };

  const handleStartNow = () => {
    // if (showLoader || isCheckingUser) return;
    checkUserFlow();
  };

  const handleGoToOffers = () => {
    // Reset navigation stack to ensure fresh state
    navigation.reset({
      index: 0,
      routes: [
        { name: 'BottomNavigation', params: { initialTab: 1 } }
      ],
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={require('../assets/center.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.ribbonWrap}>
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>
              22,578 Americans Helped In Last 24 Hours!
            </Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>AVERAGE BENEFITS: </Text>
            <Text style={styles.pillText}>{formatNumber(counter)} </Text>
            <Text style={styles.pillText}>+</Text>
          </View>

          <Text style={styles.headline}>
            Americans, Get Your Benefits Eligibility Check in Just 60 Seconds!
          </Text>

          <View style={styles.checkList}>
            <CheckRow text="Over 2M+ Americans Helped Till Date." />
            <CheckRow text="Takes Under 2 Minutes" />
            <CheckRow text="90% Of Users Qualify for Benefits $2500+" />
          </View>

          <View style={styles.ctaContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.cta, showLoader && styles.ctaDisabled]}
              onPress={handleStartNow}
              disabled={showLoader}
            >
              <Animated.View
                style={[
                  styles.shimmer,
                  {
                    transform: [
                      {
                        translateX: shimmerAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-width, width],
                        }),
                      },
                      { rotate: '13deg' },
                    ],
                  },
                ]}
              />

              <View
                style={{
                  overflow: 'hidden',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showLoader ? (
                    <View style={styles.loaderRow}>
                      <InfinityLoader />
                    </View>
                  ) : (
                    <>
                      {/* <Animated.View
                        style={{ transform: [{ translateX: fingerAnimation }] }}
                      >
                        <Text style={styles.ctaText}>👉 </Text>
                      </Animated.View> */}
                      <Text style={styles.ctaText}>START NOW</Text>
                      <ChevronRight size={24} color="#fff" />
                    </>
                  )}
                </View>
              </View>
            </TouchableOpacity>
            {/* {hasCompletedFlow ? (
              <>
                <Text style={styles.alreadyCompletedText}>
                  You have already filled out the form! 🎉
                </Text>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.cta, styles.ctaOffers]}
                  onPress={handleGoToOffers}
                >
                  <Text style={styles.ctaText}>GO TO OFFERS</Text>
                  <ChevronRight size={24} color="#fff" />
                </TouchableOpacity>

              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.cta, showLoader && styles.ctaDisabled]}
                onPress={handleStartNow}
                disabled={showLoader}
              >
                <Animated.View
                  style={[
                    styles.shimmer,
                    {
                      transform: [
                        {
                          translateX: shimmerAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-width, width],
                          }),
                        },
                      ],
                    },
                  ]}
                />

                <View
                  style={{
                    overflow: 'hidden',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {showLoader ? (
                      <View style={styles.loaderRow}>
                        <InfinityLoader />
                      </View>
                    ) : (
                      <>
                        <Animated.View
                          style={{ transform: [{ translateX: fingerAnimation }] }}
                        >
                          <Text style={styles.ctaText}>👉 </Text>
                        </Animated.View>
                        <Text style={styles.ctaText}>START NOW</Text>
                        <ChevronRight size={24} color="#fff" />
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )} */}
          </View>

          <Text style={styles.claim}>
            <Text style={styles.claimNumber}>{claimingCounter}</Text>
            <Text style={styles.claimBold}>
              {' '}
              People Are <Text style={styles.claimNumber}>Claiming</Text> Right
              Now!
            </Text>
          </Text>
        </View>

        <TestimonialSlider />

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
        </View>
        <FaqSection />
      </ScrollView>

      {/* Congratulations Overlay */}
      {showCongratulations && (
        <View style={styles.congratulationsOverlay}>
          <View style={styles.congratulationsCard}>
            <Text style={styles.congratulationsEmoji}>🎉</Text>
            <Text style={styles.congratulationsTitle}>Congratulations!</Text>
            <Text style={styles.congratulationsSubtitle}>
              You have already submitted your information!
            </Text>
            <Text style={styles.redirectText}>
              Redirecting to offers section in 5 seconds...
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: '100%' }
                ]}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    backgroundColor: COLORS.black,
    paddingTop: 0,
  },
  logo: {
    width: 'auto',
    height: 60,
    marginRight: 10,
  },
  ribbon: {
    backgroundColor: COLORS.teal,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  ribbonText: {
    color: COLORS.white,
    letterSpacing: 0.3,
    fontStyle: 'italic',
    fontSize: 12,
    fontWeight: '600',
  },
  ribbonWrap: {},
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  pill: {
    backgroundColor: COLORS.pill,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 24,
    marginBottom: 16,
    flexDirection: 'row',
  },
  pillText: {
    color: COLORS.white,
    fontWeight: '800',
    letterSpacing: 0.4,
    fontSize: 13, 
  },
  headline: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 18,
  },
  checkList: {
    marginTop: 6,
    marginBottom: 22,
    gap: 12,
    // paddingHorizontal: 4,
  },
  checkRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  checkIconWrap: {
    width: 25,
    height: 25,
    borderRadius: 8,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkText: { 
    color: '#1b1f22', 
    fontSize: 16, 
    fontWeight: '700',
    flex: 1,
    flexWrap: 'wrap'
  },
  ctaContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 12,
  },
  cta: {
    backgroundColor: '#015d54',
    paddingVertical: 18,
    borderRadius: 42,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '76%',
    alignSelf: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '5%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
    zIndex: 0,
  },
  ctaText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 0.5,
    marginRight: 10,
  },
  claim: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
    color: '#2f3a39',
    fontSize: 14,
    fontStyle: 'italic',
    paddingInlineEnd: 20,
  },
  claimNumber: { color: COLORS.teal, fontWeight: '900' },
  claimBold: {
    color: '#121517',
  },
  faqSection: {
    marginTop: 10,
    alignItems: 'center',
    padding: 20,
  },
  faqTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.teal,
    textAlign: 'center',
  },
  ctaDisabled: {
    backgroundColor: 'transparent',
    opacity: 1,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testNotificationButton: {
    backgroundColor: '#0F766E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  testNotificationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  congratulationsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  congratulationsCard: {
    backgroundColor: COLORS.white,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  congratulationsEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  congratulationsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.teal,
    textAlign: 'center',
    marginBottom: 12,
  },
  congratulationsSubtitle: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  redirectText: {
    fontSize: 16,
    color: COLORS.sub,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.teal,
    borderRadius: 4,
  },
  alreadyCompletedText: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '600',
    color: COLORS.teal,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  ctaOffers: {
    backgroundColor: COLORS.tealDark,
  },
});
