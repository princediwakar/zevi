import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { CheckCircle, XCircle } from 'lucide-react-native';

interface FillInBlankProps {
  sentence: string;
  blanks: {
    position: number; // word position in sentence
    answer: string;
    hint?: string;
  }[];
  onComplete: (success: boolean) => void;
}

export function FillInBlank({ sentence, blanks, onComplete }: FillInBlankProps) {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Split sentence into words for rendering
  const words = sentence.split(' ');

  const handleAnswerChange = (index: number, value: string) => {
    setUserAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
    
    // Check all answers
    const allCorrect = blanks.every(
      blank => userAnswers[blank.position]?.toLowerCase().trim() === blank.answer.toLowerCase()
    );
    
    onComplete(allCorrect);
  };

  const checkAnswer = (blank: { position: number; answer: string }) => {
    const userAnswer = userAnswers[blank.position]?.toLowerCase().trim();
    return userAnswer === blank.answer.toLowerCase();
  };

  const getWordStyle = (index: number) => {
    const blank = blanks.find(b => b.position === index);
    if (!blank) return {};
    
    if (submitted && showResults) {
      const isCorrect = checkAnswer(blank);
      return {
        borderBottomColor: isCorrect ? theme.colors.semantic.success : theme.colors.semantic.error,
        borderBottomWidth: 2,
      };
    }
    
    return {
      borderBottomColor: theme.colors.primary[500],
      borderBottomWidth: 2,
    };
  };

  const renderSentence = () => {
    return (
      <View style={styles.sentenceContainer}>
        {words.map((word, index) => {
          const blank = blanks.find(b => b.position === index);
          
          if (blank) {
            return (
              <View key={index} style={[styles.wordWrapper, getWordStyle(index)]}>
                <TextInput
                  style={[
                    styles.blankInput,
                    submitted && showResults && {
                      color: checkAnswer(blank) 
                        ? theme.colors.semantic.success 
                        : theme.colors.semantic.error,
                    }
                  ]}
                  value={userAnswers[index] || ''}
                  onChangeText={(value) => handleAnswerChange(index, value)}
                  placeholder="?"
                  placeholderTextColor={theme.colors.text.disabled}
                  editable={!submitted}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {submitted && showResults && (
                  checkAnswer(blank) 
                    ? <CheckCircle size={16} color={theme.colors.semantic.success} style={styles.resultIcon} />
                    : <View style={styles.resultIconContainer}>
                        <XCircle size={16} color={theme.colors.semantic.error} />
                        <Text style={styles.correctAnswer}>{blank.answer}</Text>
                      </View>
                )}
              </View>
            );
          }
          
          return (
            <Text key={index} style={styles.word}>
              {word}
            </Text>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        Fill in the blanks to complete the sentence:
      </Text>
      
      {renderSentence()}
      
      {blanks[0]?.hint && !submitted && (
        <Text style={styles.hint}>💡 Hint: {blanks[0].hint}</Text>
      )}

      {!submitted && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={Object.keys(userAnswers).length < blanks.length}
        >
          <Text style={styles.submitButtonText}>Check Answers</Text>
        </TouchableOpacity>
      )}

      {submitted && showResults && (
        <View style={styles.resultContainer}>
          <Text style={[
            styles.resultText,
            { color: blanks.every(b => checkAnswer(b)) 
              ? theme.colors.semantic.success 
              : theme.colors.semantic.error 
            }
          ]}>
            {blanks.every(b => checkAnswer(b)) 
              ? '🎉 Perfect! You got it right!' 
              : 'Not quite. Keep learning!'
            }
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  instruction: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },
  sentenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  word: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginRight: 4,
  },
  wordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  blankInput: {
    fontSize: 16,
    color: theme.colors.text.primary,
    paddingVertical: 2,
    paddingHorizontal: 4,
    minWidth: 60,
    textAlign: 'center',
    fontWeight: '600',
  },
  resultIcon: {
    marginLeft: 2,
  },
  resultIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  correctAnswer: {
    fontSize: 12,
    color: theme.colors.semantic.error,
    marginLeft: 4,
    fontWeight: '600',
  },
  hint: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing[4],
  },
  submitButton: {
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: theme.spacing[4],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: 8,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
