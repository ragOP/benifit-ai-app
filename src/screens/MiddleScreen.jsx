import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TestimonialSlider from '../component/TestimonialSlider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Timer from '../component/Timer';

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
  greenLight: '#c3e7cf',
  green: '#10b981',
  blue1: '#4774c9',
  blue2: '#294ea0',
  ribbon: '#015d54',
};

const PRICE_BY_TAG = {
  is_md: 1000,
  is_ssdi: 2500,
  is_auto: 900,
  is_mva: 5500,
  is_debt: 6500,
  is_rvm: 5500,
};

const roundToThousands = n => Math.floor((Number(n) || 0) / 1000) * 1000;

const MiddleScreen = ({ route, navigation }) => {
  const { fullName, tags = [], userId } = route.params || {};
  const total = tags.reduce((sum, tag) => sum + (PRICE_BY_TAG[tag] || 0), 0);
  const roundedTotal = roundToThousands(total);

  const [secondsLeft, setSecondsLeft] = useState(300);
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  // Shimmer animation effect
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

  const formatTime = secs => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const GradientBox = ({ children }) => {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.reportBoxWrapper}>
          <LinearGradient
            colors={['#4774c9', '#294ea0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[StyleSheet.absoluteFillObject, { borderRadius: 24 }]}
          />
          <View style={styles.reportBoxContent}>{children}</View>
        </View>
      );
    } else {
      return (
        <LinearGradient
          colors={['#4774c9', '#294ea0']}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1]}
          style={styles.reportBox}
        >
          {children}
        </LinearGradient>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
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
              22,578 Seniors Helped In Last 24 Hours!
            </Text>
          </View>
        </View>

        <Text style={styles.heading}>
          Congratulations,{'\n'} {fullName || 'User'}!
        </Text>

        <View style={styles.boxQualified}>
          <Text style={styles.boxQualifiedText}>
            We found you qualify for benefits worth{' '}
            <Text style={styles.benefitAmount}>
              ${roundedTotal > 0 ? roundedTotal.toLocaleString() : '15,000'}+
            </Text>
          </Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={styles.vertDashedLine} />
          <Image
            source={require('../assets/doc.png')}
            style={styles.reportImage}
            resizeMode="contain"
          />
          <View style={styles.vertDashedLine} />
        </View>
        <GradientBox>
          <Text style={styles.reportTitle}>Your Benefit Report Is Ready!</Text>
          <View style={{ marginTop: 18 }}>
            <Text style={styles.reportDetail}>
              • You're approved for {tags.length} exclusive benefits, worth over{' '}
              {roundedTotal > 0 ? roundedTotal.toLocaleString() : '15,000'}+ if
              claimed on time.
            </Text>
            <Text style={styles.reportDetail}>
              • Deadlines are strict, and unclaimed benefits will be lost if you
              wait too long.
            </Text>
            <Text style={styles.reportDetail}>
              • Click below to start claiming each benefit one by one — now!
            </Text>
          </View>
          <TouchableOpacity
            style={styles.claimButton}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('LoadingPage', {
                fullName: fullName,
                tags: tags,
                userId,
              })
            }
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
            <View style={styles.claimButtonContent}>
              <Text style={styles.claimText}>Start Claiming My Benefits!</Text>
            </View>
          </TouchableOpacity>
        </GradientBox>

        <View style={styles.timerContainer}>
          <Text style={styles.timerMessage}>
            Due to high demand, your benefit report is available to claim for
            only 5 minutes.
          </Text>
          <Timer />
        </View>

        <TestimonialSlider />

        <View style={{ ...styles.noteContainer, alignItems: 'center' }}>
          <Text style={{ textAlign: 'center' }}>
            <Text style={styles.noteStrong}>NOTE: </Text>
            <Text style={styles.noteBody}>
              We don't spam OR sell information & we aren't affiliated with any
              gov. branch. We are not sponsored by any External Private
              Organisation.
            </Text>
          </Text>
          <Text style={{ textAlign: 'center', ...styles.noteBody2 }}>
            Beware of other fraudulent & similar looking websites. This is the
            only official website to claim the benefits you're qualified for
            (mybenefitsai.org).
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    backgroundColor: COLORS.black,
  },
  logo: {
    width: 'auto',
    height: 60,
    marginRight: 10,
  },
  ribbonWrap: {},
  ribbon: {
    backgroundColor: COLORS.ribbon,
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
  heading: {
    fontSize: 32,
    marginTop: 10,
    fontWeight: '700',
    color: COLORS.black,
    lineHeight: 41,
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
  },
  boxQualified: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 20,
    marginHorizontal: 24,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 0,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#abd7bf',
  },
  boxQualifiedText: {
    color: COLORS.black,
    fontWeight: '700',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 3,
    marginRight: 6,
  },
  benefitAmount: {
    color: '#44aa5f',
    fontWeight: '700',
    fontSize: 20,
    marginTop: 4,
    paddingLeft: 6,
  },
  vertDashedLine: {
    width: 1.5,
    height: 26,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#3771ce',
    backgroundColor: 'transparent',
    marginVertical: 2,
  },
  reportImage: {
    width: 65,
    height: 58,
  },
  reportBoxWrapper: {
    marginHorizontal: 10,
    borderRadius: 24,
    marginTop: 0,
    marginBottom: 40,
    shadowColor: '#2e2e8a',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.13,
    shadowRadius: 14,
    elevation: 5,
    overflow: 'hidden',
  },
  reportBoxContent: {
    paddingVertical: 30,
    paddingHorizontal: 22,
    zIndex: 1,
  },
  reportBox: {
    marginHorizontal: 10,
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 22,
    marginTop: 0,
    marginBottom: 40,
    shadowColor: '#2e2e8a',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.13,
    shadowRadius: 14,
    elevation: 5,
  },
  reportTitle: {
    fontSize: 28,
    color: COLORS.white,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  reportDetail: {
    fontSize: 16,
    color: COLORS.white,
    marginVertical: 8,
    fontWeight: '400',
    paddingHorizontal: 4,
    lineHeight: 22,
  },
  claimButton: {
    marginTop: 22,
    width: '100%',
    backgroundColor: COLORS.green,
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  claimText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 19,
    letterSpacing: 0.2,
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
  claimButtonContent: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  timerMessage: {
    fontSize: 18,
    color: COLORS.black,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  timerBox: {
    borderWidth: 2,
    borderColor: '#f55',
    borderRadius: 10,
    borderStyle: 'dotted',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ffdddd',
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#ff1111',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  noteContainer: {
    marginTop: 36,
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  noteStrong: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  noteBody: {
    color: '#111827',
    fontSize: 13,
    lineHeight: 23,
    paddingHorizontal: 4,
  },
  noteBody2: {
    marginTop: 25,
    color: '#111827',
    fontSize: 11,
    lineHeight: 20,
    paddingHorizontal: 4,
  },
});

export default MiddleScreen;
