import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

import { ShoppingBag, CreditCard, Car, Ambulance } from 'lucide-react-native';

const ALL_BENEFIT_CARDS = {
  is_md: {
    title: 'Food Allowance Card',
    description:
      'Get thousands of dollars a year to spend on groceries, rent, prescriptions, and more.',
    img: require('../assets/card.png'),
    badge: 'Easiest To Claim',
    bgGradient: ['#015d54'],
    icon: <ShoppingBag color="#fff" size={24} />,
  },
  is_debt: {
    title: 'Credit Card Debt Relief',
    description:
      'Eligible for full debt relief under the new Emergency Debt Relief program.',
    img: require('../assets/benifit2.webp'),
    badge: 'Takes 10 Minutes Or More',
    bgGradient: ['#015d54'],
    icon: <CreditCard color="#fff" size={24} />,
  },
  is_auto: {
    title: 'Auto Insurance',
    description:
      'Qualify for a Discounted Auto Insurance Plan with comprehensive coverage.',
    img: require('../assets/benifit3.webp'),
    badge: 'Assured Monthly Savings!',
    bgGradient: ['#015d54'],
    icon: <Car color="#fff" size={24} />,
  },
  is_mva: {
    title: 'MVA',
    description:
      'Potentially eligible for 3x past compensation after a motor vehicle accident.',
    img: require('../assets/benifit4.webp'),
    badge: 'Could Be Worth $100,000+',
    bgGradient: ['#015d54'],
    icon: <Ambulance color="#fff" size={24} />,
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

const getBadgeColor = badge => {
  if (badge.includes('Easiest')) return '#E3F2FD';
  if (badge.includes('10 Minutes')) return '#FFF3E0';
  if (badge.includes('Savings')) return '#E8F5E9';
  return '#F3E5F5';
};

const getBadgeTextColor = badge => {
  if (badge.includes('Easiest')) return '#0D47A1';
  if (badge.includes('10 Minutes')) return '#E65100';
  if (badge.includes('Savings')) return '#2E7D32';
  return '#4A148C';
};

const BenefitArticle = ({
  title,
  description,
  img,
  badge,
  points,
  bgGradient,
  icon,
}) => (
  <View style={styles.card}>
    <View style={[styles.cardHeader, { backgroundColor: bgGradient[0] }]}>
      <View style={styles.cardIconContainer}>{icon}</View>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={[styles.badge, { backgroundColor: getBadgeColor(badge) }]}>
        <Text style={[styles.badgeText, { color: getBadgeTextColor(badge) }]}>
          {badge}
        </Text>
      </View>
    </View>
    <View style={styles.cardBody}>
      <Image source={img} style={styles.cardImage} />
      <Text style={styles.cardDesc}>{description}</Text>
      <Text style={styles.cardSubtitle}>Key Benefits</Text>
      <View style={styles.benefitsList}>
        {points.map((point, idx) => (
          <View key={idx} style={styles.benefitItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.benefitText}>{point}</Text>
          </View>
        ))}
      </View>
      <View style={styles.cardFooter}></View>
    </View>
  </View>
);

const BenefitBlogPage = () => (
  <ScrollView style={styles.container}>
    <Text style={styles.pageTitle}>Your Benefits Guide</Text>
    <Text style={styles.pageSubtitle}>
      Everything you need to know about your benefits—simple, clear, and
      practical.
    </Text>
    {Object.values(ALL_BENEFIT_CARDS).map((card, idx) => (
      <BenefitArticle
        key={idx}
        {...card}
        points={benefitExplanations[Object.keys(ALL_BENEFIT_CARDS)[idx]]}
      />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#636e72',
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: 'System',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#015d54',
    borderStyle: 'dashed',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cardIconContainer: {
    marginRight: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginRight: 12,
  },
  badge: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardBody: {
    padding: 20,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: '#f1f2f6',
  },
  cardDesc: {
    fontSize: 15,
    color: '#2d3436',
    marginBottom: 16,
    lineHeight: 22,
    fontFamily: 'System',
  },
  cardSubtitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 12,
    marginTop: 8,
  },
  benefitsList: {
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 18,
    color: '#636e72',
    marginRight: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#636e72',
    flex: 1,
    lineHeight: 20,
  },
  cardFooter: {
    height: 3,
    marginTop: 16,
    backgroundColor: '#dfe6e9',
    borderRadius: 3,
    opacity: 0.6,
  },
});

export default BenefitBlogPage;
