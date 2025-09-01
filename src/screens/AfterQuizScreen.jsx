import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  ImageBackground,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const COLORS = {
  black: '#000',
  white: '#fff',
  green: '#10b981',
  teal: '#14b8a6',
  subtitleText: '#1a1a1a',
  bg: '#f9fafb',
};

export default function AfterQuizScreen({ navigation }) {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK' || e.data.action.type === 'POP') {
        e.preventDefault();
      }
    });

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation]);

  const handleRoute = async btn => {
    if (
      btn.title === '✅ Recheck My Eligibility' ||
      btn.title === '🔄 Refresh'
    ) {
      await AsyncStorage.removeItem('userFlowCompleted');
    }
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'BottomNavigation',
          params: { initialTab: btn.params },
        },
      ],
    });
  };

  const buttons = [
    { title: '🎁 Your Offers', route: 'BottomNavigation', params: 1 },
    { title: '📰 Blog', route: 'BottomNavigation', params: 3 },
    {
      title: '✅ Recheck My Eligibility',
      route: 'BottomNavigation',
      params: 0,
    },
    { title: '💬 Live Support', route: 'BottomNavigation', params: 2 },
    { title: '🔄 Refresh', route: 'BottomNavigation', params: 0 },
  ];

  return (
    <View style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome Back</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={require('../assets/benifit4.webp')} // 🔹 replace with your image
            style={styles.banner}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']}
              style={styles.bannerOverlay}
            >
              <View style={{ padding: 20 }}>
                <Text style={styles.bannerTitle}>Your Journey Continues 🚀</Text>
                <Text style={styles.bannerSubtitle}>
                  Pick where you want to go next and make the most of your
                  benefits
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsWrapper}>
          {buttons.map((btn, idx) => (
            <LinearGradient
              key={idx}
              colors={[COLORS.green, COLORS.teal]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionButton}
            >
              <TouchableOpacity
                style={styles.touchableArea}
                activeOpacity={0.9}
                onPress={() => handleRoute(btn)}
              >
                <Text style={styles.actionText}>{btn.title}</Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    backgroundColor: COLORS.black,
    paddingVertical: 16,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    flex: 1,
  },
  backButton: {
    padding: 8,
  },

  // Banner
  bannerContainer: {
    width: '100%',
    height: 220,
    marginBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  banner: {
    flex: 1,
    resizeMode: 'cover',
  },
  bannerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    // padding: 20,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },

  // Buttons
  buttonsWrapper: {
    paddingHorizontal: 24,
    gap: 24,
    marginTop: 10,
  },
  actionButton: {
    borderRadius: 28,
    elevation: 4,
  },
  touchableArea: {
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 16,
  },
  actionText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.3,
    zIndex: 1,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '6%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    transform: [{ skewX: '-20deg' }],
    zIndex: 0,
  },
});
