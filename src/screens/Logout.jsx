import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ChevronRight,
  UserRound,
  LogOut,
  Menu,
  Gift,
  Trash2,
  ShieldCheck,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BACKEND_URL } from '../utils/backendUrl';

const COLORS = {
  bg: '#16391A',
  bg2: '#1F4720',
  black: '#000000',
  white: '#FFF',
  cardBg: '#F6F7F6',
  title: '#1C2B22',
  sheetTitle: '#193422',
  phone: '#6F7D71',
  chip1: '#E2F1FF',
  chip2: '#E7FAE9',
  chip3: '#EFEAFF',
  chip4: '#FFF2EB',
  chip5: '#FFF0F6',
  chip6: '#FFE8E8',
  icon1: '#59A6F3',
  icon2: '#58C584',
  icon3: '#7C5CFF',
  icon4: '#F8755D',
  icon5: '#FF54AC',
  icon6: '#FF6B6B',
  greenDeep: '#0A2003',
  greenMid: '#153912',
  greenTint: '#1F4D19',
  borderSoft: '#E6EBE7',
  shadow: '#abc4ab',
  orange: '#FFA559',
};

// Correct live endpoints
const DELETE_USER_SINGULAR = `${BACKEND_URL}/api/v1/users/delete-user`;   // primary (token-only)
const DELETE_USERS_PLURAL  = `${BACKEND_URL}/api/v1/users/delete-users`;  // fallback (body with userId)

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [userName, setUserName] = useState('User');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const menuData = useMemo(
    () => [
      {
        label: 'My Profile',
        icon: <UserRound size={22} color={COLORS.icon1} />,
        chipBg: COLORS.chip1,
        onPress: () => navigation.navigate('MyProfileScreen'),
      },
      {
        label: 'Refer Your Friends',
        icon: <Gift size={22} color={COLORS.icon2} />,
        chipBg: COLORS.chip2,
        onPress: () => navigation.navigate('ReferralScreen'),
      },
      {
        label: 'Claimed Offer',
        icon: <Menu size={22} color={COLORS.icon3} />,
        chipBg: COLORS.chip3,
        onPress: () => navigation.navigate('ClaimedOfferScreen'),
      },
      {
        label: deleting ? 'Deleting...' : 'Delete Account',
        icon: deleting ? (
          <ActivityIndicator size="small" color={COLORS.icon4} />
        ) : (
          <Trash2 size={22} color={COLORS.icon4} />
        ),
        chipBg: COLORS.chip4,
        onPress: () => handleDeleteAccount(),
        destructive: true,
        disabled: deleting,
      },
      {
        label: 'Logout',
        icon: <LogOut size={22} color={COLORS.icon6} />,
        chipBg: COLORS.chip6,
        onPress: () => handleLogout(),
        destructive: true,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation, userName, userId, isGuest, deleting]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedPhone = await AsyncStorage.getItem('userPhone');
        const storedUserId = await AsyncStorage.getItem('userId');
        const guestFlag = await AsyncStorage.getItem('guestUser');

        if (storedName) {
          setUserName(storedName.charAt(0).toUpperCase() + storedName.slice(1));
        }
        if (storedPhone) setPhone(storedPhone);
        if (storedUserId) setUserId(storedUserId);
        setIsGuest(guestFlag === 'true');
      } catch (e) {
        console.warn('Failed to load user data', e);
      }
    };
    fetchData();
  }, []);

  const clearUserStorageAndGoLogin = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userPhone');
      await AsyncStorage.removeItem('userFlowCompleted');
      await AsyncStorage.removeItem('conversationId');
      await AsyncStorage.removeItem('guestUser');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: clearUserStorageAndGoLogin },
    ]);
  };

  const handleDeleteAccount = () => {
    if (deleting) return;

    if (isGuest) {
      Alert.alert(
        'Guest Mode',
        'Guest accounts do not have server data to delete. Log in to delete a full account.'
      );
      return;
    }

    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: doDeleteFlow,
        },
      ]
    );
  };

  const doDeleteFlow = async () => {
    try {
      setDeleting(true);

      const token = await AsyncStorage.getItem('userToken');
      const storedUserId = await AsyncStorage.getItem('userId');

      if (!token) {
        Alert.alert('Error', 'Not authenticated. Please log in again.');
        setDeleting(false);
        return;
      }

      // 1) Primary: live singular endpoint, no body (as per your working cURL)
      const resPrimary = await fetch(DELETE_USER_SINGULAR, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If ok (2xx) -> success
      if (resPrimary.ok) {
        Alert.alert('Deleted', 'Your account has been deleted.');
        await clearUserStorageAndGoLogin();
        setDeleting(false);
        return;
      }

      // If server says method not allowed or not found, try fallback
      if (resPrimary.status === 404 || resPrimary.status === 405) {
        const resFallback = await fetch(DELETE_USERS_PLURAL, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: storedUserId }),
        });

        let json2 = {};
        try { json2 = await resFallback.json(); } catch (_) {}

        if (resFallback.ok) {
          Alert.alert('Deleted', 'Your account has been deleted.');
          await clearUserStorageAndGoLogin();
          setDeleting(false);
          return;
        } else {
          const msg =
            (json2 && json2.message) ||
            `Failed to delete the account (fallback). [${resFallback.status}]`;
          Alert.alert('Error', msg);
          setDeleting(false);
          return;
        }
      }

      // Primary failed with some other code; try to parse and show message
      let json1 = {};
      try { json1 = await resPrimary.json(); } catch (_) {}
      const msg =
        (json1 && json1.message) ||
        `Failed to delete the account. [${resPrimary.status}]`;
      Alert.alert('Error', msg);
    } catch (err) {
      console.error('Delete account error:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const greeting = useMemo(() => {
    const first = (userName || 'User').trim().split(' ')[0];
    return `Hi, ${first} 👋`;
  }, [userName]);

  return (
    <View style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === 'android' ? COLORS.greenDeep : undefined}
      />

      {/* Header WITHOUT profile picture */}
      <View style={styles.header}>
        <View style={[styles.blob, { top: -30, left: -40, transform: [{ rotate: '30deg' }] }]} />
        <View style={[styles.blobSmall, { top: 30, right: -20, opacity: 0.25 }]} />
        <View style={[styles.blobSmallQuarter, { bottom: -10, left: 60, opacity: 0.3 }]} />

        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.nameCard}>
          <View style={styles.nameLeft}>
            <ShieldCheck size={18} color="#DFF3E3" />
            <Text style={styles.greeting}>{greeting}</Text>
          </View>
        </View>
      </View>

      {/* Sheet */}
      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <Text style={styles.sectionTitle}>Account Overview</Text>

          {menuData.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.row,
                item.destructive && { borderColor: '#FFE6E6', backgroundColor: '#FFF' },
                item.disabled && { opacity: 0.6 },
              ]}
              activeOpacity={0.75}
              onPress={item.onPress}
              disabled={item.disabled}
            >
              <View style={[styles.chip, { backgroundColor: item.chipBg }]}>{item.icon}</View>
              <Text
                style={[
                  styles.rowText,
                  item.destructive && { color: '#7A1520', fontWeight: '700' },
                ]}
              >
                {item.label}
              </Text>
              <ChevronRight size={22} color="#BBC3BA" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },

  header: {
    backgroundColor: COLORS.greenDeep,
    paddingTop: 36,
    paddingBottom: 18,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 22,
    color: COLORS.white,
    fontWeight: '800',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  blob: {
    position: 'absolute',
    width: 220,
    height: 220,
    backgroundColor: COLORS.greenMid,
    borderRadius: 110,
    opacity: 0.45,
  },
  blobSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    backgroundColor: COLORS.greenTint,
    borderRadius: 60,
    opacity: 0.35,
  },
  blobSmallQuarter: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: COLORS.greenTint,
    borderTopLeftRadius: 80,
    opacity: 0.3,
  },

  nameCard: {
    backgroundColor: '#143214',
    borderColor: '#1B4219',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0D2510',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 2,
  },
  nameLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  greeting: {
    color: '#EAF8EC',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  sheet: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 10,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.sheetTitle,
    marginLeft: 18,
    marginBottom: 10,
    letterSpacing: 0.3,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    marginHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  chip: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  rowText: {
    fontSize: 16,
    color: COLORS.title,
    fontWeight: '600',
    flex: 1,
    textAlignVertical: 'center',
  },
});

export default ProfileScreen;
