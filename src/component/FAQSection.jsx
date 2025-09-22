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
      {title ? <Text style={styles.title}>{title}</Text> : null}

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
            government branch. We are not sponsored by any external private
            organisation.
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default FAQSection;

const DEFAULT_ITEMS = [
  {
    id: 'why-free',
    question: 'Why is this free?',
    answer:
      'We’ve made the app completely free so that every user can check their benefits without any upfront cost.',
  },
  {
    id: 'govt-app',
    question: 'Is this a government app?',
    answer:
      'No, MyBenefitsAI is not a government app. We are an independent platform that helps you discover benefits and relief programs you may qualify for.',
  },
  {
    id: 'benefits',
    question: 'What kind of benefits can I expect?',
    answer:
      'Depending on your situation, you may see benefits such as Medicare allowances, food cards, debt relief, accident compensation, auto insurance savings, and more.',
  },
  {
    id: 'report-time',
    question: 'How long will it take to receive my benefits report?',
    answer:
      'Your personalized benefits report is generated instantly after you answer a few simple questions.',
  },
  {
    id: 'safe',
    question: 'Is my information safe?',
    answer:
      'Yes. We take your privacy seriously and use encryption and secure protocols to protect your data.',
  },
  {
    id: 'share',
    question: 'Can I share this with a friend or family member?',
    answer:
      'Absolutely. Many people recommend the app so their loved ones can check if they qualify too.',
  },
  {
    id: 'age',
    question: 'Do I need to be a certain age to use the app?',
    answer:
      'Most benefits are available to adults over 18, with some programs specific to seniors (50+ or 65+). The app guides you automatically based on your answers.',
  },
  {
    id: 'how-often',
    question: 'How often should I check for benefits?',
    answer:
      'Programs and eligibility rules change regularly. We recommend checking at least once every few months to make sure you don’t miss anything new.',
  },
];

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#ffffff',
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F2EE',
    shadowColor: '#000',
    shadowOpacity: 0.06,
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
    marginBottom: 20,
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
