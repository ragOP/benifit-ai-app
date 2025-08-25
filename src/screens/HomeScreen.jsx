import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import TestimonialSlider from '../component/TestimonialSlider';
import FaqSection from '../component/FAQSection';
import InfinityLoader from '../component/InfinityLoader';

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
      <Svg fill="white" viewBox="0 0 20 20" width={22} height={22}>
        <Path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
          clipRule="evenodd"
        />
      </Svg>
    </View>
    <Text style={styles.checkText}>{text}</Text>
  </View>
);

export default function HomeScreen({ navigation }) {
  const [counter, setCounter] = useState(1200);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const fingerAnimation = useRef(new Animated.Value(0)).current;

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

  const formatNumber = number => `$${number.toFixed(0)}`;
  const handleStartNow = () => {
    if (showLoader) return;
    setShowLoader(true);
    setIsAnimating(false);
    setTimeout(() => {
      setShowLoader(false);
      navigation.navigate('Question');
    }, 1500);
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={require('../assets/center.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        {/* Ribbon */}
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
            Americans, Get Your{'\n'}Benefits Eligibility{'\n'}Check in Just 60
            {'\n'}Seconds!
          </Text>

          <View style={styles.checkList}>
            <CheckRow text="Over 2M+ Americans Helped Till Date." />
            <CheckRow text="Takes Under 2 Minutes" />
            <CheckRow text="90% Of Users Qualify for Benefits $2500+" />
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.cta, showLoader && styles.ctaDisabled]}
            onPress={handleStartNow}
            disabled={showLoader}
          >
            <View
              style={{
                overflow: 'hidden',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
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
          <Text style={styles.claim}>
            <Text style={styles.claimNumber}>69</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    backgroundColor: COLORS.black,
    paddingTop: '10%',
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
    fontSize: 16,
    fontWeight: '600',
  },
  ribbonWrap: {},
  content: {
    paddingHorizontal: 30,
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
    fontSize: 16,
  },
  headline: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 18,
  },
  checkList: {
    marginTop: 6,
    marginBottom: 22,
    gap: 12,
    paddingHorizontal: 20,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center' },
  checkIconWrap: {
    width: 25,
    height: 25,
    borderRadius: 8,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkText: { color: '#1b1f22', fontSize: 16, fontWeight: '700' },
  cta: {
    backgroundColor: '#015d54',
    paddingVertical: 18,
    borderRadius: 42,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '76%',
    alignSelf: 'center',
    marginBottom: 12,
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
    fontSize: 30,
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
});
