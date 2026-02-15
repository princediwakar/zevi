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
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import { LearnContent, LearnCardType, LearnSection } from '../../types';
import {
  ChevronRight,
  CheckCircle,
  BookOpen,
  ChevronDown,
  Sparkles,
} from 'lucide-react-native';

interface LearnLessonProps {
  content: LearnContent;
  onComplete: () => void;
  onError: (error: string) => void;
}

// Card type configuration for visual styling
const CARD_TYPE_CONFIG: Record<LearnCardType, {
  icon: React.ReactNode;
  gradient: [string, string];
  label: string;
}> = {
  concept: {
    icon: <BookOpen size={20} color={theme.colors.primary[500]} />,
    gradient: [theme.colors.primary[50], theme.colors.primary[100]] as [string, string],
    label: 'CONCEPT',
  },
  example: {
    icon: <BookOpen size={20} color={theme.colors.semantic.info} />,
    gradient: [theme.colors.semantic.info + '20', theme.colors.semantic.info + '30'] as [string, string],
    label: 'REAL EXAMPLE',
  },
  practice: {
    icon: <BookOpen size={20} color={theme.colors.semantic.warning} />,
    gradient: [theme.colors.semantic.warning + '15', theme.colors.semantic.warning + '25'] as [string, string],
    label: 'PRACTICE',
  },
  reflection: {
    icon: <BookOpen size={20} color={theme.colors.semantic.success} />,
    gradient: [theme.colors.semantic.success + '15', theme.colors.semantic.success + '25'] as [string, string],
    label: 'REFLECT',
  },
  summary: {
    icon: <Sparkles size={20} color={theme.colors.primary[600]} />,
    gradient: [theme.colors.primary[50], theme.colors.primary[100]] as [string, string],
    label: 'SUMMARY',
  },
};

export function LearnLesson({ content, onComplete, onError }: LearnLessonProps) {
  const [currentCard, setCurrentCard] = useState(0);

  // Progressive disclosure state
  const [revealedSections, setRevealedSections] = useState<Record<number, number>>({});

  // Section exercise state
  const [sectionExercises, setSectionExercises] = useState<Record<string, {
    answered: boolean;
    correct: boolean;
    userAnswer: number | string | null;
  }>>({});

  // Animation values
  const cardScale = useSharedValue(1);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const currentCardData = content.cards[currentCard];
  const progress = ((currentCard + 1) / content.cards.length) * 100;

  // Get card type with fallback
  const cardType: LearnCardType = currentCardData?.type || 'concept';
  const typeConfig = CARD_TYPE_CONFIG[cardType];

  // Get sections - either from new sections field or legacy fields
  const getSections = useCallback((): LearnSection[] => {
    if (currentCardData?.sections && currentCardData.sections.length > 0) {
      return currentCardData.sections;
    }

    // Convert legacy fields to sections for progressive disclosure
    const sections: LearnSection[] = [];

    // Main content as first section
    sections.push({
      id: 'main',
      type: 'content',
      content: currentCardData?.content || '',
    });

    // Add Why It Matters
    if (currentCardData?.whyItMatters) {
      sections.push({
        id: 'why',
        type: 'content',
        title: 'Why It Matters',
        content: currentCardData.whyItMatters,
      });
    }

    // Add Example if present
    if (currentCardData?.example) {
      sections.push({
        id: 'example',
        type: 'example',
        title: currentCardData.exampleCompany ? `Example: ${currentCardData.exampleCompany}` : 'Example',
        content: currentCardData.example,
      });
    }

    // Add Common Mistake
    if (currentCardData?.commonMistake) {
      sections.push({
        id: 'mistake',
        type: 'content',
        title: 'Common Mistake',
        content: currentCardData.commonMistake,
      });
    }

    // Add Pro Tip
    if (currentCardData?.proTip) {
      sections.push({
        id: 'proTip',
        type: 'content',
        title: 'Pro Tip',
        content: currentCardData.proTip,
      });
    }

    // Add Key Points
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

  // Handle section reveal
  const handleRevealSection = () => {
    setRevealedSections(prev => ({
      ...prev,
      [currentCard]: (prev[currentCard] || 0) + 1,
    }));
  };

  // Handle section exercise answer
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
    // Animate card change
    cardScale.value = withSequence(
      withTiming(0.95, { duration: 150 }),
      withSpring(1, { damping: 15 })
    );

    // If on last card, complete the lesson
    if (currentCard >= content.cards.length - 1) {
      onComplete();
      return;
    }

    setCurrentCard(currentCard + 1);
    // Reset section reveal for new card
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

  // Render a single section with progressive disclosure
  const renderSection = (section: LearnSection, index: number) => {
    const isRevealed = index <= revealedCount;
    const exerciseState = sectionExercises[section.id];

    if (!isRevealed) {
      // Show "reveal more" indicator
      if (index === revealedCount + 1 && index < sections.length) {
        return (
          <TouchableOpacity
            key={section.id}
            style={styles.revealMoreButton}
            onPress={handleRevealSection}
          >
            <View style={styles.revealMoreContent}>
              <ChevronDown size={16} color={theme.colors.primary[500]} />
              <Text style={[styles.revealMoreText, { color: theme.colors.primary[500] }]}>
                Learn more
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
      return null;
    }

    // Render exercise section
    if (section.type === 'exercise' && section.exercise) {
      return (
        <Animated.View
          key={section.id}
          entering={FadeIn.duration(300)}
          style={styles.exerciseSection}
        >
          <View style={styles.exerciseHeader}>
            <BookOpen size={18} color={theme.colors.semantic.warning} />
            <Text style={[styles.exerciseTitle, { color: theme.colors.text.primary }]}>
              {section.title || 'Practice'}
            </Text>
          </View>

          {section.exercise.prompt && (
            <Text style={[styles.exercisePrompt, { color: theme.colors.text.secondary }]}>
              {section.exercise.prompt}
            </Text>
          )}

          {section.exercise.type === 'select' && section.exercise.options && (
            <View style={styles.exerciseOptions}>
              {section.exercise.options.map((option, optIndex) => (
                <TouchableOpacity
                  key={optIndex}
                  style={[
                    styles.exerciseOption,
                    {
                      backgroundColor: exerciseState?.answered
                        ? optIndex === section.exercise?.correctAnswer
                          ? theme.colors.semantic.success + '20'
                          : exerciseState?.userAnswer === optIndex
                            ? theme.colors.semantic.error + '20'
                            : theme.colors.surface.primary
                        : theme.colors.surface.primary,
                      borderColor: exerciseState?.answered
                        ? optIndex === section.exercise?.correctAnswer
                          ? theme.colors.semantic.success
                          : exerciseState?.userAnswer === optIndex
                            ? theme.colors.semantic.error
                            : theme.colors.border.light
                        : theme.colors.border.light,
                    },
                  ]}
                  onPress={() => !exerciseState?.answered && handleSectionExerciseAnswer(section.id, optIndex)}
                  disabled={exerciseState?.answered}
                >
                  <Text
                    style={[
                      styles.exerciseOptionText,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {String.fromCharCode(65 + optIndex)}. {option}
                  </Text>
                  {exerciseState?.answered && optIndex === section.exercise?.correctAnswer && (
                    <CheckCircle size={18} color={theme.colors.semantic.success} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {exerciseState?.answered && section.exercise.explanation && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.exerciseExplanation}>
              <Text style={[styles.exerciseResult, {
                color: exerciseState.correct
                  ? theme.colors.semantic.success
                  : theme.colors.semantic.error
              }]}>
                {exerciseState.correct ? '✓ Correct!' : '✗ Not quite'}
              </Text>
              <Text style={[styles.explanationText, { color: theme.colors.text.secondary }]}>
                {section.exercise.explanation}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      );
    }

    // Render example section with special styling
    if (section.type === 'example') {
      return (
        <Animated.View
          key={section.id}
          entering={FadeIn.duration(300)}
          style={styles.exampleSection}
        >
          <View style={styles.exampleHeader}>
            <BookOpen size={18} color={theme.colors.semantic.info} />
            <Text style={[styles.exampleTitle, { color: theme.colors.semantic.info }]}>
              {section.title || 'Example'}
            </Text>
          </View>
          <Text style={[styles.exampleContent, { color: theme.colors.text.secondary }]}>
            {section.content}
          </Text>
        </Animated.View>
      );
    }

    // Render content section
    return (
      <Animated.View
        key={section.id}
        entering={FadeIn.duration(300)}
        style={styles.contentSection}
      >
        {section.title && section.id !== 'main' && (
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            {section.title}
          </Text>
        )}
        <Text style={[styles.sectionContent, { color: theme.colors.text.secondary }]}>
          {section.content}
        </Text>
      </Animated.View>
    );
  };

  // Render the main card content
  const renderCard = () => {
    return (
      <Animated.View style={[styles.card, cardAnimatedStyle]}>
        {/* Card Type Badge */}
        <View style={[styles.cardTypeBadge, { backgroundColor: typeConfig.gradient[0] }]}>
          {typeConfig.icon}
          <Text style={[styles.cardTypeLabel, { color: theme.colors.text.secondary }]}>
            {typeConfig.label}
          </Text>
        </View>

        {/* Card Title */}
        <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
          {currentCardData.title}
        </Text>

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
          >
            <Text style={[styles.learnMoreText, { color: theme.colors.primary[500] }]}>
              + Learn more about this
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  // Main learning view
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Progress Bar - Swiss Style */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarLabels}>
          <Text style={[styles.progressLabel, { color: theme.colors.text.secondary }]}>
            {currentCard + 1} / {content.cards.length}
          </Text>
          <Text style={[styles.progressPercent, { color: theme.colors.primary[500] }]}>
            {Math.round(progress)}%
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.border.light }]}>
          <Animated.View
            style={[
              styles.progressFill,
              { backgroundColor: theme.colors.primary[500] },
            ]}
          />
        </View>
      </View>

      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary[500], theme.colors.primary[600]]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerText}>
          {content.title || 'Learn'}
        </Text>
      </LinearGradient>

      {/* Card Content */}
      <ScrollView
        style={styles.cardsContainer}
        contentContainerStyle={styles.cardList}
        showsVerticalScrollIndicator={false}
      >
        {renderCard()}
      </ScrollView>

      {/* Navigation - Swiss Style */}
      <View style={[styles.navigation, { borderTopColor: theme.colors.border.light }]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            { opacity: currentCard === 0 ? 0.4 : 1 },
          ]}
          onPress={handlePrevious}
          disabled={currentCard === 0}
        >
          <ChevronDown
            size={20}
            color={theme.colors.text.secondary}
            style={{ transform: [{ rotate: '-90deg' }] }}
          />
          <Text style={[styles.navButtonText, { color: theme.colors.text.secondary }]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButtonNext]}
          onPress={handleNext}
        >
          <Text style={[styles.navButtonTextNext, { color: theme.colors.text.inverse }]}>
            {currentCard === content.cards.length - 1 ? 'Complete' : 'Next'}
          </Text>
          <ChevronRight size={20} color={theme.colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBarContainer: {
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[3],
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  progressLabel: {
    fontSize: theme.typography.label.sm.fontSize,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: theme.typography.label.sm.fontSize,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  headerGradient: {
    padding: theme.spacing[5],
    paddingTop: theme.spacing[4],
  },
  headerText: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: '700',
    color: theme.colors.text.inverse,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  cardsContainer: {
    flex: 1,
  },
  cardList: {
    padding: theme.spacing[5],
    paddingBottom: 120,
  },
  card: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.spacing.borderRadius.md,
    padding: theme.spacing[5],
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  cardTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.spacing.borderRadius.full,
    marginBottom: theme.spacing[4],
  },
  cardTypeLabel: {
    fontSize: theme.typography.label.sm.fontSize,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: theme.typography.heading.h3.fontSize,
    fontWeight: '700',
    marginBottom: theme.spacing[4],
    letterSpacing: -0.5,
    lineHeight: theme.typography.heading.h3.lineHeight,
  },
  sectionsContainer: {
    gap: theme.spacing[4],
  },
  contentSection: {
    gap: theme.spacing[2],
  },
  sectionTitle: {
    fontSize: theme.typography.label.md.fontSize,
    fontWeight: '600',
    marginTop: theme.spacing[2],
  },
  sectionContent: {
    fontSize: theme.typography.body.lg.fontSize,
    lineHeight: theme.typography.body.lg.lineHeight,
  },
  exampleSection: {
    marginTop: theme.spacing[3],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.semantic.info + '10',
    borderRadius: theme.spacing.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.semantic.info,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
  exampleTitle: {
    fontSize: theme.typography.label.md.fontSize,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exampleContent: {
    fontSize: theme.typography.body.md.fontSize,
    lineHeight: theme.typography.body.md.lineHeight,
    fontStyle: 'italic',
  },
  exerciseSection: {
    marginTop: theme.spacing[4],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.semantic.warning + '10',
    borderRadius: theme.spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.semantic.warning + '30',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[3],
  },
  exerciseTitle: {
    fontSize: theme.typography.label.md.fontSize,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exercisePrompt: {
    fontSize: theme.typography.body.md.fontSize,
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
    borderRadius: theme.spacing.borderRadius.sm,
    borderWidth: 1,
  },
  exerciseOptionText: {
    fontSize: theme.typography.body.md.fontSize,
    flex: 1,
  },
  exerciseExplanation: {
    marginTop: theme.spacing[4],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.spacing.borderRadius.sm,
  },
  exerciseResult: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing[2],
  },
  explanationText: {
    fontSize: theme.typography.body.md.fontSize,
    lineHeight: theme.typography.body.md.lineHeight,
  },
  revealMoreButton: {
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
    borderRadius: theme.spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary[200],
    borderStyle: 'dashed',
  },
  revealMoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
  },
  revealMoreText: {
    fontSize: theme.typography.body.sm.fontSize,
    fontWeight: '600',
  },
  learnMoreButton: {
    marginTop: theme.spacing[4],
    alignSelf: 'center',
  },
  learnMoreText: {
    fontSize: theme.typography.body.sm.fontSize,
    fontWeight: '600',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[5],
    backgroundColor: theme.colors.surface.primary,
    borderTopWidth: 1,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
  },
  navButtonText: {
    fontSize: theme.typography.body.md.fontSize,
    fontWeight: '500',
  },
  navButtonNext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
    borderRadius: theme.spacing.borderRadius.sm,
  },
  navButtonTextNext: {
    fontSize: theme.typography.body.md.fontSize,
    fontWeight: '600',
  },
});
