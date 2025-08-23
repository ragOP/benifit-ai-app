// components/TestimonialSlider.js
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');

const testimonials = [
  {
    id: '1',
    text: `"I was juggling bills and didn't think I'd qualify for anything, but MyBenefits AI found me $2,100 in food and medical benefits in literally 60 seconds. The report was awesome, and claiming was a breeze. Now my sister and parents are using it too—total game-changer! 😊"`,
    name: 'Sarah Thompson',
    detail: '42, Houston, TX',
    avatar: require('../assets/sarah.jpg'),
  },
  {
    id: '2',
    text: `"I'm not tech-savvy, but MyBenefits AI was so easy to use. It instantly showed me debt relief and healthcare benefits I was owed. Best $1 I've ever spent! I claimed everything in minutes, and now my buddies are all on board, claiming their benefits too."`,
    name: 'Michael Rodriguez',
    detail: '58, Miami, FL',
    avatar: require('../assets/mike.jpg'),
  },
  {
    id: '3',
    text: `"Being a single mom, I'm always stretched thin. MyBenefits AI uncovered $1,900 in food assistance I almost missed out on. The report was clear, and the process to claim was super smooth. I've told all my friends, and they're signing up now. Thank you, MyBenefits AI!"`,
    name: 'Emily Carter',
    detail: '35, Columbus, OH',
    avatar: require('../assets/emi.jpg'),
  },
  {
    id: '4',
    text: `"Retirement's been tough, but MyBenefits AI found medical benefits I didn't know about in under a minute. It was instant, and the claims were a breeze to submit. My wife and I are so grateful, and we've spread the word to our whole retirement group."`,
    name: 'James Wilson',
    detail: '67, Raleigh, NC',
    avatar: require('../assets/james.jpg'),
  },
];

const TestimonialSlider = () => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % testimonials.length;
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={[styles.card, { width: width - 50 }]}>
      <Text style={styles.text}>{item.text}</Text>
      <View style={styles.footer}>
        <Image source={item.avatar} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}>{item.detail}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={testimonials}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onMomentumScrollEnd={e => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / (width - 50),
          );
          setCurrentIndex(index);
        }}
      />
      <View style={styles.pagination}>
        {testimonials.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default TestimonialSlider;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    marginHorizontal: 10,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 23,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  name: {
    fontWeight: '700',
    fontSize: 15,
    color: '#111',
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 14,
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dotInactive: {
    backgroundColor: '#d1d5db',
  },
  dotActive: {
    backgroundColor: '#015d54',
    width: 11,
    height: 11,
  },
});
