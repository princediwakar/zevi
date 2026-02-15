import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import { LearnContent } from '../../types';
import { ChevronRight, CheckCircle } from 'lucide-react-native';

interface LearnLessonProps {
  content: LearnContent;
  onComplete: () => void;
  onError: (error: string) => void;
}

export function LearnLesson({ content, onComplete, onError }: LearnLessonProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [showCheckQuestion, setShowCheckQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const cardScale = useSharedValue(1);
  const cardOpacity = useSharedValue(1);
  // Self-check state for mid-card questions
  const [showSelfCheck, setShowSelfCheck] = useState(false);
  const [selfCheckAnswer, setSelfCheckAnswer] = useState<number | null>(null);
  const [showSelfCheckResult, setShowSelfCheckResult] = useState(false);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const currentCardData = content.cards[currentCard];
  const hasSelfCheck = currentCardData?.selfCheck;

  const progress = ((currentCard + 1) / content.cards.length) * 100;

  // Handle self-check answer selection
  const handleSelfCheckSelect = (index: number) => {
    if (!showSelfCheckResult) {
      setSelfCheckAnswer(index);
    }
  };

  // Submit self-check answer
  const handleSelfCheckSubmit = () => {
    if (selfCheckAnswer === null || !currentCardData?.selfCheck) return;
    setShowSelfCheckResult(true);
  };

  // Continue to next card after self-check
  const handleSelfCheckContinue = () => {
    setShowSelfCheck(false);
    setSelfCheckAnswer(null);
    setShowSelfCheckResult(false);
    if (currentCard < content.cards.length - 1) {
      handleNext();
    } else {
      setShowCheckQuestion(true);
    }
  };

  const handleNext = () => {
    // Check if current card has a self-check question
    const currentCardData = content.cards[currentCard];
    if (currentCardData?.selfCheck && !showSelfCheck) {
      setShowSelfCheck(true);
      return;
    }

    if (currentCard < content.cards.length - 1) {
      // Animate card change using reanimated
      cardScale.value = withSequence(
        withTiming(0.8, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );

      setCurrentCard(currentCard + 1);
    } else {
      setShowCheckQuestion(true);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === content.check_question?.correct_answer;
    setShowResult(true);

    if (isCorrect) {
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  const renderCard = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      style={[
        styles.card,
        cardAnimatedStyle,
      ]}
    >
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
        <Text style={[styles.cardDescription, { color: theme.colors.text.secondary }]}>
          {item.content}
        </Text>

        {/* Why It Matters */}
        {item.whyItMatters && (
          <View style={styles.whyItMattersContainer}>
            <Text style={[styles.whyItMattersLabel, { color: theme.colors.primary[600] }]}>
              WHY IT MATTERS
            </Text>
            <Text style={[styles.whyItMattersText, { color: theme.colors.text.primary }]}>
              {item.whyItMatters}
            </Text>
          </View>
        )}

        {/* Pro Tip */}
        {item.proTip && (
          <View style={styles.proTipContainer}>
            <Text style={[styles.proTipLabel, { color: theme.colors.semantic.success }]}>
              PRO TIP
            </Text>
            <Text style={[styles.proTipText, { color: theme.colors.text.primary }]}>
              {item.proTip}
            </Text>
          </View>
        )}

        {/* Common Mistake */}
        {item.commonMistake && (
          <View style={styles.mistakeContainer}>
            <Text style={[styles.mistakeLabel, { color: theme.colors.semantic.error }]}>
              COMMON MISTAKE
            </Text>
            <Text style={[styles.mistakeText, { color: theme.colors.text.primary }]}>
              {item.commonMistake}
            </Text>
          </View>
        )}

        {/* Example */}
        {item.example && (
          <View style={styles.exampleContainer}>
            <Text style={[styles.exampleLabel, { color: theme.colors.primary[600] }]}>
              {item.exampleCompany ? `EXAMPLE: ${item.exampleCompany}` : 'EXAMPLE'}
            </Text>
            <Text style={[styles.exampleText, { color: theme.colors.text.secondary }]}>
              {item.example}
            </Text>
          </View>
        )}

        {/* Key Points */}
        {item.keyPoints && item.keyPoints.length > 0 && (
          <View style={styles.keyPointsContainer}>
            <Text style={[styles.keyPointsLabel, { color: theme.colors.text.secondary }]}>
              KEY POINTS
            </Text>
            {item.keyPoints.map((point: string, pointIndex: number) => (
              <View key={pointIndex} style={styles.keyPointItem}>
                <Text style={[styles.keyPointBullet, { color: theme.colors.primary[500] }]}>•</Text>
                <Text style={[styles.keyPointText, { color: theme.colors.text.primary }]}>{point}</Text>
              </View>
            ))}
          </View>
        )}

        {item.image_url && (
          <View style={styles.cardImage}>
            <View
              style={{
                width: '100%',
                height: 150,
                backgroundColor: theme.colors.primary[100],
                borderRadius: theme.spacing.borderRadius.sm,
              }}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );

  // Self-check question overlay during learning
  if (showSelfCheck && currentCardData?.selfCheck) {
    const selfCheck = currentCardData.selfCheck;
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LinearGradient
          colors={[theme.colors.semantic.success, theme.colors.primary[600]]}
          style={styles.headerGradient}
        >
          <Text style={styles.headerText}>Quick Check</Text>
        </LinearGradient>

        <ScrollView style={styles.checkQuestionContainer} contentContainerStyle={styles.checkQuestionContent}>
          <Text style={[styles.questionText, { color: theme.colors.text.primary }]}>
            {selfCheck.question}
          </Text>

          {(selfCheck.options || []).map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                {
                  backgroundColor:
                    selfCheckAnswer === index
                      ? theme.colors.primary[100]
                      : theme.colors.surface.primary,
                  borderColor:
                    selfCheckAnswer === index ? theme.colors.primary[500] : theme.colors.border.light,
                },
              ]}
              onPress={() => handleSelfCheckSelect(index)}
              disabled={showSelfCheckResult}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      selfCheckAnswer === index
                        ? theme.colors.primary[700]
                        : theme.colors.text.primary,
                  },
                ]}
              >
                {String.fromCharCode(65 + index)}. {option}
              </Text>
              {selfCheckAnswer === index && (
                <CheckCircle size={20} color={theme.colors.primary[500]} fill={theme.colors.primary[100]} />
              )}
            </TouchableOpacity>
          ))}

          {showSelfCheckResult && (
            <View style={styles.selfCheckResult}>
              <Text
                style={[
                  styles.resultText,
                  {
                    color:
                      selfCheckAnswer === selfCheck.correctAnswer
                        ? theme.colors.semantic.success
                        : theme.colors.semantic.error,
                  },
                ]}
              >
                {selfCheckAnswer === selfCheck.correctAnswer
                  ? '✓ Correct! Well done!'
                  : '✗ Not quite right'}
              </Text>
              {selfCheck.explanation && (
                <View style={styles.explanationContainer}>
                  <Text style={[styles.explanationText, { color: theme.colors.text.secondary }]}>
                    {selfCheck.explanation}
                  </Text>
                </View>
              )}
            </View>
          )}

          {!showSelfCheckResult ? (
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: theme.colors.primary[500] },
                selfCheckAnswer === null && styles.submitButtonDisabled,
              ]}
              onPress={handleSelfCheckSubmit}
              disabled={selfCheckAnswer === null}
            >
              <Text style={styles.submitButtonText}>Check Answer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: theme.colors.primary[500] },
              ]}
              onPress={handleSelfCheckContinue}
            >
              <Text style={styles.submitButtonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  if (showCheckQuestion) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LinearGradient
          colors={[theme.colors.primary[500], theme.colors.primary[600]]}
          style={styles.headerGradient}
        >
          <Text style={styles.headerText}>Quick Check</Text>
        </LinearGradient>

        <ScrollView style={styles.checkQuestionContainer} contentContainerStyle={styles.checkQuestionContent}>
          <Text style={[styles.questionText, { color: theme.colors.text.primary }]}>
            {content.check_question?.question}
          </Text>

          {(content.check_question?.options || []).map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                {
                  backgroundColor:
                    selectedAnswer === index
                      ? theme.colors.primary[100]
                      : theme.colors.surface.primary,
                  borderColor:
                    selectedAnswer === index ? theme.colors.primary[500] : theme.colors.border.light,
                },
              ]}
              onPress={() => handleAnswerSelect(index)}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      selectedAnswer === index
                        ? theme.colors.primary[700]
                        : theme.colors.text.primary,
                  },
                ]}
              >
                {String.fromCharCode(65 + index)}. {option}
              </Text>
              {selectedAnswer === index && (
                <CheckCircle size={20} color={theme.colors.primary[500]} fill={theme.colors.primary[100]} />
              )}
            </TouchableOpacity>
          ))}

          {showResult && (
            <Text
              style={[
                styles.resultText,
                {
                  color:
                    selectedAnswer === content.check_question?.correct_answer
                      ? theme.colors.semantic.success
                      : theme.colors.semantic.error,
                },
              ]}
            >
              {selectedAnswer === content.check_question?.correct_answer
                ? 'Correct! Great job!'
                : 'Not quite. Keep learning!'}
            </Text>
          )}

          {!showResult && (
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: theme.colors.primary[500] },
              ]}
              onPress={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%`, backgroundColor: theme.colors.primary[500] },
          ]}
        />
      </View>

      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary[500], theme.colors.primary[600]]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerText}>
          Card {currentCard + 1} of {content.cards.length}
        </Text>
      </LinearGradient>

      {/* Card Content */}
      <ScrollView style={styles.cardsContainer} contentContainerStyle={styles.cardList}>
        {renderCard({ item: content.cards[currentCard], index: currentCard })}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, { opacity: currentCard === 0 ? 0.5 : 1 }]}
          onPress={handlePrevious}
          disabled={currentCard === 0}
        >
          <Text style={[styles.navButtonText, { color: theme.colors.text.secondary }]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.navButtonNext]}
          onPress={handleNext}
        >
          <Text style={[styles.navButtonText, { color: theme.colors.text.inverse }]}>
            {currentCard === content.cards.length - 1 ? 'Check Understanding' : 'Next'}
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
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border.light,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
  },
  headerGradient: {
    padding: theme.spacing[5],
    borderBottomLeftRadius: theme.spacing.borderRadius.lg,
    borderBottomRightRadius: theme.spacing.borderRadius.lg,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.inverse,
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    padding: theme.spacing[5],
  },
  cardList: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.spacing.borderRadius.sm,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[5],
    borderWidth: theme.spacing.borderWidth.thin,
    borderColor: theme.colors.border.light,
  },
  cardContent: {
    gap: theme.spacing[4],
  },
  cardTitle: {
    fontSize: theme.typography.heading.h3.fontSize,
    fontWeight: theme.typography.heading.h3.fontWeight,
    marginBottom: theme.spacing[2],
    letterSpacing: theme.typography.heading.h3.letterSpacing,
  },
  cardDescription: {
    fontSize: theme.typography.body.lg.fontSize,
    lineHeight: theme.typography.body.lg.lineHeight,
  },
  cardImage: {
    marginTop: theme.spacing[4],
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing[5],
    borderTopWidth: theme.spacing.borderWidth.thin,
    borderTopColor: theme.colors.border.light,
  },
  navButton: {
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.spacing.borderRadius.sm,
    backgroundColor: theme.colors.surface.secondary,
  },
  navButtonNext: {
    backgroundColor: theme.colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  navButtonText: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '500',
  },
  checkQuestionContainer: {
    flex: 1,
    padding: theme.spacing[5],
  },
  checkQuestionContent: {
    paddingBottom: theme.spacing[5],
  },
  questionText: {
    fontSize: theme.typography.body.xl.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing[5],
    textAlign: 'center',
  },
  optionButton: {
    padding: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.sm,
    borderWidth: theme.spacing.borderWidth.medium,
    marginBottom: theme.spacing[3],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: theme.typography.body.lg.fontSize,
    flex: 1,
  },
  resultText: {
    fontSize: theme.typography.body.xl.fontSize,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: theme.spacing[5],
    marginBottom: theme.spacing[5],
  },
  submitButton: {
    paddingVertical: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.sm,
    alignItems: 'center',
  },
  submitButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '600',
  },
  // Rich content styles
  whyItMattersContainer: {
    marginTop: theme.spacing[4],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.spacing.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary[500],
  },
  whyItMattersLabel: {
    fontSize: theme.typography.label.sm.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing[1],
    letterSpacing: 0.5,
  },
  whyItMattersText: {
    fontSize: theme.typography.body.md.fontSize,
    lineHeight: theme.typography.body.md.lineHeight,
  },
  proTipContainer: {
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.semantic.success + '15',
    borderRadius: theme.spacing.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.semantic.success,
  },
  proTipLabel: {
    fontSize: theme.typography.label.sm.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing[1],
    letterSpacing: 0.5,
  },
  proTipText: {
    fontSize: theme.typography.body.md.fontSize,
    lineHeight: theme.typography.body.md.lineHeight,
  },
  mistakeContainer: {
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.semantic.error + '10',
    borderRadius: theme.spacing.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.semantic.error,
  },
  mistakeLabel: {
    fontSize: theme.typography.label.sm.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing[1],
    letterSpacing: 0.5,
  },
  mistakeText: {
    fontSize: theme.typography.body.md.fontSize,
    lineHeight: theme.typography.body.md.lineHeight,
  },
  exampleContainer: {
    marginTop: theme.spacing[4],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  exampleLabel: {
    fontSize: theme.typography.label.sm.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing[2],
    letterSpacing: 0.5,
  },
  exampleText: {
    fontSize: theme.typography.body.md.fontSize,
    lineHeight: theme.typography.body.md.lineHeight,
    fontStyle: 'italic',
  },
  keyPointsContainer: {
    marginTop: theme.spacing[4],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.spacing.borderRadius.sm,
  },
  keyPointsLabel: {
    fontSize: theme.typography.label.sm.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing[2],
    letterSpacing: 0.5,
  },
  keyPointItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing[1],
  },
  keyPointBullet: {
    fontSize: theme.typography.body.md.fontSize,
    marginRight: theme.spacing[2],
    fontWeight: '700',
  },
  keyPointText: {
    flex: 1,
    fontSize: theme.typography.body.md.fontSize,
    lineHeight: theme.typography.body.md.lineHeight,
  },
  // Self-check specific styles
  selfCheckResult: {
    marginTop: theme.spacing[4],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.spacing.borderRadius.sm,
  },
  explanationContainer: {
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  explanationText: {
    fontSize: theme.typography.body.md.fontSize,
    lineHeight: theme.typography.body.md.lineHeight,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
});
