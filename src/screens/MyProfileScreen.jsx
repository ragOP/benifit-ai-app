import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Camera,
  ChevronLeft,
  Gift,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  black: '#000000',
  dark: '#0c1a17',
  bg: '#f6f7f2',
  white: '#ffffff',
  teal: '#015d54',
  tealDark: '#0a6a5c',
  text: '#121517',
  sub: '#6b7a78',
  gray: '#555',
  iconBg: '#e7f4f1',
  border: '#E2E8F0',
};

export default function MyProfileScreen() {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    avatar: null,
  });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedPhone = await AsyncStorage.getItem('userPhone');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        
        if (storedName) {
          setUserData(prev => ({ ...prev, name: storedName }));
        }
        if (storedPhone) {
          setUserData(prev => ({ ...prev, phone: storedPhone }));
        }
        if (storedEmail) {
          setUserData(prev => ({ ...prev, email: storedEmail }));
        }
      } catch (error) {
        console.warn('Failed to load user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color={COLORS.white} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {userData.avatar ? (
              <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <UserRound size={40} color={COLORS.white} strokeWidth={2} />
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton}>
              <Camera size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userSubtitle}>Benefit AI User</Text>
        </View>

        {/* Contact Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.infoRow}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.iconBg }]}>
              <Mail size={18} color={COLORS.teal} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
          </View>

          {/* <View style={styles.infoRow}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.iconBg }]}>
              <Phone size={18} color={COLORS.teal} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{userData.phone}</Text>
            </View>
          </View> */}

          {/* <View style={styles.infoRow}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.iconBg }]}>
              <MapPin size={18} color={COLORS.teal} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{userData.location}</Text>
            </View>
          </View> */}
        </View>

        {/* Referral Section */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Referral Program</Text>
          
          <TouchableOpacity
            style={styles.referralRow}
            onPress={() => navigation.navigate('ReferralScreen')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: COLORS.iconBg }]}>
              <Gift size={18} color={COLORS.teal} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Refer & Earn</Text>
              <Text style={styles.infoValue}>Share your code and earn rewards</Text>
            </View>
            <View style={styles.chevronContainer}>
              <ChevronLeft size={20} color={COLORS.sub} style={styles.chevron} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Edit Profile Button */}
        {/* <TouchableOpacity
          style={styles.editProfileButton}
          activeOpacity={0.7}
        >
          <Edit3 size={20} color={COLORS.white} />
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity> */}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.black,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 16,
    color: COLORS.sub,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.sub,
    fontWeight: '500',
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
    marginBottom: 16,
  },
  chevronContainer: {
    marginLeft: 'auto',
  },
  chevron: {
    transform: [{ rotate: '180deg' }],
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.teal,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: COLORS.teal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editProfileButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
}); 