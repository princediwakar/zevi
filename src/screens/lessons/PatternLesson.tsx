import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { PatternContent, UserOutline } from '../../types';
import { CheckCircle } from 'lucide-react-native';
import { OutlineBuilder } from '../../components/OutlineBuilder';

interface PatternLessonProps {
  content: PatternContent;
  onComplete: () => void;
  onError: (error: string) => void;
}

// PatternAnswer is now UserOutline (Record<string, string[]>)

export function PatternLesson({ content, onComplete, onError }: PatternLessonProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<UserOutline>({});
  const [isComplete, setIsComplete] = useState(false);

  const progress = ((currentQuestion + 1) / content.questions.length) * 100;


  const handleSubmitAnswer = () => {
    setIsComplete(true);

    setTimeout(() => {
      if (currentQuestion < content.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswers({});
        setIsComplete(false);
      } else {
        onComplete();
      }
    }, 1500);
  };

  const renderTemplate = () => {
    return (
      <View style={styles.templateContainer}>
        <Text style={[styles.templateTitle, { color: theme.colors.text.primary }]}>
          {content.pattern_name} Template
        </Text>
        <ScrollView style={styles.templateSteps}>
          {content.template.map((step, index) => (
            <View key={index} style={styles.templateStep}>
              <Text style={[styles.templateStepText, { color: theme.colors.text.primary }]}>
                {index + 1}. {step}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderQuestion = () => {
    const question = content.questions[currentQuestion];

    return (
      <View style={styles.questionContainer}>
        <Text style={[styles.questionText, { color: theme.colors.text.primary }]}>
          {question.text}
        </Text>

        {renderTemplate()}

        <OutlineBuilder
          sections={content.template}
          value={answers}
          onChange={setAnswers}
          mode="pattern"
          onSubmit={handleSubmitAnswer}
          submitLabel="Get Feedback"
          variant="outline"
          size="md"
        />
      </View>
    );
  };

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
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.colors.text.primary }]}>
          Pattern Practice
        </Text>
        <Text style={[styles.headerSubtext, { color: theme.colors.text.secondary }]}>
          {currentQuestion + 1} of {content.questions.length} questions
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {isComplete ? (
          <View style={styles.successContainer}>
            <CheckCircle size={48} color={theme.colors.semantic.success} />
            <Text
              style={[styles.successText, { color: theme.colors.text.primary }]}
            >
              Great work! You've mastered this pattern.
            </Text>
          </View>
        ) : (
          renderQuestion()
        )}
      </ScrollView>
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
  header: {
    padding: theme.spacing[5],
    borderBottomWidth: theme.spacing.borderWidth.thin,
    borderBottomColor: theme.colors.border.light,
  },
  headerText: {
    fontSize: theme.typography.heading.h3.fontSize,
    fontWeight: theme.typography.heading.h3.fontWeight,
    marginBottom: theme.spacing[1],
  },
  headerSubtext: {
    fontSize: theme.typography.body.lg.fontSize,
  },
  content: {
    flex: 1,
    padding: theme.spacing[5],
  },
  questionContainer: {
    gap: theme.spacing[5],
  },
  questionText: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: '600',
    lineHeight: 28,
  },
  templateContainer: {
    backgroundColor: theme.colors.backgroundPaper,
    borderRadius: theme.spacing.borderRadius.md,
    padding: theme.spacing[4],
    borderWidth: theme.spacing.borderWidth.thin,
    borderColor: theme.colors.border.light,
  },
  templateTitle: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing[3],
  },
  templateSteps: {
    gap: theme.spacing[2],
  },
  templateStep: {
    paddingVertical: theme.spacing[2],
  },
  templateStepText: {
    fontSize: theme.typography.body.md.fontSize,
    lineHeight: 20,
  },
  outlineBuilder: {
    gap: theme.spacing[4],
  },
  builderTitle: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '600',
  },
  builderContent: {
    gap: theme.spacing[2],
  },
  section: {
    borderWidth: theme.spacing.borderWidth.thin,
    borderColor: theme.colors.border.light,
    borderRadius: theme.spacing.borderRadius.sm,
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: theme.spacing[3],
    borderBottomWidth: theme.spacing.borderWidth.thin,
    borderBottomColor: theme.colors.border.light,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '500',
    marginLeft: theme.spacing[2],
  },
  pointsList: {
    padding: theme.spacing[3],
    gap: theme.spacing[2],
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointText: {
    fontSize: theme.typography.body.md.fontSize,
    flex: 1,
  },
  removeButton: {
    padding: theme.spacing[1],
  },
  addPointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[3],
    gap: theme.spacing[2],
    borderTopWidth: theme.spacing.borderWidth.thin,
    borderTopColor: theme.colors.border.light,
  },
  addPointInput: {
    flex: 1,
    borderWidth: theme.spacing.borderWidth.thin,
    borderRadius: theme.spacing.borderRadius.sm,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    fontSize: theme.typography.body.md.fontSize,
  },
  addButton: {
    padding: theme.spacing[2],
    borderRadius: theme.spacing.borderRadius.sm,
  },
  submitButton: {
    paddingVertical: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing[5],
  },
  submitButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[10],
  },
  successText: {
    fontSize: theme.typography.body.xl.fontSize,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: theme.spacing[4],
  },
});
