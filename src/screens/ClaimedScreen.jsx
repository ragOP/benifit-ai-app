import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  black: '#000000',
  dark: '#0c1a17',
  bg: '#f6f7f2',
  white: '#ffffff',
  teal: '#015d54',
  gray: '#555',
};

const TAGS = {
  is_md: 'Medicare',
  is_debt: 'Debt',
  is_auto: 'Auto',
  is_mva: 'MVA',
};

const ALL_BENEFIT_CARDS = {
  is_md: {
    title: 'Food Allowance Card',
    description:
      'This food allowance card gives you thousands of dollars a year to spend on groceries, rent, prescriptions, etc.',
    img: require('../assets/card.png'),
    badge: 'Easiest To Claim',
    phone: '+18333381762',
    call: 'CALL (323) 689-7861',
  },
  is_debt: {
    title: 'Credit Card Debt Relief',
    description:
      'You are eligible to get all your debt relieved under the new Emergency Debt Relief program.',
    img: require('../assets/benifit2.webp'),
    badge: 'Takes 10 Minutes Or More',
    phone: '+18333402442',
    call: 'CALL (833) 340-2442',
  },
  is_auto: {
    title: 'Auto Insurance',
    description:
      "You're eligible for a Discounted Auto Insurance Plan with all the coverage.",
    img: require('../assets/benifit3.webp'),
    badge: 'Assured Monthly Savings!',
    phone: '+16197753027',
    call: 'CALL (619) 775-3027',
  },
  is_mva: {
    title: 'MVA',
    description:
      'You might be eligible for a higher compensation. Most people get 3x of their past compensations.',
    img: require('../assets/benifit4.webp'),
    badge: 'Could Be Worth $100,000+',
    phone: 'https://www.roadwayrelief.com/get-quote-am/',
    call: 'CLICK HERE TO PROCEED',
  },
};

const ClaimedScreen = () => {
  const [claimedOffers, setClaimedOffers] = useState([]);
  const [unclaimedOffers, setUnclaimedOffers] = useState([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimingOffer, setClaimingOffer] = useState(null);

  const normalizeOffers = offers => {
    return offers
      .map(title => {
        const lower = title.toLowerCase();
        if (lower.includes('auto')) return 'is_auto';
        if (lower.includes('debt')) return 'is_debt';
        if (lower.includes('medicare')) return 'is_md';
        if (lower.includes('mva')) return 'is_mva';
        return null;
      })
      .filter((value, index, self) => value && self.indexOf(value) === index); // Remove duplicates
  };

  const fetchClaimedOffers = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem('userId');

      if (!id) {
        console.warn('User ID not found in AsyncStorage');
        return;
      }

      const res = await fetch(
        `https://benifit-ai-app-be.onrender.com/api/v1/users/claimed-offer?userId=${id}`,
      );
      const json = await res.json();

      console.log('Fetched offers response:', json);

      const normalizedClaimed = normalizeOffers(json.data?.claimedOffer || []);
      let normalizedUnclaimed = normalizeOffers(
        json.data?.unClaimedOffer || [],
      );
      normalizedUnclaimed = normalizedUnclaimed.filter(
        offer => !normalizedClaimed.includes(offer),
      );
      console.log(json.data, "<<<json");
      console.log(json.data.userId, "<<<json");
      setUserId(json.data.userId)

      setClaimedOffers(normalizedClaimed);
      setUnclaimedOffers(normalizedUnclaimed);
    } catch (error) {
      console.error('Error fetching claimed offers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaimedOffers();
  }, [fetchClaimedOffers]);

  const handleActionPress = async offerKey => {
    if (!userId || !offerKey) return;

    setClaiming(true);
    setClaimingOffer(offerKey);

    const claimedOfferId = TAGS[offerKey];

    try {
      setClaimedOffers(prev => [...prev, offerKey]);
      setUnclaimedOffers(prev => prev.filter(item => item !== offerKey));

      console.log('claimedOfferid>>>>>>>', claimedOfferId);

      const response = await fetch(
        'https://benifit-ai-app-be.onrender.com/api/v1/users/abandoned-claim',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            claimedOfferIds: [claimedOfferId],
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setClaimedOffers(prev => prev.filter(item => item !== offerKey));
        setUnclaimedOffers(prev => [...prev, offerKey]);
        Alert.alert('Error', result.message || 'Failed to claim offer');
      } else {
        const benefitCard = ALL_BENEFIT_CARDS[offerKey];
        // if (benefitCard?.phone) {
        //   if (benefitCard.phone.startsWith('http')) {
        //     Linking.openURL(benefitCard.phone);
        //   } else {
        //     Linking.openURL(`tel:${benefitCard.phone}`);
        //   }
        // }
      }
    } catch (error) {
      setClaimedOffers(prev => prev.filter(item => item !== offerKey));
      setUnclaimedOffers(prev => [...prev, offerKey]);
      console.error('Error claiming offer:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setClaiming(false);
      setClaimingOffer(null);
    }
  };

  const renderCard = (item, isClaimed = true) => {
    const benefitCard = ALL_BENEFIT_CARDS[item];
    if (!benefitCard) return null;

    return (
      <View
        style={[styles.benefitCard, isClaimed ? null : styles.unclaimedCard]}
      >
        <Image source={benefitCard.img} style={styles.benefitImage} />
        <Text style={styles.benefitTitle}>{benefitCard.title}</Text>
        <Text style={styles.benefitDesc}>{benefitCard.description}</Text>
        <Text style={styles.benefitBadge}>{benefitCard.badge}</Text>
        {!isClaimed && (
          <TouchableOpacity
            onPress={() => handleActionPress(item)}
            style={styles.callButton}
            disabled={claiming && claimingOffer === item}
          >
            {claiming && claimingOffer === item ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.callButtonText}>{benefitCard.call}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSkeletonCard = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonBadge} />
        <View style={styles.skeletonDescription} />
        <View style={styles.skeletonButton} />
      </View>
    </View>
  );

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
        {/* <View style={styles.ribbonWrap}>
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>
              Unclaimed Offers - Get Your Benefits Today!
            </Text>
          </View>
        </View> */}
        <View style={styles.content}>
          <Text style={styles.sectionHeader}>
            Claimed Offers {claimedOffers.length > 0 ? `(${claimedOffers.length})` : ''}
          </Text>
          {loading ? (
            <>
              {renderSkeletonCard()}
              {renderSkeletonCard()}
            </>
          ) : claimedOffers.length > 0 ? (
            claimedOffers.map((item, index) => (
              <View key={index} style={styles.cardWrapper}>
                <Text style={styles.userIdText}>User ID: {userId}</Text>
                {renderCard(item, true)}
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <Text style={styles.emptyStateEmoji}>📋</Text>
              </View>
              <Text style={styles.emptyStateTitle}>No Claimed Offers Yet</Text>
              <Text style={styles.emptyStateSubtitle}>
                You haven't claimed any offers yet. Complete your registration to start claiming benefits!
              </Text>
            </View>
          )}

          <Text style={styles.sectionHeader}>
            Unclaimed Offers {unclaimedOffers.length > 0 ? `(${unclaimedOffers.length})` : ''}
          </Text>
          {loading ? (
            <>
              {renderSkeletonCard()}
              {renderSkeletonCard()}
              {renderSkeletonCard()}
            </>
          ) : unclaimedOffers.length > 0 ? (
            unclaimedOffers.map((item, index) => (
              <View key={index} style={styles.cardWrapper}>
                <Text style={styles.userIdText}>User ID: {userId}</Text>
                {renderCard(item, false)}
              </View>
            ))
          ) : claimedOffers?.length > 0 ? (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <Text style={styles.emptyStateEmoji}>🎉</Text>
              </View>
              <Text style={styles.emptyStateTitle}>Congratulations!</Text>
              <Text style={styles.emptyStateSubtitle}>
                You've claimed all available offers! Check back later for new benefits.
              </Text>
              <View style={styles.successBadge}>
                <Text style={styles.successBadgeText}>All Offers Claimed! 🎯</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <Text style={styles.emptyStateEmoji}>🚀</Text>
              </View>
              <Text style={styles.emptyStateTitle}>Start Your Benefits Journey</Text>
              <Text style={styles.emptyStateSubtitle}>
                Complete your registration to discover and claim amazing benefits you're eligible for!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg, },
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
    fontSize: 16,
    fontWeight: '600',
  },
  ribbonWrap: {},
  content: {
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    color: COLORS.teal,
    marginHorizontal: 0,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  userIdText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 6,
    marginLeft: 4,
  },
  benefitCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    alignItems: 'center',
  },
  unclaimedCard: {
    borderWidth: 2,
    borderColor: COLORS.teal,
    backgroundColor: '#f0f0f0',
  },
  benefitImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  benefitTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 6,
  },
  benefitBadge: {
    backgroundColor: COLORS.teal,
    color: COLORS.white,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'center',
  },
  callButton: {
    backgroundColor: COLORS.teal,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'center',
  },
  callButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyMessage: {
    color: COLORS.gray,
    fontSize: 16,
    marginLeft: 4,
    marginBottom: 16,
  },
  emptyStateContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateEmoji: {
    fontSize: 40,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: COLORS.sub,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  exploreButton: {
    backgroundColor: COLORS.teal,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    shadowColor: COLORS.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  exploreButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  successBadge: {
    backgroundColor: COLORS.checkBg,
    borderWidth: 2,
    borderColor: COLORS.checkIcon,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  successBadgeText: {
    color: COLORS.checkIcon,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  skeletonCard: {
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
  skeletonImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
  },
  skeletonContent: {
    gap: 12,
  },
  skeletonTitle: {
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    width: '80%',
  },
  skeletonBadge: {
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    width: '40%',
  },
  skeletonDescription: {
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    width: '100%',
    marginBottom: 8,
  },
  skeletonButton: {
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    width: '60%',
    alignSelf: 'center',
  },
});

export default ClaimedScreen;
