import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

const ALL_BENEFIT_CARDS = {
  is_md: {
    title: 'Food Allowance Card',
    description:
      'Get thousands of dollars a year to spend on groceries, rent, prescriptions, and more.',
    img: require('../assets/card.png'),
    badge: 'Easiest To Claim',
  },
  is_debt: {
    title: 'Credit Card Debt Relief',
    description:
      'Eligible for full debt relief under the new Emergency Debt Relief program.',
    img: require('../assets/benifit2.webp'),
    badge: 'Takes 10 Minutes Or More',
  },
  is_auto: {
    title: 'Auto Insurance',
    description:
      'Qualify for a Discounted Auto Insurance Plan with comprehensive coverage.',
    img: require('../assets/benifit3.webp'),
    badge: 'Assured Monthly Savings!',
  },
  is_mva: {
    title: 'MVA',
    description:
      'Potentially eligible for 3x past compensation after a motor vehicle accident.',
    img: require('../assets/benifit4.webp'),
    badge: 'Could Be Worth $100,000+',
  },
};

const benefitExplanations = {
  is_md: [
    'The Food Allowance Card is designed to make everyday essentials more affordable for you.',
    'Use it at grocery stores, pharmacies, and even for rent payments.',
    'No extra paperwork—easy to apply and quick to start using.',
    'Ideal for families, students, and anyone looking to stretch their budget further.',
  ],
  is_debt: [
    'Struggling with credit card bills? The new Emergency Debt Relief program may offer you a fresh start.',
    'Eligible applicants can have their debt lowered significantly or even eliminated.',
    'The application is straightforward, and you can get a decision in minutes.',
    'This program is particularly helpful for those facing unexpected job loss or medical expenses.',
  ],
  is_auto: [
    'Everyone wants to save on car insurance. With the Discounted Auto Insurance Plan, you get comprehensive coverage at a lower cost.',
    'Whether you drive an old car or a new one, you can qualify for savings.',
    'You’ll have peace of mind knowing you’re protected without overspending.',
    'Best for drivers of all kinds—from commuters to families with multiple vehicles.',
  ],
  is_mva: [
    'If you’ve been in a motor vehicle accident, you may be eligible for much higher compensation than you expected.',
    'Recent changes in the law mean most people are gaining three times their previous payouts.',
    'Claims are processed quickly, and settlements are often life-changing.',
    'This benefit is especially valuable for those recovering from injuries or facing long-term recovery.',
  ],
};
const COLORS = {
  black: '#000',
  lightText: '#666',
  cardBG: '#fff',
  badgeBG: '#e6f7e6',
  badgeBorder: '#d4e8d4',
  headerBG: '#f8f8f8',
  errorRed: '#c0392b',
  subtitleText: '#1a1a1a',
  descriptionText: '#444',
  bulletTextColor: '#4b4b4b',
};

export default function BlogDetailScreen({ route, navigation }) {
  const { benefit } = route.params || {};
  const card = ALL_BENEFIT_CARDS[benefit];
  const benefitsList = benefitExplanations[benefit] || [];

  if (!card) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={styles.errorText}>Benefit details not found.</Text>
        <Text style={styles.errorSubText}>
          Please try again or choose another benefit.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cardBG }}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#FFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <Image
            source={require('../assets/center.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image source={card.img} style={styles.bigImage} />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.bigTitle}>{card.title}</Text>
          {card.badge && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{card.badge}</Text>
            </View>
          )}
        </View>

        <Text style={styles.subtitle}>What is this benefit?</Text>
        <Text style={styles.description}>{card.description}</Text>

        <View style={styles.bulletList}>
          {benefitsList.map((item, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBG,
  },
  safe: {
    backgroundColor: COLORS.headerBG,
  },
  header: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  logo: {
    width: '100%',
    height: 60,
    marginRight: 10,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 30,
    zIndex: 1,
  },
  imageContainer: {
    marginTop: 16,
    marginHorizontal: 24,

    borderRadius: 12,
    overflow: 'hidden',
  },
  bigImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  titleContainer: {
    marginHorizontal: 24,
    marginTop: 32,
    gap: 12,
  },
  bigTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  badgeContainer: {
    backgroundColor: COLORS.badgeBG,
    borderWidth: 1,
    borderColor: COLORS.badgeBorder,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    color: '#0a6e0a',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.subtitleText,
    marginTop: 32,
    marginBottom: 12,
    marginHorizontal: 24,
  },
  description: {
    fontSize: 17,
    color: COLORS.descriptionText,
    lineHeight: 26,
    letterSpacing: -0.2,
    marginBottom: 24,
    marginHorizontal: 24,
  },
  bulletList: {
    marginHorizontal: 24,
    marginTop: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    color: COLORS.bulletTextColor,
    fontSize: 18,
    paddingRight: 10,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.bulletTextColor,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  errorText: {
    color: COLORS.errorRed,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
  },
  errorSubText: {
    color: '#555',
    fontSize: 15,
  },
});
