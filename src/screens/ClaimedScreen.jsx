import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  ScrollView,
  StatusBar,
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
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchClaimedOffers = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      console.log('Fetched userId from AsyncStorage:', id);
      setUserId(id);

      if (!id) {
        console.warn('User ID not found in AsyncStorage');
        return;
      }

      const res = await fetch(
        `https://benifit-ai-app-be.onrender.com/api/v1/users/claimed-offer?userId=${id}`,
      );
      const json = await res.json();
      const offerTitles = json.data?.claimedOffer || [];

      const normalizedOffers = offerTitles
        .map(title => {
          const lower = title.toLowerCase();
          if (lower.includes('auto')) return 'is_auto';
          if (lower.includes('debt')) return 'is_debt';
          if (lower.includes('medicare')) return 'is_md';
          if (lower.includes('mva')) return 'is_mva';
          return null;
        })
        .filter(Boolean);

      setClaimedOffers(normalizedOffers);
    } catch (error) {
      console.error('Error fetching claimed offers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimedOffers();
  }, []);

  const handleCallPress = phone => {
    if (!phone) return;
    if (phone.startsWith('http')) {
      Linking.openURL(phone);
    } else {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const renderItem = ({ item }) => {
    const benefitCard = ALL_BENEFIT_CARDS[item];
    if (!benefitCard) return null;

    return (
      <View style={styles.cardWrapper}>
        <Text style={styles.userIdText}>User ID: {userId}</Text>
        <View style={styles.benefitCard}>
          <Image source={benefitCard.img} style={styles.benefitImage} />
          <Text style={styles.benefitTitle}>{benefitCard.title}</Text>
          <Text style={styles.benefitDesc}>{benefitCard.description}</Text>
          <Text style={styles.benefitBadge}>{benefitCard.badge}</Text>
          <TouchableOpacity
            onPress={() => handleCallPress(benefitCard.phone)}
            style={styles.callButton}
          >
            <Text style={styles.callButtonText}>{benefitCard.call}</Text>
          </TouchableOpacity>
        </View>
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

  if (claimedOffers.length === 0) {
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
        <View style={styles.center}>
          <Text style={{ color: COLORS.gray, fontSize: 16 }}>
            No claimed offers found.
          </Text>
        </View>
      </SafeAreaView>
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
      <FlatList
        data={claimedOffers}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ClaimedScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg, paddingBottom: 20 },
  header: {
    backgroundColor: COLORS.black,
    paddingTop: 0,
  },
  logo: {
    width: 'auto',
    height: 60,
    marginRight: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
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
  },
  callButton: {
    backgroundColor: COLORS.teal,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  callButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
