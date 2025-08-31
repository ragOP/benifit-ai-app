import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  UserRound,
  Undo2,
  Lock,
  LogOut,
  Menu,
  Gift,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  bg: '#16391A',
  bg2: '#1F4720',
  black: '#000000',
  white: '#FFF',
  cardBg: '#F9F9F9',
  title: '#21382B',
  sheetTitle: '#21382B',
  phone: '#839185',
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
  orange: '#FFA559',
};

const menuData = [
  {
    label: 'My Profile',
    icon: <UserRound size={22} color={COLORS.icon1} />,
    chipBg: COLORS.chip1,
  },
  {
    label: 'Refer Your Friends',
    icon: <Gift size={22} color={COLORS.icon2} />,
    chipBg: COLORS.chip2,
  },
  {
    label: 'Claimed Offer',
    icon: <Menu size={22} color={COLORS.icon3} />,
    chipBg: COLORS.chip3,
  },
  {
    label: 'Change Password',
    icon: <Lock size={22} color={COLORS.icon5} />,
    chipBg: COLORS.chip5,
  },
  {
    label: 'Logout',
    icon: <LogOut size={22} color={COLORS.icon6} />,
    chipBg: COLORS.chip6,
  },
];

export default function ProfileScreen() {
  const [userName, setUserName] = useState('User');
  const [phone, setPhone] = useState('+88001712346789');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedPhone = await AsyncStorage.getItem('userPhone');
        if (storedName)
          setUserName(storedName.charAt(0).toUpperCase() + storedName.slice(1));
        if (storedPhone) setPhone(storedPhone);
      } catch (e) {
        console.warn('Failed to load user data', e);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            // Clear all user-related data from AsyncStorage
            // Keep FCM token for device - it's device-specific, not user-specific
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('userEmail');
            await AsyncStorage.removeItem('userId');
            await AsyncStorage.removeItem('userPhone');
            // await AsyncStorage.removeItem('fcmToken'); // Keep FCM token - device specific
            await AsyncStorage.removeItem('userFlowCompleted');
            await AsyncStorage.removeItem('conversationId');

            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

      <View style={styles.header}>
        <Text style={styles.profileTitle}>Profile</Text>

        <View style={[styles.bgShape, { top: 40, left: 26 }]} />
        <View style={[styles.bgQuarter, { top: 120, left: 150 }]} />
        <View
          style={[
            styles.bgQuarter,
            { top: 90, right: 28, transform: [{ rotate: '160deg' }] },
          ]}
        />
        <View
          style={[
            styles.bgShape,
            { bottom: 30, right: 30, transform: [{ rotate: '200deg' }] },
          ]}
        />

        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <UserRound size={54} color="#EEE" strokeWidth={2.2} />
          </View>
        </View>
        <Text style={styles.name}>{userName}</Text>
      </View>

      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <Text style={styles.sectionTitle}>Account Overview</Text>
          {menuData.map(item => {
            if (item.label === 'Logout') {
              return (
                <TouchableOpacity
                  key={item.label}
                  style={styles.row}
                  activeOpacity={0.7}
                  onPress={handleLogout}
                >
                  <View style={[styles.chip, { backgroundColor: item.chipBg }]}>
                    {item.icon}
                  </View>
                  <Text style={styles.rowText}>{item.label}</Text>
                  <ChevronRight
                    size={22}
                    color="#BBC3BA"
                    style={{ marginLeft: 'auto' }}
                  />
                </TouchableOpacity>
              );
            }
            if (item.label === 'My Profile') {
              return (
                <TouchableOpacity
                  key={item.label}
                  style={styles.row}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('MyProfileScreen')}
                >
                  <View style={[styles.chip, { backgroundColor: item.chipBg }]}>
                    {item.icon}
                  </View>
                  <Text style={styles.rowText}>{item.label}</Text>
                  <ChevronRight
                    size={22}
                    color="#BBC3BA"
                    style={{ marginLeft: 'auto' }}
                  />
                </TouchableOpacity>
              );
            }
            if (item.label === 'Refer & Earn') {
              return (
                <TouchableOpacity
                  key={item.label}
                  style={styles.row}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('ReferralScreen')}
                >
                  <View style={[styles.chip, { backgroundColor: item.chipBg }]}>
                    {item.icon}
                  </View>
                  <Text style={styles.rowText}>{item.label}</Text>
                  <ChevronRight
                    size={22}
                    color="#BBC3BA"
                    style={{ marginLeft: 'auto' }}
                  />
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={item.label}
                style={styles.row}
                activeOpacity={0.7}
              >
                <View style={[styles.chip, { backgroundColor: item.chipBg }]}>
                  {item.icon}
                </View>
                <Text style={styles.rowText}>{item.label}</Text>
                <ChevronRight
                  size={22}
                  color="#BBC3BA"
                  style={{ marginLeft: 'auto' }}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'white' },
  header: {
    height: 270,
    backgroundColor: '#0a2003',

    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
  },
  profileTitle: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginTop: 36,
    zIndex: 2,
  },
  headerKebab: {
    position: 'absolute',
    right: 24,
    top: 36,
    zIndex: 2,
  },
  avatarWrap: {
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 3,
    borderColor: COLORS.white,
    backgroundColor: '#1a2c20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -6,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.orange,
    borderWidth: 3,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  name: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    letterSpacing: 0.2,
  },
  phone: {
    color: COLORS.phone,
    fontSize: 14,
    marginTop: 1,
    fontWeight: '500',
  },
  sheet: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -30,
    paddingHorizontal: 0,
    paddingTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.sheetTitle,
    marginLeft: 22,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    marginHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: 13,
    paddingHorizontal: 10,
    shadowColor: '#abc4ab',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.055,
    shadowRadius: 6,
    elevation: 2,
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
    fontWeight: '500',
    flex: 1,
    textAlignVertical: 'center',
  },
  bgShape: {
    position: 'absolute',
    width: 72,
    height: 72,
    backgroundColor: '#244f1d',
    borderRadius: 36,
    opacity: 0.3,
  },
  bgQuarter: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#244f1d',
    borderTopLeftRadius: 40,
    opacity: 0.35,
  },
});
