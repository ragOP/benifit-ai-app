import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const DATA = [
  {
    id: '1',
    badge: 'Easiest To Claim',
    title: 'Food Allowance',
    image: require('../assets/card.png'),
    benefitKey: 'is_md',
  },
  {
    id: '2',
    badge: 'Takes 10 Minutes Or More',
    title: 'Credit Card Debt Relief',
    image: require('../assets/benifit2.webp'),
    benefitKey: 'is_debt',
  },
  {
    id: '3',
    badge: 'Assured Monthly Savings!',
    title: 'Auto Insurance',
    image: require('../assets/benifit3.webp'),
    benefitKey: 'is_auto',
  },
  {
    id: '4',
    badge: 'Could Be Worth $100,000+',
    title: 'MVA',
    image: require('../assets/benifit4.webp'),
    benefitKey: 'is_mva',
  },
];

const CardItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImg} />
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.badge && <Text style={styles.cardBadge}>{item.badge}</Text>}
      </View>
      <ChevronRight
        color="#727b8c"
        width={24}
        height={24}
        style={styles.chevronIcon}
      />
    </View>
  </TouchableOpacity>
);

export default function BenefitBlogPage() {
  const navigation = useNavigation(); 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#042677" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.pageTitle}>Your Benefits Guide</Text>
          <Text style={styles.pageSubtitle}>
            Everything you need to know about your benefits—simple, clear, and
            practical.
          </Text>
        </View>

        <View style={[styles.bgShape, { top: 40, left: 26 }]} />
        <View style={[styles.bgQuarter, { top: 120, left: 150 }]} />
        <View
          style={[
            styles.bgQuarter,
            { top: 90, right: 28, transform: [{ rotate: '160deg' }] },
          ]}
        />
        <View
          style={[
            styles.bgShape,
            { bottom: 30, right: 30, transform: [{ rotate: '200deg' }] },
          ]}
        />
      </View>

      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CardItem
            item={item}
            onPress={() =>
              navigation.navigate('BlogDetailScreen', {
                benefit: item.benefitKey,
              })
            }
          />
        )}
        contentContainerStyle={{
          paddingBottom: 30,
          paddingTop: 16,
          paddingHorizontal: 14,
        }}
      />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  header: {
    height: 200,
    backgroundColor: '#0a2003',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  pageSubtitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    maxWidth: 300,
    opacity: 0.9,
    lineHeight: 22,
  },
  bgShape: {
    position: 'absolute',
    width: 72,
    height: 72,
    backgroundColor: '#244f1d',
    borderRadius: 36,
    opacity: 0.3,
  },
  bgQuarter: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#244f1d',
    borderTopLeftRadius: 40,
    opacity: 0.35,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 24,
  },
  postedOn: {
    color: '#17223b',
    fontSize: 17,
    fontWeight: '400',
  },
  calendarIcon: {
    fontSize: 22,
    marginLeft: 8,
    marginTop: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 13,
    marginBottom: 17,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#212121',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  cardImg: {
    width: 78,
    height: 78,
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: '#dbdbdb',
    resizeMode: 'contain',
  },
  cardText: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202b56',
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 14,
    color: '#727b8c',
    fontWeight: '400',
  },
  cardBadge: {
    fontSize: 12,
    marginTop: 4,
    color: '#099f34',
    backgroundColor: '#e7f8e9',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    overflow: 'hidden',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  chevronIcon: {
    alignSelf: 'center',
    marginLeft: 8,
  },
});
