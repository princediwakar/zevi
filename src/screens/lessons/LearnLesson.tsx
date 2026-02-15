import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { theme } from '../../theme';
import { LearnContent, LearnCardType, LearnSection } from '../../types';

interface LearnLessonProps {
  content: LearnContent;
  onComplete: () => void;
  onError: (error: string) => void;
}

// ============================================
// SWISS DESIGN: Sharp, bold, minimal, high contrast
// Using centralized theme tokens for consistency
// ============================================

// Card type configuration - Swiss bordered boxes
const CARD_TYPE_CONFIG: Record<LearnCardType, {
  label: string;
}> = {
  concept: { label: 'CONCEPT' },
  example: { label: 'REAL EXAMPLE' },
  practice: { label: 'PRACTICE' },
  reflection: { label: 'REFLECT' },
  summary: { label: 'SUMMARY' },
};

export function LearnLesson({ content, onComplete, onError }: LearnLessonProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [revealedSections, setRevealedSections] = useState<Record<number, number>>({});
  const [sectionExercises, setSectionExercises] = useState<Record<string, {
    answered: boolean;
    correct: boolean;
    userAnswer: number | string | null;
  }>>({});

  const cardScale = useSharedValue(1);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const currentCardData = content.cards[currentCard];
  const progress = ((currentCard + 1) / content.cards.length) * 100;

  const cardType: LearnCardType = currentCardData?.type || 'concept';
  const typeConfig = CARD_TYPE_CONFIG[cardType];

  const getSections = useCallback((): LearnSection[] => {
    if (currentCardData?.sections && currentCardData.sections.length > 0) {
      return currentCardData.sections;
    }

    const sections: LearnSection[] = [];

    sections.push({
      id: 'main',
      type: 'content',
      content: currentCardData?.content || '',
    });

    if (currentCardData?.whyItMatters) {
      sections.push({
        id: 'why',
        type: 'content',
        title: 'Why It Matters',
        content: currentCardData.whyItMatters,
      });
    }

    if (currentCardData?.example) {
      sections.push({
        id: 'example',
        type: 'example',
        title: currentCardData.exampleCompany ? `Example: ${currentCardData.exampleCompany}` : 'Example',
        content: currentCardData.example,
      });
    }

    if (currentCardData?.commonMistake) {
      sections.push({
        id: 'mistake',
        type: 'content',
        title: 'Common Mistake',
        content: currentCardData.commonMistake,
      });
    }

    if (currentCardData?.proTip) {
      sections.push({
        id: 'proTip',
        type: 'content',
        title: 'Pro Tip',
        content: currentCardData.proTip,
      });
    }

    if (currentCardData?.keyPoints && currentCardData.keyPoints.length > 0) {
      sections.push({
        id: 'keyPoints',
        type: 'content',
        title: 'Key Points',
        content: currentCardData.keyPoints.join('\n'),
      });
    }

    return sections;
  }, [currentCardData]);

  const sections = getSections();
  const revealedCount = revealedSections[currentCard] ?? 0;

  const handleRevealSection = () => {
    setRevealedSections(prev => ({
      ...prev,
      [currentCard]: (prev[currentCard] || 0) + 1,
    }));
  };

  const handleSectionExerciseAnswer = (sectionId: string, answer: number | string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section?.exercise) return;

    const isCorrect = answer === section.exercise.correctAnswer;

    setSectionExercises(prev => ({
      ...prev,
      [sectionId]: {
        answered: true,
        correct: isCorrect,
        userAnswer: answer,
      },
    }));
  };

  const handleNext = () => {
    cardScale.value = withSequence(
      withTiming(0.95, { duration: 150 }),
      withSpring(1, { damping: 15 })
    );

    if (currentCard >= content.cards.length - 1) {
      onComplete();
      return;
    }

    setCurrentCard(currentCard + 1);
    setRevealedSections(prev => ({ ...prev, [currentCard + 1]: 0 }));
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      cardScale.value = withSequence(
        withTiming(0.95, { duration: 150 }),
        withSpring(1, { damping: 15 })
      );
      setCurrentCard(currentCard - 1);
    }
  };

  const renderSection = (section: LearnSection, index: number) => {
    const isRevealed = index <= revealedCount;
    const exerciseState = sectionExercises[section.id];

    if (!isRevealed) {
      if (index === revealedCount + 1 && index < sections.length) {
        return (
          <TouchableOpacity
            key={section.id}
            style={styles.revealMoreButton}
            onPress={handleRevealSection}
            activeOpacity={0.8}
          >
            <View style={styles.revealMoreContent}>
              <Text style={styles.revealMoreText}>+ LEARN MORE</Text>
            </View>
          </TouchableOpacity>
        );
      }
      return null;
    }

    if (section.type === 'exercise' && section.exercise) {
      return (
        <Animated.View
          key={section.id}
          entering={FadeIn.duration(300)}
          style={styles.exerciseSection}
        >
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseTitle}>{section.title || 'PRACTICE'}</Text>
          </View>

          {section.exercise.prompt && (
            <Text style={styles.exercisePrompt}>{section.exercise.prompt}</Text>
          )}

          {section.exercise.type === 'select' && section.exercise.options && (
            <View style={styles.exerciseOptions}>
              {section.exercise.options.map((option, optIndex) => (
                <TouchableOpacity
                  key={optIndex}
                  style={[
                    styles.exerciseOption,
                    exerciseState?.answered && {
                      backgroundColor: optIndex === section.exercise?.correctAnswer
                        ? theme.colors.semantic.success + '20'
                        : exerciseState?.userAnswer === optIndex
                          ? theme.colors.semantic.error + '20'
                          : theme.colors.background,
                      borderColor: exerciseState?.answered
                        ? optIndex === section.exercise?.correctAnswer
                          ? theme.colors.semantic.success
                          : exerciseState?.userAnswer === optIndex
                            ? theme.colors.semantic.error
                            : theme.colors.text.primary
                        : theme.colors.text.primary,
                    },
                  ]}
                  onPress={() => !exerciseState?.answered && handleSectionExerciseAnswer(section.id, optIndex)}
                  disabled={exerciseState?.answered}
                  activeOpacity={0.8}
                >
                  <Text style={styles.exerciseOptionText}>
                    {String.fromCharCode(65 + optIndex)}. {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {exerciseState?.answered && section.exercise.explanation && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.exerciseExplanation}>
              <Text style={[
                styles.exerciseResult,
                { color: exerciseState.correct ? theme.colors.semantic.success : theme.colors.semantic.error }
              ]}>
                {exerciseState.correct ? 'CORRECT' : 'INCORRECT'}
              </Text>
              <Text style={styles.explanationText}>{section.exercise.explanation}</Text>
            </Animated.View>
          )}
        </Animated.View>
      );
    }

    if (section.type === 'example') {
      return (
        <Animated.View
          key={section.id}
          entering={FadeIn.duration(300)}
          style={styles.exampleSection}
        >
          <View style={styles.exampleHeader}>
            <Text style={styles.exampleTitle}>{section.title || 'EXAMPLE'}</Text>
          </View>
          <Text style={styles.exampleContent}>{section.content}</Text>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        key={section.id}
        entering={FadeIn.duration(300)}
        style={styles.contentSection}
      >
        {section.title && section.id !== 'main' && (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        <Text style={styles.sectionContent}>{section.content}</Text>
      </Animated.View>
    );
  };

  const renderCard = () => {
    return (
      <Animated.View style={[styles.card, cardAnimatedStyle]}>
        {/* Card Type Badge - Swiss bordered */}
        <View style={styles.cardTypeBadge}>
          <Text style={styles.cardTypeLabel}>{typeConfig.label}</Text>
        </View>

        {/* Card Title */}
        <Text style={styles.cardTitle}>{currentCardData.title}</Text>

        {/* Progressive Disclosure Sections */}
        <View style={styles.sectionsContainer}>
          {sections.slice(0, revealedCount + 1).map((section, index) =>
            renderSection(section, index)
          )}
        </View>

        {/* Show reveal button if there are more sections */}
        {revealedCount < sections.length - 1 && (
          <TouchableOpacity
            style={styles.learnMoreButton}
            onPress={handleRevealSection}
            activeOpacity={0.8}
          >
            <Text style={styles.learnMoreText}>+ LEARN MORE</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar - Swiss Style */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarLabels}>
          <Text style={styles.progressLabel}>
            {currentCard + 1} / {content.cards.length}
          </Text>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Card Content */}
      <ScrollView
        style={styles.cardsContainer}
        contentContainerStyle={styles.cardList}
        showsVerticalScrollIndicator={false}
      >
        {renderCard()}
      </ScrollView>

      {/* Navigation - Swiss Style */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentCard === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentCard === 0}
          activeOpacity={0.8}
        >
          <Text style={[styles.navButtonText, currentCard === 0 && styles.navButtonTextDisabled]}>
            PREVIOUS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButtonNext}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.navButtonTextNext}>
            {currentCard === content.cards.length - 1 ? 'COMPLETE' : 'NEXT'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================
// SWISS STYLE: Sharp edges, bold typography, no gradients
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  progressBarContainer: {
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingTop: theme.spacing[3],
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  progressLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  progressPercent: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 0,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.text.primary,
    borderRadius: 0,
  },
  cardsContainer: {
    flex: 1,
  },
  cardList: {
    padding: theme.swiss.layout.screenPadding,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: theme.colors.background,
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.swiss.layout.sectionGap,
  },
  cardTypeBadge: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[3],
    alignSelf: 'flex-start',
    marginBottom: theme.spacing[4],
  },
  cardTypeLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  cardTitle: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  sectionsContainer: {
    gap: theme.spacing[4],
  },
  contentSection: {
    gap: theme.spacing[2],
  },
  sectionTitle: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[2],
  },
  sectionContent: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  exampleSection: {
    marginTop: theme.spacing[3],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface.secondary,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.text.primary,
  },
  exampleHeader: {
    marginBottom: theme.spacing[2],
  },
  exampleTitle: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  exampleContent: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  exerciseSection: {
    marginTop: theme.spacing[4],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
  },
  exerciseHeader: {
    marginBottom: theme.spacing[3],
  },
  exerciseTitle: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  exercisePrompt: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[3],
  },
  exerciseOptions: {
    gap: theme.spacing[2],
  },
  exerciseOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[3],
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  exerciseOptionText: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.primary,
    flex: 1,
  },
  exerciseExplanation: {
    marginTop: theme.spacing[4],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.background,
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
  },
  exerciseResult: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    marginBottom: theme.spacing[2],
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  explanationText: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  revealMoreButton: {
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  revealMoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealMoreText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  learnMoreButton: {
    marginTop: theme.spacing[4],
    alignSelf: 'center',
  },
  learnMoreText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.swiss.layout.screenPadding,
    backgroundColor: theme.colors.background,
    borderTopWidth: theme.swiss.border.heavy,
    borderTopColor: theme.colors.text.primary,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  navButtonTextDisabled: {
    color: theme.colors.text.secondary,
  },
  navButtonNext: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
  },
  navButtonTextNext: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
});
