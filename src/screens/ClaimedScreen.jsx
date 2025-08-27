import React, { useEffect, useState } from 'react';
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

  const fetchClaimedOffers = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);

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

      setClaimedOffers(normalizedClaimed);
      setUnclaimedOffers(normalizedUnclaimed);
    } catch (error) {
      console.error('Error fetching claimed offers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimedOffers();
  }, []);

  const handleActionPress = async offerKey => {
    if (!userId || !offerKey) return;

    setClaiming(true);
    setClaimingOffer(offerKey);

    const claimedOfferId = TAGS[offerKey];

    try {
      setClaimedOffers(prev => [...prev, offerKey]);
      setUnclaimedOffers(prev => prev.filter(item => item !== offerKey));

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
        if (benefitCard?.phone) {
          if (benefitCard.phone.startsWith('http')) {
            Linking.openURL(benefitCard.phone);
          } else {
            Linking.openURL(`tel:${benefitCard.phone}`);
          }
        }
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.teal} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <View style={styles.header}>
        <Image
          source={require('../assets/center.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionHeader}>Claimed Offers</Text>
        {claimedOffers.length > 0 ? (
          claimedOffers.map((item, index) => (
            <View key={index} style={styles.cardWrapper}>
              <Text style={styles.userIdText}>User ID: {userId}</Text>
              {renderCard(item, true)}
            </View>
          ))
        ) : (
          <Text style={styles.emptyMessage}>No claimed offers found.</Text>
        )}

        <Text style={styles.sectionHeader}>Unclaimed Offers</Text>
        {unclaimedOffers.length > 0 ? (
          unclaimedOffers.map((item, index) => (
            <View key={index} style={styles.cardWrapper}>
              <Text style={styles.userIdText}>User ID: {userId}</Text>
              {renderCard(item, false)}
            </View>
          ))
        ) : (
          <Text style={styles.emptyMessage}>No unclaimed offers found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg, paddingBottom: 20 },
  header: {
    backgroundColor: COLORS.black,
    paddingTop: 0,
  },
  logo: {
    width: 120,
    height: 60,
    alignSelf: 'center',
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
});

export default ClaimedScreen;
