import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  UserRound,
  Mail,
  ChevronLeft,
  ChevronRight,
  Gift,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  black: '#000000',
  dark: '#0c1a17',
  bg: '#f6f7f2',
  white: '#ffffff',
  teal: '#015d54',
  text: '#121517',
  sub: '#6b7a78',
  iconBg: '#e7f4f1',
  border: '#E2E8F0',
  cardShadow: 'rgba(0,0,0,0.08)',
};

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  android: {
    elevation: 6,
  },
});

export default function MyProfileScreen() {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
  });

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedEmail = await AsyncStorage.getItem('userEmail');

        setUserData(prev => ({
          ...prev,
          ...(storedName ? { name: storedName } : {}),
          ...(storedEmail ? { email: storedEmail } : {}),
        }));
      } catch (error) {
        console.warn('Failed to load user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const initials = useMemo(() => {
    const parts = userData.name.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const second = parts[1]?.[0] || '';
    return (first + second).toUpperCase();
  }, [userData.name]);

  return (
    <View style={styles.container}>
      {/* iOS uses translucent status bar; set barStyle only */}
      <StatusBar barStyle="light-content" />

      {/* Safe header for iOS notches */}
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack?.()}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ChevronLeft size={24} color={COLORS.white} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          {/* Keep layout balanced */}
          <View style={styles.headerRightSpace} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card (NO photo functionality; static avatar style) */}
        <View style={[styles.profileCard, shadow]}>
          <View style={styles.avatarContainer} accessible accessibilityRole="image" accessibilityLabel="User avatar">
            <View style={styles.avatarCircle}>
              {/* Simple initials with fallback icon for accessibility */}
              <Text style={styles.avatarInitials} accessibilityElementsHidden>
                {initials || 'JD'}
              </Text>
              {/* Hidden icon for semantics; keep visual minimal */}
              <UserRound size={0.1} color="transparent" />
            </View>
          </View>

          <Text style={styles.userName} numberOfLines={1}>
            {userData.name}
          </Text>
          <Text style={styles.userSubtitle}>Benefit AI User</Text>
        </View>

        {/* Contact Information */}
        <View style={[styles.infoCard, shadow]}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Mail size={18} color={COLORS.teal} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue} selectable>
                {userData.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Referral Section */}
        <View style={[styles.infoCard, shadow]}>
          <Text style={styles.sectionTitle}>Referral Program</Text>

          <TouchableOpacity
            style={styles.referralRow}
            onPress={() => navigation.navigate?.('ReferralScreen')}
            activeOpacity={0.75}
          >
            <View style={styles.iconContainer}>
              <Gift size={18} color={COLORS.teal} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Refer & Earn</Text>
              <Text style={styles.infoValue}>Share your code and earn rewards</Text>
            </View>
            <ChevronRight size={20} color={COLORS.sub} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

const CARD_RADIUS = 16;
const AVATAR_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  /* Header */
  headerSafe: {
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: Platform.OS === 'android' ? 12 : 6, // extra height on Android
    backgroundColor: COLORS.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  headerRightSpace: {
    width: 24, // balance ChevronLeft width
  },

  /* Content */
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },

  /* Cards */
  profileCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: CARD_RADIUS,
  },

  infoCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 12,
    padding: 20,
    borderRadius: CARD_RADIUS,
  },

  /* Avatar (static; no edit/camera) */
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.cardShadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: { elevation: 4 },
    }),
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1.2,
  },

  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 15,
    color: COLORS.sub,
    fontWeight: '500',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: 0.2,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: COLORS.iconBg,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.sub,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },

  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
});
