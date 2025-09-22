import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Clipboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Share2,
  Copy,
  Gift,
  Users,
  Award,
} from 'lucide-react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from '../hooks/useToast';
import { Toast } from '../component/Toast';
import RNShare from 'react-native-share';
import { BACKEND_URL } from '../utils/backendUrl';

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
  success: '#10B981',
  warning: '#F59E0B',
};

export default function ReferralScreen() {
  const [referralCode, setReferralCode] = useState(
    'Check out Benefit AI! An amazing app with AI-powered benefits and exclusive offers. Download it now!',
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const {
    toastVisible,
    toastMessage,
    toastType,
    showSuccessToast,
    showErrorToast,
    hideToast,
  } = useToast();

  const fetchReferralUrl = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${BACKEND_URL}/api/v1/get-refrel`);
      const data = await response.json();

      if (response.ok && data.data) {
        const platformUrl =
          Platform.OS === 'android' ? data.data.androidLink : data.data.ios;

        setReferralCode(platformUrl);
      } else {
        throw new Error('Failed to fetch referral URL');
      }
    } catch (error) {
      console.log('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralUrl();
  }, []);

  const handleShare = async () => {
    try {
      await RNShare.open({
        message: `Check out Benefit AI! An amazing app with AI-powered benefits and exclusive offers. Download it now!`,
        url: referralCode, // Use the app link
        title: 'Benefit AI - Amazing App',
        subject: 'Benefit AI App',
        showAppsToView: true,
        showAppsToShare: true,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleCopyCode = async () => {
    try {
      await Clipboard.setString(referralCode);
      showSuccessToast('App link copied to clipboard!');
    } catch (error) {
      showErrorToast('Failed to copy app link');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.headerTitle}>Share App</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Link Card */}
        <View style={styles.referralCodeCard}>
          <View style={styles.codeHeader}>
            <Gift size={24} color={COLORS.teal} />
            <Text style={styles.codeTitle}>Your App Link</Text>
          </View>

          <View style={styles.codeContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading referral link...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.referralCode}>{referralCode}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={handleCopyCode}
                  activeOpacity={0.7}
                >
                  <Copy size={16} color={COLORS.white} />
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={20} color={COLORS.white} />
            <Text style={styles.shareButtonText}>Share App Link</Text>
          </TouchableOpacity>
        </View>

        {/* App Features Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.iconBg }]}>
              <Users size={20} color={COLORS.teal} />
            </View>
            <Text style={styles.statNumber}>AI Powered</Text>
            <Text style={styles.statLabel}>Smart Benefits</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.iconBg }]}>
              <Award size={20} color={COLORS.success} />
            </View>
            <Text style={styles.statNumber}>Exclusive</Text>
            <Text style={styles.statLabel}>Premium Access</Text>
          </View>
        </View>

        {/* App Benefits Section */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.sectionTitle}>Why Share Benefit AI?</Text>

          <View style={styles.benefitContainer}>
            <View style={styles.benefitIcon}>
              <MaterialIcon
                name="rocket-launch"
                size={24}
                color={COLORS.teal}
              />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Discover Amazing Benefits</Text>
              <Text style={styles.benefitDescription}>
                Help your friends discover AI-powered benefits and exclusive
                offers
              </Text>
            </View>
          </View>

          <View style={styles.benefitContainer}>
            <View style={styles.benefitIcon}>
              <MaterialIcon name="star" size={24} color={COLORS.success} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Premium Experience</Text>
              <Text style={styles.benefitDescription}>
                Give them access to premium features and smart recommendations
              </Text>
            </View>
          </View>

          <View style={styles.benefitContainer}>
            <View style={styles.benefitIcon}>
              <MaterialIcon name="heart" size={24} color={COLORS.warning} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Spread the Love</Text>
              <Text style={styles.benefitDescription}>
                Share something valuable with people you care about
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onDismiss={hideToast}
      />
    </SafeAreaView>
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
  referralCodeCard: {
    backgroundColor: COLORS.white,
    margin: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  codeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.iconBg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    minHeight: 60,
  },
  referralCode: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.teal,
    flex: 1,
    marginRight: 12,
    lineHeight: 18,
  },
  copyButton: {
    backgroundColor: COLORS.teal,
    padding: 8,
    borderRadius: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.teal,
    padding: 16,
    borderRadius: 12,
    shadowColor: COLORS.teal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  shareButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },

  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.sub,
    fontWeight: '500',
  },
  howItWorksCard: {
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
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.sub,
    lineHeight: 20,
  },
  benefitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: COLORS.sub,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.sub,
    fontStyle: 'italic',
  },
  historyCard: {
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
  referralItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  referralDate: {
    fontSize: 14,
    color: COLORS.sub,
  },
  referralStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
  },
  bottomSpacer: {
    height: 40,
  },
});
