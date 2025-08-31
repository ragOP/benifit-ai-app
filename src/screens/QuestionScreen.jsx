import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

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

const initialMessages = [
  {
    id: 1,
    sender: 'bot',
    text: 'Congratulations on taking the first step toward claiming the benefits you rightfully deserve!',
  },
  {
    id: 2,
    sender: 'bot',
    text: "Let's just get to know you a little better, so I can help unlock all the benefits, subsidies, and allowances you might qualify for.",
  },
  {
    id: 3,
    sender: 'bot',
    text: "Tap the button below and we'll get started — it only takes a minute.",
    type: 'choice',
    options: ['Lets Start'],
  },
];

const delays = [500, 3500, 8000];

const localAvatar = require('../assets/bot.png');

const BubbleSVG = () => (
  <Svg
    viewBox="120 85 60 60"
    width={20}
    height={20}
    style={{
      position: 'absolute',
      left: -15,
      bottom: -1.6,
    }}
    fill="#ffffff"
  >
    <Path d="M 167 92 V 92 V 142 H 130 C 155 134 163 123 167 93" />
  </Svg>
);

const MessageBubble = ({ text, showAvatar, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const avatarScale = useRef(new Animated.Value(0.5)).current;
  const avatarOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 620,
        delay: index * 38,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 620,
        delay: index * 38,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 620,
        delay: index * 38,
        useNativeDriver: true,
      }),
      Animated.timing(avatarScale, {
        toValue: 1,
        duration: 495,
        delay: index * 38 + 133,
        useNativeDriver: true,
      }),
      Animated.timing(avatarOpacity, {
        toValue: 1,
        duration: 495,
        delay: index * 38 + 133,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.msgWrap,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.msgRow}>
        {showAvatar ? (
          <Animated.View
            style={[
              styles.avatarContainer,
              { transform: [{ scale: avatarScale }], opacity: avatarOpacity },
            ]}
          >
            <Image source={localAvatar} style={styles.avatar} />
          </Animated.View>
        ) : (
          <View
            style={[
              styles.avatarContainer,
              { width: 28, height: 28, marginRight: 10 },
            ]}
          />
        )}

        <View style={{ position: 'relative' }}>
          <BubbleSVG />
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{text}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const QuestionScreen = ({ navigation }) => {
  const [chat, setChat] = useState([]);
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timers = [];
    initialMessages.forEach((msg, index) => {
      const t = setTimeout(() => {
        setChat(prev => [...prev, msg]);
      }, delays[index]);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

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

  const onStart = () => {
    navigation.navigate('Form');
  };

  const thirdShown = chat.some(m => m.id === 3);

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
        <View style={styles.ribbonWrap}>
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>
              22,578 Americans Helped In Last 24 Hours!
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>AVERAGE BENEFITS: </Text>
            <Text style={styles.pillText}>$2500+ </Text>
          </View>
        </View>
        <View style={styles.chatArea}>
          {chat.map((m, index) => {
            const showAvatar = index === chat.length - 1;
            return (
              <MessageBubble key={m.id} text={m.text} showAvatar={showAvatar} />
            );
          })}
          {thirdShown && (
            <View style={styles.ctaWrap}>
              <TouchableOpacity
                style={[styles.ctaBtn, styles.ctaBtnLeft]}
                onPress={onStart}
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
                <Text style={styles.ctaText}>Lets Start</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { backgroundColor: COLORS.black },
  logo: { width: 'auto', height: 60, marginRight: 10 },
  ribbonWrap: {},
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
    fontSize: 12,
    fontWeight: '600',
  },
  content: { paddingHorizontal: 30, paddingTop: 18 },
  pill: {
    backgroundColor: COLORS.pill,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 24,
    marginBottom: 16,
    flexDirection: 'row',
  },
  pillText: {
    color: COLORS.white,
    fontWeight: '800',
    letterSpacing: 0.4,
    fontSize: 13,
  },
  chatArea: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  msgWrap: { marginTop: 14 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-start' },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    marginTop: 6,
    overflow: 'hidden',
    marginTop: 'auto',
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
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bubble: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 14,
    maxWidth: '88%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  bubbleText: { color: COLORS.text, fontSize: 15.5, lineHeight: 22 },
  ctaWrap: { marginTop: 18 },
  ctaBtn: {
    backgroundColor: COLORS.teal,
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 8,
    elevation: 2,
  },
  ctaBtnLeft: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
  },
  ctaText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});

export default QuestionScreen;
