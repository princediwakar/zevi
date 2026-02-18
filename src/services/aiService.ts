
import { supabase } from '../lib/supabaseClient';
import { AIFeedback, Question, PracticeSession, UserOutline } from '../types';

// Convert UserOutline to string representation for AI evaluation
const outlineToString = (outline: UserOutline): string => {
  return Object.entries(outline)
    .map(([section, points]) => `${section}:\n${points.map(p => `  • ${p}`).join('\n')}`)
    .join('\n\n');
};

export async function evaluateAnswer(
  question: Question,
  userAnswer: string | UserOutline
): Promise<AIFeedback> {
  try {
    const answerText = typeof userAnswer === 'string' ? userAnswer : outlineToString(userAnswer);

    const { data, error } = await supabase.functions.invoke('evaluate-answer', {
      body: {
        question: question.question_text,
        userAnswer: answerText,
        expertAnswer: question.expert_answer,
        rubric: question.evaluation_rubric,
      },
    });

    if (error) {
      throw error;
    }

    return data as AIFeedback;
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw error;
  }
}
