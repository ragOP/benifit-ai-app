import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Dimensions,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
const { width } = Dimensions.get('window');

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
  green: '#10b981',
  white: '#fff',
};

export default function BlogDetailScreen({ route, navigation }) {
  const { benefit } = route.params || {};
  const card = ALL_BENEFIT_CARDS[benefit];
  const benefitsList = benefitExplanations[benefit] || [];

  const shimmerAnimation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };
    shimmer();
  }, [shimmerAnimation]);

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
          <Text style={styles.headerTitle}>{card.title}</Text>
        </View>
      </SafeAreaView>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
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

        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionIconText}>💡</Text>
            </View>
            <Text style={styles.subtitle}>What is this benefit?</Text>
          </View>

          <View style={styles.descriptionCard}>
            <Text style={styles.description}>{card.description}</Text>
          </View>
        </View>

        <View style={styles.benefitsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionIconText}>✨</Text>
            </View>
            <Text style={styles.subtitle}>Key Benefits</Text>
          </View>

          <View style={styles.benefitsCard}>
            {benefitsList.map((item, idx) => (
              <View key={idx} style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Text style={styles.benefitIconText}>✓</Text>
                </View>
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.claimButton}
            activeOpacity={0.9}
            onPress={() => Linking.openURL('tel:+1234567890')}
          >
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [
                    {
                      translateX: shimmerAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-width, width],
                      }),
                    },
                    { rotate: '13deg' },
                  ],
                },
              ]}
            />
            <View style={styles.claimButtonContent}>
              <Text style={styles.claimText}>Call Now</Text>
            </View>
          </TouchableOpacity>
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
    backgroundColor: COLORS.black,
  },
  header: {
    backgroundColor: 'black',
    paddingVertical: 16,
    paddingHorizontal: 10,
    gap: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  imageContainer: {
    padding: 10,
  },
  bigImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  titleContainer: {
    marginHorizontal: 24,
    paddingTop: 10,
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
  contentSection: {
    marginHorizontal: 24,
    marginTop: 32,
    marginBottom: 24,
  },
  benefitsSection: {
    marginHorizontal: 24,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionIconText: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.subtitleText,
    flex: 1,
  },
  descriptionCard: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  description: {
    fontSize: 17,
    color: COLORS.descriptionText,
    lineHeight: 28,
    letterSpacing: -0.2,
    textAlign: 'left',
  },
  benefitsCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  benefitIconText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.bulletTextColor,
    lineHeight: 24,
    letterSpacing: -0.2,
    fontWeight: '500',
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
  claimButton: {
    marginTop: 22,
    width: '100%',
    backgroundColor: COLORS.green,
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  claimText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 19,
    letterSpacing: 0.2,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '5%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
    zIndex: 0,
  },
});
