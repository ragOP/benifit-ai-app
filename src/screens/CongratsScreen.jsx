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
} from 'react-native';
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
const BENEFIT_CARDS = {
  Medicare: {
    title: 'Food Allowance Card',
    description:
      'This food allowance card gives you thousands of dollars a year to spend on groceries, rent, prescriptions, etc.',
    img: require('../assets/card.png'),
    badge: 'Easiest To Claim',
    phone: '+18333381762',
    call: 'CALL (323) 689-7861',
  },
  Debt: {
    title: 'Credit Card Debt Relief',
    description:
      'You are eligible to get all your debt relieved under the new Emergency Debt Relief program.',
    img: require('../assets/benifit2.webp'),
    badge: 'Takes 10 Minutes Or More',
    phone: '+18333402442',
    call: 'CALL (833) 340-2442',
  },
  Auto: {
    title: 'Auto Insurance',
    description:
      "You're eligible for a Discounted Auto Insurance Plan with all the coverage.",
    img: require('../assets/benifit3.webp'),
    badge: 'Assured Monthly Savings!',
    phone: '+16197753027',
    call: 'CALL (619) 775-3027',
  },
  MVA: {
    title: 'MVA',
    description:
      'You might be eligible for a higher compensation. Most people get 3x of their past compensations.',
    img: require('../assets/benifit4.webp'),
    badge: 'Could Be Worth $100,000+',
    phone: 'https://www.roadwayrelief.com/get-quote-am/',
    call: 'CLICK HERE TO PROCEED',
  },
};
const BenefitCard = ({ benefit }) => {
  const handlePress = () => {
    if (benefit.title === 'MVA') {
      Linking.openURL(benefit.phone);
    } else {
      const phoneNumber = benefit.phone.replace(/[^0-9+]/g, '');
      Linking.openURL(`tel:${phoneNumber}`);
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
      <TouchableOpacity style={styles.callButton} onPress={handlePress}>
        <Text style={styles.callIcon}>
          {benefit.title === 'MVA' ? '🌐' : '📞'}
        </Text>
        <Text style={styles.callButtonText}>{benefit.call}</Text>
      </TouchableOpacity>
      {benefit.title !== 'MVA' && (
        <Text style={styles.altDial}>Or dial: {benefit.phone}</Text>
      )}
    </View>
  );
};

const StepperCard = ({ benefits }) => {
  const [activeBenefitKey, setActiveBenefitKey] = useState('Medicare');
  const activeBenefit = benefits[activeBenefitKey];
  const benefitKeys = Object.keys(benefits);

  return (
    <View style={styles.cardContainer}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.topStepper}
        showsHorizontalScrollIndicator={false}
      >
        {benefitKeys.map(key => {
          const isActive = key === activeBenefitKey;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveBenefitKey(key)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  isActive ? styles.stepActive : styles.stepInactive,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 7,
                    borderRadius: 12,
                    marginRight: 8,
                  },
                ]}
              >
                <View
                  style={[
                    isActive
                      ? styles.stepNumberActive
                      : styles.stepNumberInactive,
                    { marginRight: 2 },
                  ]}
                >
                  <Text
                    style={
                      isActive
                        ? styles.stepNumberActiveText
                        : styles.stepNumberInactiveText
                    }
                  >
                    {benefitKeys.indexOf(key) + 1}
                  </Text>
                </View>
                <View style={{ marginLeft: 7 }}>
                  <Text
                    style={
                      isActive
                        ? styles.stepTitleActive
                        : styles.stepTitleInactive
                    }
                  >
                    {benefits[key].title}
                  </Text>
                  <Text
                    style={
                      isActive
                        ? styles.stepSubtitle
                        : styles.stepSubtitleInactive
                    }
                  >
                    {benefits[key].badge}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <BenefitCard benefit={activeBenefit} />
    </View>
  );
};

const CongratsScreen = () => {
  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.teal} />
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
            <Text style={{ fontWeight: '900' }}>Test NАmе! 🎉</Text>
          </Text>
          <Text style={styles.description}>
            We've found that you immediately qualify for{' '}
            <Text style={styles.greenText}>these benefits</Text> worth thousands
            of dollars combined.
          </Text>
          <View style={styles.claimBox}>
            <Text style={styles.claimText}>
              Claim all of your benefits by calling on their official hotlines
              in{' '}
              <Text style={styles.boldText}>
                order. Each call takes ~3–5 minutes.
              </Text>
            </Text>
          </View>
        </View>
        <StepperCard benefits={BENEFIT_CARDS} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    backgroundColor: COLORS.black,
    paddingTop: '12%',
  },
  logo: {
    width: 'auto',
    height: 60,
    marginRight: 10,
  },
  congratsCard: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  congratsTitle: {
    fontSize: 29,
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
  greenText: {
    fontWeight: '700',
    color: '#00a840',
  },
  claimBox: {
    backgroundColor: '#cbeed9',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  claimText: {
    fontSize: 14.5,
    color: '#000',
    lineHeight: 19,
  },
  boldText: {
    fontWeight: '900',
  },

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
    paddingTop: 13,
    paddingBottom: 12,
    padding: 12,
  },
  topStepper: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginBottom: 6,
  },
  stepActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7FFF0',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: '#24c492',
    marginRight: 9,
  },
  stepNumberActive: {
    backgroundColor: '#14cfa3',
    borderRadius: 99,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  stepNumberActiveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
  },
  stepTitleActive: {
    fontWeight: 'bold',
    fontSize: 15.6,
    color: '#04884D',
  },
  stepSubtitle: {
    color: '#48a97e',
    fontSize: 11.7,
    fontWeight: '500',
  },
  stepInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF2F6',
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginRight: 9,
  },
  stepNumberInactive: {
    backgroundColor: '#CBD6DD',
    borderRadius: 99,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  stepNumberInactiveText: {
    color: '#8291A4',
    fontWeight: 'bold',
    fontSize: 19,
  },
  stepTitleInactive: {
    fontWeight: 'bold',
    fontSize: 15.6,
    color: '#A6B6C2',
  },
  stepSubtitleInactive: {
    color: '#A6B6C2',
    fontSize: 11.7,
    fontWeight: '500',
  },
  innerCard: {
    backgroundColor: '#fff',
    borderRadius: 23,
    marginTop: 6,
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
  pillText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
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
  unlockText: {
    fontSize: 15,
    color: 'black',
  },
  callButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24b375',
    borderRadius: 30,
    paddingVertical: 16,
    marginBottom: 9,
  },
  callIcon: {
    fontSize: 23,
    color: 'white',
    marginRight: 8,
  },
  callButtonText: {
    color: 'white',
    fontSize: 18.5,
    fontWeight: 'bold',
  },
  altDial: {
    textAlign: 'center',
    fontSize: 14.5,
    color: '#516a5c',
  },
});

export default CongratsScreen;
