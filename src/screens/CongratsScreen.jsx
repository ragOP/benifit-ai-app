import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BACKEND_URL } from '../utils/backendUrl';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  black: '#000000',
  dark: '#0c1a17',
  bg: '#f6f7f2',
  white: '#ffffff',
  teal: '#015d54',
  tealDark: '#0a6a5c',
  text: '#121517',
  sub: '#6b7a78',
  pill: '#0f0f10',
  checkBg: '#e7f4f1',
  checkIcon: '#0c7a6a',
  claim: '#2fbfa6',
};

const TAGS = {
  is_md: 'Medicare',
  // is_ssdi: 'SSDI',
  is_auto: 'Auto',
  is_mva: 'MVA',
  is_debt: 'Debt',
  // is_rvm: 'Reverse Mortgage',
};

const LockIcon = ({ size = 16, color = '#94a3b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 016 0v3H9z" />
  </Svg>
);

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

const BenefitCard = ({ benefit, onClaim }) => {
  const handlePress = async () => {
    try {
      await onClaim?.();
      if (benefit.title === 'MVA') {
        await Linking.openURL(benefit.phone);
      } else {
        const phoneNumber = benefit.phone.replace(/[^\d+]/g, '');
        const telUrl =
          Platform.OS === 'ios'
            ? `telprompt:${phoneNumber}`
            : `tel:${phoneNumber}`;

        try {
          await Linking.openURL(telUrl);
        } catch (error) {
          Alert.alert(
            'Phone Error',
            'Phone dialer is not available on this device.',
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.innerCard}>
      <View style={styles.pill}>
        <Text style={styles.pillText}>{benefit.badge}</Text>
      </View>
      <View style={{ alignItems: 'center', marginBottom: 13 }}>
        <Image
          source={benefit.img}
          style={styles.foodImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.foodCardTitle}>{benefit.title}</Text>
      <Text style={styles.foodCardDesc}>{benefit.description}</Text>
      <View style={styles.unlockBox}>
        <Text style={styles.unlockText}>
          Complete this step to unlock the next benefit.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.callButton}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <Text style={styles.callIcon}>
          {benefit.title === 'MVA ' ? '🌐' : '📞'}
        </Text>
        <Text style={styles.callButtonText}>{benefit.call}</Text>
      </TouchableOpacity>
      {benefit.title !== 'MVA' && (
        <Text style={styles.altDial}>Or dial: {benefit.phone}</Text>
      )}
    </View>
  );
};

const StepperCard = ({ benefits, userId }) => {
  const benefitKeys = Object.keys(benefits);
  const [activeBenefitKey, setActiveBenefitKey] = useState(
    benefitKeys[0] || '',
  );
  const [completedBenefits, setCompletedBenefits] = useState({});

  const handleBenefitClaim = async key => {
    setCompletedBenefits(prev => ({ ...prev, [key]: true }));

    const claimedOfferId = TAGS[key];

    const payload = {
      userId: userId,
      claimedOfferIds: [claimedOfferId],
    };

    console.log('📦 API Payload:', payload);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/users/abandoned-claim`,
        // 'http://10.0.2.2:9005/api/v1/users/abandoned-claim',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      console.log('✅ Claimed offer API response:', data);
    } catch (error) {
      console.error('❌ Error in claiming offer:', error);
    }

    const activeIndex = benefitKeys.indexOf(key);
    if (activeIndex < benefitKeys.length - 1) {
      setActiveBenefitKey(benefitKeys[activeIndex + 1]);
    }
  };

  return (
    <View style={styles.cardContainer}>
      {benefitKeys.map((key, index) => {
        const isActive = key === activeBenefitKey;
        const isUnlocked =
          index === 0 || completedBenefits[benefitKeys[index - 1]];

        return (
          <View key={key} style={{ marginBottom: 12 }}>
            <TouchableOpacity
              style={[
                isActive ? styles.stepActive : styles.stepInactive,
                { opacity: isUnlocked ? 1 : 0.4 },
              ]}
              disabled={!isUnlocked}
              onPress={() => setActiveBenefitKey(key)}
            >
              <View
                style={
                  isActive ? styles.stepNumberActive : styles.stepNumberInactive
                }
              >
                <Text
                  style={
                    isActive
                      ? styles.stepNumberActiveText
                      : styles.stepNumberInactiveText
                  }
                >
                  {index + 1}
                </Text>
              </View>
              <View style={{ marginLeft: 7, flex: 1 }}>
                <Text
                  style={
                    isActive ? styles.stepTitleActive : styles.stepTitleInactive
                  }
                >
                  {benefits[key].title}
                </Text>
                <Text
                  style={
                    isActive ? styles.stepSubtitle : styles.stepSubtitleInactive
                  }
                >
                  {benefits[key].badge}
                </Text>
              </View>
              {!isUnlocked && (
                <View style={styles.lockIconContainer}>
                  <LockIcon size={16} color="black" />
                </View>
              )}
            </TouchableOpacity>
            {(isActive || completedBenefits[key]) && isUnlocked && (
              <BenefitCard
                benefit={benefits[key]}
                onClaim={() => handleBenefitClaim(key)}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};
const CongratsScreen = ({ route }) => {
  const { fullName, tags = [], userId } = route.params || {};

  const getFilteredBenefits = () => {
    const filteredBenefits = {};
    if (tags.length === 0) return ALL_BENEFIT_CARDS;
    tags.forEach(tag => {
      if (ALL_BENEFIT_CARDS[tag]) {
        filteredBenefits[tag] = ALL_BENEFIT_CARDS[tag];
      }
    });
    return filteredBenefits;
  };

  const filteredBenefits = getFilteredBenefits();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={require('../assets/center.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.congratsCard}>
          <Text style={styles.congratsTitle}>
            Congratulations,{' '}
            <Text style={{ fontWeight: '900' }}>{fullName || 'User'}! 🎉</Text>
          </Text>
          <Text style={styles.description}>
            We've found that you immediately qualify for{' '}
            <Text style={styles.greenText}>these benefits</Text> worth thousands
            of dollars combined.
          </Text>
          <View style={styles.claimBox}>
            <Text style={styles.claimText}>
              Claim all of your {Object.keys(filteredBenefits).length} qualified
              benefits by calling on their official hotlines in{' '}
              <Text style={styles.boldText}>
                order. Each call takes ~3–5 minutes.
              </Text>
            </Text>
          </View>
        </View>

        <StepperCard benefits={filteredBenefits} userId={userId} />

        <View style={{ ...styles.noteContainer, alignItems: 'center' }}>
          <Text style={{ textAlign: 'center', ...styles.noteBody2 }}>
            Beware of other fraudulent & similar looking websites that might
            look exactly like ours, we have no affiliation with them. This is
            the only official website to claim your Benefits with the domain
            name mybenefitsai.org.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { backgroundColor: COLORS.black },
  logo: { width: 'auto', height: 60, marginRight: 10 },
  congratsCard: { marginHorizontal: 20, marginTop: 25 },
  congratsTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 7,
  },
  description: {
    color: '#000',
    fontSize: 18,
    marginBottom: 15,
    lineHeight: 24,
  },
  greenText: { fontWeight: '700', color: '#00a840' },
  claimBox: {
    backgroundColor: '#cbeed9',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  claimText: { fontSize: 14.5, color: '#000', lineHeight: 19 },
  boldText: { fontWeight: '900' },
  cardContainer: {
    backgroundColor: '#F7FFFA',
    borderRadius: 22,
    marginHorizontal: 18,
    marginVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 11,
    elevation: 5,
    padding: 12,
  },
  stepActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7FFF0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: '#24c492',
  },
  stepNumberActive: {
    backgroundColor: '#14cfa3',
    borderRadius: 99,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberActiveText: { color: '#fff', fontWeight: 'bold', fontSize: 19 },
  stepTitleActive: { fontWeight: 'bold', fontSize: 16, color: '#04884D' },
  stepSubtitle: { color: '#48a97e', fontSize: 12, fontWeight: '500' },
  stepInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderColor: '#ddd',
    borderWidth: 0.5,
    position: 'relative',
  },
  stepNumberInactive: {
    backgroundColor: '#14cfa3',
    borderRadius: 99,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberInactiveText: { color: '#fff', fontWeight: 'bold', fontSize: 19 },
  stepTitleInactive: { fontWeight: 'bold', fontSize: 15, color: '#314158' },
  stepSubtitleInactive: { color: '#314158', fontSize: 12, fontWeight: '500' },
  lockIconContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCard: {
    backgroundColor: '#fff',
    borderRadius: 23,
    marginTop: 10,
    padding: 19,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: '#009967',
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 8,
    marginTop: -20,
    zIndex: 9,
  },
  pillText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  foodImage: {
    height: 200,
    width: '100%',
    objectFit: 'contain',
  },
  foodCardTitle: {
    fontWeight: '900',
    fontSize: 28,
    color: '#00552c',
    marginBottom: 9,
    textAlign: 'center',
  },
  foodCardDesc: {
    fontSize: 17,
    lineHeight: 25,
    color: '#2c3c43',
    marginBottom: 15,
    textAlign: 'center',
  },
  unlockBox: {
    backgroundColor: '#e3fdef',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderColor: '#24c492',
    borderWidth: 0.5,
  },
  unlockText: { fontSize: 15, color: 'black' },
  callButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28b457',
    borderRadius: 30,
    paddingVertical: 16,
    marginBottom: 9,
  },
  callIcon: { fontSize: 23, color: 'white', marginRight: 8 },
  callButtonText: { color: 'white', fontSize: 18.5, fontWeight: 'bold' },
  altDial: { textAlign: 'center', fontSize: 14.5, color: '#516a5c' },
  noteContainer: { marginTop: 36, marginBottom: 40, paddingHorizontal: 30 },
  noteBody2: {
    marginTop: 15,
    color: '#111827',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default CongratsScreen;
