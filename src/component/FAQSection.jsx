// FAQSection.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQSection = ({ items = [], initiallyOpenId = null, title = 'FAQ' }) => {
  const [openId, setOpenId] = useState(initiallyOpenId);
  const data = items.length ? items : DEFAULT_ITEMS;

  const toggle = id => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data.map(item => {
        const expanded = openId === item.id;
        return (
          <View
            key={item.id}
            style={[styles.card, expanded && styles.cardOpen]}
          >
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.85}
              onPress={() => toggle(item.id)}
              accessibilityRole="button"
              accessibilityState={{ expanded }}
            >
              <Text style={styles.question}>{item.question}</Text>
              {expanded ? (
                <ChevronUp size={22} color="#0F766E" strokeWidth={2.5} />
              ) : (
                <ChevronDown size={22} color="#0F766E" strokeWidth={2.5} />
              )}
            </TouchableOpacity>

            {expanded && item.answer ? (
              <View style={styles.answerWrap}>
                <Text style={styles.answer}>{item.answer}</Text>
              </View>
            ) : null}
          </View>
        );
      })}

      <View style={styles.noteContainer}>
        <Text>
          <Text style={styles.noteStrong}>NOTE: </Text>
          <Text style={styles.noteBody}>
            We don't spam OR sell information & we aren't affiliated with any
            gov. branch. We are not sponsored by any External Private
            Organisation.
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default FAQSection;

const DEFAULT_ITEMS = [
  {
    id: 'why-dollar',
    question: 'Why is there a $1 charge?',
    answer:
      'The $1 charge helps verify real users, reduce spam, and support the cost of keeping this platform running. It also gives you lifetime access to your report and updates. If you don’t qualify for any benefit, it’s fully refundable.',
  },
  {
    id: 'govt',
    question: 'Is this a government website?',
    answer:
      'No. We’re an independent service that helps seniors easily check what programs they may qualify for. All listed programs are legitimate and widely available.',
  },
  {
    id: 'benefits',
    question: 'What kind of benefits can I expect?',
    answer:
      'Depending on your answers, you may see programs like food cards, healthcare savings, accident compensation, debt relief options, and other senior support programs.',
  },
  {
    id: 'report-time',
    question: 'How long will it take to receive my benefits report?',
    answe:
      'Your report is generated instantly using AI, right after you complete the check. You’ll get it sent to your email within seconds. It’s fast, secure, and ready when you are.',
  },
  {
    id: 'safe',
    question: 'Is my information safe?',
    answer:
      'Yes. Your information is encrypted and never sold or shared. We take privacy and security seriously.',
  },
  {
    id: 'share',
    question: 'Can I share this with a friend or family member?',
    answer:
      'Yes, if they’re 65 or older, they can also complete the check and receive their own personalized benefits report for $1 as well.',
  },
  {
    id: 'refund',
    question: 'Can I get a refund if I don’t qualify?',
    answer:
      "Yes. If you don’t qualify for any program or you're not satisfied for any other reason, we refund the $1 automatically.",
  },
];

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#ffffff',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#005e54',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardOpen: {
    borderColor: '#005e54',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 18,
    justifyContent: 'space-between',
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#005e54',
    marginRight: 10,
    lineHeight: 22,
  },
  answerWrap: {
    backgroundColor: '#f9faf5',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  answer: {
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
  },
  noteContainer: {
    marginTop: 36,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  noteStrong: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  noteBody: {
    color: '#111827',
    fontSize: 13,
    lineHeight: 23,
  },
});
