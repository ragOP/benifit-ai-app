import { Check } from 'lucide-react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  Keyboard,
} from 'react-native';

const COLORS = {
  black: '#000000',
  dark: '#0c1a17',
  bg: '#f6f7f2',
  white: '#ffffff',
  teal: '#015d54',
  tealDark: '#0a6a5c',
  text: '#121517',
  pill: '#0f0f10',
  green: '#177876',
};

const TAGS = {
  medicare: 'is_md',
  ssdi: 'is_ssdi',
  auto: 'is_auto',
  mva: 'is_mva',
  debt: 'is_debt',
  mortgage: 'is_rvm',
};

const questions = [
  {
    id: 1,
    text: "What's your full name?",
    type: 'text',
    keyType: 'alphabet',
  },
  {
    id: 2,
    text: 'Okay, what is your age today?',
    type: 'text',
    keyType: 'numeric',
  },
  {
    id: 3,
    text: "Nice, and what's your zip code?",
    type: 'text',
    keyType: 'numeric',
  },
  {
    id: 5,
    text: 'Please enter your 10-digit phone number below:',
    type: 'text',
    keyType: 'numeric',
  },
  { id: 6, text: 'Thank you', type: 'info' },
  {
    id: 7,
    text: 'Now, are you on medicare?',
    type: 'choice',
    options: ['Yes', 'No'],
    tag: TAGS.medicare,
  },
  {
    id: 8,
    text: 'Do you have any of the mentioned health conditions?',
    type: 'choice',
    options: ['Alzheimers', 'Diabetes', 'Hypertension', 'Arthritis', 'No'],
    tag: TAGS.ssdi,
  },
  {
    id: 9,
    text: 'Do you own your home or rent?',
    type: 'choice',
    options: ['I Own', 'I Rent'],
    tag: TAGS.mortgage,
  },
  { id: 10, text: "Great, We're almost there!", type: 'info' },
  {
    id: 11,
    text: 'Do you have a car that you drive at least once a week?',
    type: 'choice',
    options: ['Yes', 'No'],
    tag: TAGS.auto,
  },
  {
    id: 12,
    text: 'Have you faced any motor vehicle accidents in the last 2 years?',
    type: 'choice',
    options: ['Yes', 'No'],
    tag: TAGS.mva,
  },
  {
    id: 13,
    text: "Alright, we're almost done.",
    type: 'info',
  },
  {
    id: 14,
    text: 'Do you have any children between the age of 18-64?',
    type: 'choice',
    options: ['Yes', 'No'],
  },
  {
    id: 15,
    text: 'Okay, and do you have a credit card debt of $10,000 or more?',
    type: 'choice',
    options: ['Yes', 'No'],
    tag: TAGS.debt,
  },
  {
    id: 16,
    text: 'I got it, Just one last question!',
    type: 'info',
  },
  {
    id: 17,
    text: 'Do you exercise at least once a week?',
    type: 'choice',
    options: ['Yes', 'No'],
  },
];

const infoDelay = 1000;
const inputAnimDuration = 400;
const messageAnimDuration = 900;

const AnimatedBubble = ({ isBot, text, showAvatar, children }) => {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const dotBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 1,
          duration: messageAnimDuration,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    if (text === '...') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotBounce, {
            toValue: -4,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dotBounce, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      dotBounce.setValue(0);
    }
  }, [text]);

  return (
    <Animated.View
      style={[
        isBot ? styles.botBubbleWrap : styles.userBubbleWrap,
        { opacity: fade, transform: [{ scale }] },
      ]}
    >
      {isBot && (
        <View style={styles.botAvatar}>
          {showAvatar && (
            <Image
              source={{
                uri: 'https://randomuser.me/api/portraits/women/44.jpg',
              }}
              style={styles.avatar}
            />
          )}
        </View>
      )}
      <View style={isBot ? styles.botBubble : styles.userBubble}>
        {text === '...' ? (
          <Animated.View style={{ transform: [{ translateY: dotBounce }] }}>
            <Text style={isBot ? styles.botText : styles.userText}>...</Text>
          </Animated.View>
        ) : (
          <Text style={isBot ? styles.botText : styles.userText}>{text}</Text>
        )}
        {children}
      </View>
    </Animated.View>
  );
};

export default function FormQuestion({ navigation }) {
  const [chat, setChat] = useState([
    { from: 'bot', text: questions[0].text, qid: 0 },
  ]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [answers, setAnswers] = useState({});

  const inputAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef();
  const handleFinalAnswers = async allAnswers => {
    const tags = [];
    if (allAnswers['Now, are you on medicare?'] === 'Yes')
      tags.push(TAGS.medicare);
    if (
      allAnswers['Do you have any of the mentioned health conditions?'] !== 'No'
    )
      tags.push(TAGS.ssdi);
    if (allAnswers['Do you own your home or rent?'] === 'I Own')
      tags.push(TAGS.mortgage);
    if (
      allAnswers['Do you have a car that you drive at least once a week?'] ===
      'Yes'
    )
      tags.push(TAGS.auto);
    if (
      allAnswers[
        'Have you faced any motor vehicle accidents in the last 2 years?'
      ] === 'Yes'
    )
      tags.push(TAGS.mva);
    if (
      allAnswers[
        'Okay, and do you have a credit card debt of $10,000 or more?'
      ] === 'Yes'
    )
      tags.push(TAGS.debt);
    const fullName = allAnswers["What's your full name?"];
    const payload = {
      user_id: 'tempUserId',
      fullName,
      age: allAnswers['Okay, what is your age today?'],
      zipcode: allAnswers["Nice, and what's your zip code?"],
      tags: tags || [],
      origin: `6-${'utmCampaign'}`,
      sendMessageOn: 'SMS',
      number: allAnswers['Please enter your 10-digit phone number below:'],
      consentAgreed: true,
    };
    // console.log('Final Payload:', payload);

    try {
      const res = await fetch(
        'https://benifit-gpt-be.onrender.com/response/create',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      // console.log(' Successfully submitted:', data);
      // console.log('Navigating to Middle with:', { fullName, tags });
      navigation.navigate('Middle', { fullName, tags });
      setAllDone(true);
    } catch (err) {
      console.error(' Error submitting chatbot answers:', err);
    }
  };

  const showInput = useCallback(() => {
    setInputVisible(true);
    Animated.timing(inputAnim, {
      toValue: 1,
      duration: inputAnimDuration,
      useNativeDriver: true,
    }).start();
  }, [inputAnim]);

  const hideInput = useCallback(() => {
    Animated.timing(inputAnim, {
      toValue: 0,
      duration: inputAnimDuration / 2,
      useNativeDriver: true,
    }).start(() => setInputVisible(false));
  }, [inputAnim]);

  const nextQuestion = useCallback(oldIndex => {
    let idx = oldIndex + 1;
    const q = questions[idx];
    if (!q) {
      setAllDone(true);
      return;
    }

    setShowTyping(true);

    setTimeout(() => {
      setShowTyping(false);
      setTimeout(() => {
        setChat(prev => [...prev, { from: 'bot', text: q.text, qid: idx }]);
        setCurrent(idx);
      }, 500);
    }, messageAnimDuration);
  }, []);

  useEffect(() => {
    const q = questions[current];
    if (!q || allDone) return;

    if (q.type === 'choice' || q.type === 'text') {
      setTimeout(() => showInput(), messageAnimDuration + 80);
    } else if (q.type === 'info') {
      setInputVisible(false);
      setTimeout(() => nextQuestion(current), infoDelay);
    }
  }, [current, showInput, nextQuestion, allDone]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 900);
  }, [chat, inputVisible, showTyping]);

  const validatePincode = pincode => /^\d{5,6}$/.test(pincode);
  const validatePhone = val => /^\d{10}$/.test((val || '').trim());

  const onSend = useCallback(
    answer => {
      if ((answer === undefined || answer === null) && input.trim() === '')
        return;

      const response = answer !== undefined ? answer : input.trim();

      // Validation for pincode and phone number fields
      if (questions[current].text.includes('zip code')) {
        if (!validatePincode(response)) {
          alert('Please enter a valid 5 or 6 digit zip code.');
          return;
        }
      }
      if (questions[current].text.includes('phone number')) {
        if (!validatePhone(response)) {
          alert('Please enter a valid 10-digit phone number.');
          return;
        }
      }

      setChat(prev => [...prev, { from: 'user', text: response }]);

      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questions[current].text]: response,
      }));

      setInput('');
      hideInput();

      setTimeout(() => nextQuestion(current), messageAnimDuration / 1.1);
    },
    [input, current, nextQuestion],
  );

  useEffect(() => {
    if (allDone) {
      console.log('All done, calling handleFinalAnswers');
      handleFinalAnswers(answers);
    }
  }, [allDone, answers]);
  const lastBotIndex = (() => {
    for (let i = chat.length - 1; i >= 0; --i) {
      if (chat[i].from === 'bot') return i;
    }
    return -1;
  })();

  const q = questions[current];

  const renderInput = () => {
    if (!inputVisible || !q) return null;
    if (q.type === 'text') {
      return (
        <Animated.View style={[styles.inlineInputWrap, { opacity: inputAnim }]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            keyboardType={q.keyType === 'numeric' ? 'numeric' : 'default'}
            placeholder="Type your message..."
            onSubmitEditing={() => onSend()}
            placeholderTextColor="#bbb"
            autoFocus
          />
          <TouchableOpacity style={styles.checkBtn} onPress={() => onSend()}>
            <Check size={18} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      );
    }
    if (q.type === 'choice') {
      return (
        <Animated.View style={[styles.optionsWrap, { opacity: inputAnim }]}>
          {q.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionBtn}
              onPress={() => onSend(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      );
    }
    return null;
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.teal} />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        onTouchStart={() => Keyboard.dismiss()}
      >
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
        <View style={styles.chatWrap}>
          {chat.map((msg, i) =>
            msg.from === 'bot' ? (
              <AnimatedBubble
                key={i}
                isBot={true}
                showAvatar={i === lastBotIndex && !allDone}
                text={msg.text}
              />
            ) : (
              <AnimatedBubble
                key={i}
                isBot={false}
                showAvatar={false}
                text={msg.text}
              />
            ),
          )}
          {showTyping && (
            <AnimatedBubble isBot={true} showAvatar={true} text="..." />
          )}
          {allDone ? (
            <View style={{ paddingTop: 30, paddingHorizontal: 20 }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  color: COLORS.text,
                  fontWeight: '600',
                }}
              >
              </Text>
            </View>
          ) : (
            renderInput()
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { backgroundColor: COLORS.black, paddingTop: '12%' },
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
    fontSize: 16,
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
    fontSize: 16,
  },
  chatWrap: { paddingTop: 10, paddingHorizontal: 25 },
  botBubbleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  botAvatar: { marginRight: 7, marginTop: 'auto' },
  botBubble: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 13,
    maxWidth: '85%',
    borderBottomLeftRadius: 0,
    shadowColor: COLORS.teal,
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
  botText: { color: COLORS.text, fontSize: 17, fontWeight: '400' },
  userBubbleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: COLORS.teal,
    borderRadius: 18,
    padding: 13,
    maxWidth: '76%',
    borderTopRightRadius: 0,
  },
  userText: { color: COLORS.white, fontSize: 17, fontWeight: '500' },
  userAvatar: {
    backgroundColor: COLORS.tealDark,
    borderRadius: 16,
    width: 32,
    height: 32,
    marginLeft: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitials: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  inlineInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    fontSize: 17,
    height: 45,
    borderColor: '#07816b',
    borderWidth: 1,
  },

  checkBtn: {
    backgroundColor: COLORS.teal,
    borderRadius: 28,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 20,
    marginBottom: 24,
    gap: 10,
  },
  optionBtn: {
    backgroundColor: COLORS.teal,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    borderWidth: 0,
    alignItems: 'center',
  },
  optionText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
