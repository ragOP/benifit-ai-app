import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  BackHandler,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  bg: '#F2F4F7',        // page background
  sheet: '#FFFFFF',     // big rounded container
  text: '#111827',
  sub: '#6B7280',
  border: '#E6EAF0',

  // tile colors (match screenshot vibe)
  tGreen: '#32D583',
  tRed: '#F97066',
  tAmber: '#F7B84B',
  tBlue: '#60A5FA',

  // chips
  chipBg: '#F3F4F6',
  chipBorder: '#E5E7EB',
  chipText: '#111827',
};

export default function AfterQuizScreen({ navigation }) {
  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK' || e.data.action.type === 'POP') e.preventDefault();
    });
    const bh = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => {
      unsub();
      bh.remove();
    };
  }, [navigation]);

  const handleRoute = async (item) => {
    if (item.clear || item.title === '🔄 Refresh' || item.title === '✅ Recheck My Eligibility') {
      await AsyncStorage.removeItem('userFlowCompleted');
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomNavigation', params: { initialTab: item.params } }],
    });
  };

  const tiles = [
    { title: '🎁 Your Offers', color: COLORS.tGreen, params: 1 },
    { title: '📰 Blog', color: COLORS.tRed, params: 3 },
    { title: '✅ Recheck My Eligibility', color: COLORS.tAmber, params: 0, clear: true },
    { title: '💬 Live Support', color: COLORS.tBlue, params: 2 },
  ];

  // compact quick actions (replaces the big gradient list)
  const quickActions = [
    { title: '🎁 Offers', params: 1 },
    { title: '📰 Blog', params: 3 },
    { title: '✅ Recheck', params: 0, clear: true },
    { title: '💬 Support', params: 2 },
    { title: '🔄 Refresh', params: 0, clear: true },
  ];

  return (
   
     <>
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
 <View style={styles.sheet}>

          {/* Header (your content only) */}
          <Text style={styles.welcome}>WELCOME BACK</Text>
          <Text style={styles.name}>Welcome Back</Text>

          {/* 2×2 colorful tiles mapped from your actions */}
          <View style={styles.grid}>
            {tiles.map((t, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.9}
                style={[styles.tile, { backgroundColor: t.color }]}
                onPress={() => handleRoute(t)}
              >
                <Text style={styles.tileTitle}>{t.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Ribbon (same copy) */}
          <View style={styles.ribbonWrap}>
            <View style={styles.ribbon}>
              <Text style={styles.ribbonText}>22,578 Americans Helped In Last 24 Hours!</Text>
            </View>
          </View>

          {/* Banner (image-free, soft card) */}
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Your Journey Continues 🚀</Text>
            <Text style={styles.bannerSubtitle}>
              Pick where you want to go next and make the most of your benefits
            </Text>
          </View>

          {/* QUICK ACTIONS: compact chips (replaces the big gradient buttons) */}
          <Text style={styles.quickLabel}>Quick Actions</Text>
          <View style={styles.chipsWrap}>
            {quickActions.map((a, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.chip}
                activeOpacity={0.9}
                onPress={() => handleRoute(a)}
              >
                <Text style={styles.chipText}>{a.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View></>
     
  
  );
}

const SHADOW_SHEET = {
  shadowColor: '#000',
  shadowOpacity: 0.10,
  shadowRadius: 22,
  shadowOffset: { width: 0, height: 12 },
  elevation: 6,
};

const SHADOW_CARD = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 10 },
  elevation: 4,
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  sheet: {
    marginHorizontal: 14,
    marginTop: 8,
    backgroundColor: COLORS.sheet,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW_SHEET,
  },

  welcome: {
    color: COLORS.sub,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  name: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 14,
  },
  tile: {
    width: '48%',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    ...SHADOW_CARD,
  },
  tileTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14.5,
  },

  ribbonWrap: { marginTop: 6, marginBottom: 8 },
  ribbon: {
    backgroundColor: '#14b8a6',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  ribbonText: {
    color: '#FFFFFF',
    letterSpacing: 0.2,
    fontStyle: 'italic',
    fontSize: 12,
    fontWeight: '800',
  },

  banner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    ...SHADOW_CARD,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14.5,
    color: COLORS.sub,
    lineHeight: 21,
  },

  /* Quick Actions */
  quickLabel: {
    color: COLORS.sub,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.4,
    marginTop: 2,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: COLORS.chipBg,
    borderColor: COLORS.chipBorder,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  chipText: {
    color: COLORS.chipText,
    fontWeight: '800',
    fontSize: 13,
  },
  header: {
    backgroundColor: "#000000",
    paddingTop: 0,
  },
  logo: {
    width: 'auto',
    height: 50,
    marginRight: 10,
  },
  

});
