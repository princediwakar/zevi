import { create } from 'zustand';
import { Question, PracticeMode, AIFeedback, MCQAnswer, UserOutline } from '../types';
import * as practiceService from '../services/practiceService';
import * as progressService from '../services/progressService';
import { logger } from '../utils/logger';

export interface QuizAnswer {
  questionId: string;
  subQuestionIndex: number; // 0-based index of sub-question within the main question
  questionText: string;
  subQuestionPrompt: string;
  selectedOptionText: string;
  isCorrect: boolean;
  timeSpent: number;
}

interface PracticeState {
  // Current active question state
  currentQuestion: Question | null;
  currentMode: PracticeMode;
  currentQuestionIndex: number; // For sub-questions within a single Question
  currentSessionId: string | null;
  mcqAnswers: MCQAnswer[]; // Answers for the current question's sub-questions
  textAnswer: string;
  outlineAnswer: UserOutline | null;
  feedback: AIFeedback | null;
  
  // Quiz/Queue state
  questionQueue: Question[];
  currentQueueIndex: number;
  quizAnswers: QuizAnswer[]; // History of ALL answers (granular)
  isQuizActive: boolean;
  
  // Flattened Quiz Progress
  totalQuizSteps: number; // Total number of sub-questions in the quiz
  currentQuizStep: number; // Current global step number (1-based)

  // Metadata
  startTime: number;
  timeSpentSeconds: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  startPractice: (question: Question, mode: PracticeMode, userId: string, isGuest?: boolean) => Promise<void>;
  startQuiz: (questions: Question[], userId: string, isGuest?: boolean) => Promise<void>;
  answerMCQSubQuestion: (questionIndex: number, optionIndex: number, correct: boolean) => void;
  setTextAnswer: (answer: string) => void;
  setOutlineAnswer: (outline: UserOutline) => void;
  getAnswerAsText: () => string;
  saveDraft: (userId: string, isGuest?: boolean) => Promise<boolean>;
  loadDraft: (userId: string, questionId: string, isGuest?: boolean) => Promise<void>;
  submitAnswer: (userId: string, isGuest?: boolean) => Promise<boolean>;
  generateFeedback: (userId: string, isGuest?: boolean) => Promise<void>;
  nextMCQQuestion: () => void;
  nextQuizQuestion: (userId: string, isGuest?: boolean) => Promise<boolean>; // Returns true if there is a next step/question
  calculateMCQScore: () => number; // Local score for current question
  calculateQuizScore: () => { correct: number; total: number; percentage: number }; // Global score
  resetPractice: () => void;
  updateTimeSpent: () => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  currentQuestion: null,
  currentMode: 'mcq',
  currentQuestionIndex: 0,
  currentSessionId: null,
  mcqAnswers: [],
  textAnswer: '',
  outlineAnswer: null,
  feedback: null,
  
  questionQueue: [],
  currentQueueIndex: 0,
  quizAnswers: [],
  isQuizActive: false,
  
  totalQuizSteps: 0,
  currentQuizStep: 0,

  startTime: 0,
  timeSpentSeconds: 0,
  loading: false,
  error: null,

  startPractice: async (question: Question | null, mode: PracticeMode, userId: string, isGuest: boolean = false) => {
    if (!question) {
      logger.error('Cannot start practice: question is null or undefined');
      set({ loading: false, error: 'No question available to practice' });
      return;
    }

    set({ loading: true, error: null });
    try {
      // Create practice session in database or local storage
      const sessionId = await practiceService.createPracticeSession({
        userId,
        questionId: question.id,
        mode,
        isGuest,
      });

      const subQuestionsLength = question.mcq_version?.sub_questions?.length || 1;

      set({
        currentQuestion: question,
        currentMode: mode,
        currentSessionId: sessionId,
        currentQuestionIndex: 0,
        mcqAnswers: [],
        textAnswer: '',
        startTime: Date.now(),
        timeSpentSeconds: 0,
        loading: false,
        // If not already in a quiz, reset quiz state
        ...(get().isQuizActive ? {} : {
            questionQueue: [],
            currentQueueIndex: 0,
            quizAnswers: [],
            isQuizActive: false,
            totalQuizSteps: subQuestionsLength,
            currentQuizStep: 1
        })
      });
    } catch (error) {
      logger.error('Error starting practice:', error);
      // Continue without session ID for offline mode (implicit if generic error, creates "phantom" session state)
      const subQuestionsLength = question.mcq_version?.sub_questions?.length || 1;
      set({
        currentQuestion: question,
        currentMode: mode,
        currentSessionId: null,
        currentQuestionIndex: 0,
        mcqAnswers: [],
        textAnswer: '',
        startTime: Date.now(),
        timeSpentSeconds: 0,
        loading: false,
        error: isGuest ? 'Guest session failed' : 'Failed to create session. Continuing in offline mode.',
         ...(get().isQuizActive ? {} : {
            questionQueue: [],
            currentQueueIndex: 0,
            quizAnswers: [],
            isQuizActive: false,
            totalQuizSteps: subQuestionsLength,
            currentQuizStep: 1
        })
      });
    }
  },

  startQuiz: async (questions: Question[], userId: string, isGuest: boolean = false) => {
    if (!questions || questions.length === 0) {
      logger.error('Cannot start quiz: no questions provided');
      return;
    }

    // Filter out any null/undefined questions and validate
    const validQuestions = questions.filter(q => q && q.id);
    if (validQuestions.length === 0) {
      logger.error('Cannot start quiz: no valid questions in the list');
      return;
    }

    // Calculate total steps (sum of all sub-questions)
    let totalSteps = 0;
    validQuestions.forEach(q => {
      totalSteps += (q.mcq_version?.sub_questions?.length || 0);
    });

    set({
      questionQueue: validQuestions,
      currentQueueIndex: 0,
      quizAnswers: [],
      isQuizActive: true,
      mcqAnswers: [], // Clear any previous single practice state
      textAnswer: '',
      totalQuizSteps: totalSteps,
      currentQuizStep: 1, // Start at step 1
    });

    // Start the first question
    await get().startPractice(validQuestions[0], 'mcq', userId, isGuest);
  },

  answerMCQSubQuestion: (questionIndex: number, optionIndex: number, correct: boolean) => {
    const { mcqAnswers } = get();
    const existingAnswerIndex = mcqAnswers.findIndex(a => a.questionIndex === questionIndex);
    
    if (existingAnswerIndex >= 0) {
      const newAnswers = [...mcqAnswers];
      newAnswers[existingAnswerIndex] = { questionIndex, selectedOption: optionIndex, correct };
      set({ mcqAnswers: newAnswers });
    } else {
      set({ mcqAnswers: [...mcqAnswers, { questionIndex, selectedOption: optionIndex, correct }] });
    }
  },

  setTextAnswer: (answer: string) => {
    set({ textAnswer: answer });
  },

  setOutlineAnswer: (outline: UserOutline) => {
    set({ outlineAnswer: outline });
  },

  getAnswerAsText: () => {
    const { textAnswer, outlineAnswer } = get();
    if (outlineAnswer) {
      // Convert outline to structured text representation
      return Object.entries(outlineAnswer)
        .map(([section, points]) => `${section}:\n${points.map(p => `  • ${p}`).join('\n')}`)
        .join('\n\n');
    }
    return textAnswer;
  },

  saveDraft: async (userId: string, isGuest: boolean = false) => {
    const { currentQuestion, textAnswer } = get();
    if (!currentQuestion || !textAnswer.trim()) return false;

    try {
      await practiceService.saveDraft({
        userId,
        questionId: currentQuestion.id,
        draftText: textAnswer,
        isGuest,
      });
      return true;
    } catch (error) {
      logger.error('Error saving draft:', error);
      set({ error: 'Failed to save draft' });
      return false;
    }
  },

  loadDraft: async (userId: string, questionId: string, isGuest: boolean = false) => {
    try {
      const draftText = await practiceService.getDraft(userId, questionId, isGuest);
      if (draftText) {
        set({ textAnswer: draftText });
      }
    } catch (error) {
      logger.error('Error loading draft:', error);
    }
  },

  submitAnswer: async (userId: string, isGuest: boolean = false) => {
    const {
        currentSessionId,
        textAnswer,
        outlineAnswer,
        mcqAnswers,
        currentQuestion,
        currentMode,
        isQuizActive,
        quizAnswers,
        currentQuestionIndex
    } = get();

    if (!currentSessionId || !currentQuestion) return false;

    get().updateTimeSpent();
    const { timeSpentSeconds } = get();

    set({ loading: true, error: null });
    try {
      // NOTE: We are submitting primarily to record the DB interaction.
      // For MCQs with multiple parts, we might be calling this multiple times (once per sub-question)
      // OR once at the end. The standard flow calls submitAnswer after EACH sub-question interaction?
      // Based on QuickQuizScreen, it calls submitAnswer() immediately after selection.

      // Use outlineAnswer if available, otherwise textAnswer
      const userAnswer = outlineAnswer || textAnswer;

      // Calculate if the answer is correct for this sub-question
      let isCorrect = false;
      if (currentMode === 'mcq' && mcqAnswers.length > 0) {
        const relevantAnswer = mcqAnswers.find(a => a.questionIndex === currentQuestionIndex);
        isCorrect = relevantAnswer?.correct || false;
      }

      await practiceService.submitAnswer({
        sessionId: currentSessionId,
        userAnswer,
        timeSpentSeconds,
        mcqAnswers: currentMode === 'mcq' ? mcqAnswers : undefined,
        isCorrect,
        isGuest,
      });

      // Update user progress (only if it's the final sub-question or we want incremental updates)
      // Here we do it every time to be safe, though usage stats might be slightly inflated if not careful.
      // But updateProgressAfterCompletion usually increments "questions completed".
      // Ideally we only call this when the *entire* question is done.
      const totalSubQuestions = currentQuestion.mcq_version?.sub_questions.length || 0;
      const isLastSubQuestion = currentQuestionIndex === totalSubQuestions - 1;

      if (isLastSubQuestion) {
        await progressService.updateProgressAfterCompletion(
            userId,
            currentMode,
            currentQuestion.category,
            isGuest,
        );
      }

      // If in quiz mode, record the GRANULAR result
      if (isQuizActive && currentMode === 'mcq' && currentQuestion.mcq_version) {
          const subQ = currentQuestion.mcq_version.sub_questions[currentQuestionIndex];
          
          // Find the specific answer for THIS sub-question index
          const relevantAnswer = mcqAnswers.find(a => a.questionIndex === currentQuestionIndex);
          
          if (relevantAnswer && subQ) {
               const selectedText = subQ.options[relevantAnswer.selectedOption]?.text || "";
               
               const newQuizAnswer: QuizAnswer = {
                  questionId: currentQuestion.id,
                  subQuestionIndex: currentQuestionIndex,
                  questionText: currentQuestion.question_text,
                  subQuestionPrompt: subQ.prompt,
                  selectedOptionText: selectedText,
                  isCorrect: relevantAnswer.correct,
                  timeSpent: timeSpentSeconds
               };
               
               // Check if we already have an answer for this step (to prevent duplicates if user spams)
               const existingIndex = quizAnswers.findIndex(
                   a => a.questionId === currentQuestion.id && a.subQuestionIndex === currentQuestionIndex
               );

               if (existingIndex >= 0) {
                   const updated = [...quizAnswers];
                   updated[existingIndex] = newQuizAnswer;
                   set({ quizAnswers: updated });
               } else {
                   set({ quizAnswers: [...quizAnswers, newQuizAnswer] });
               }
          }
      }

      set({ loading: false });
      return true;
    } catch (error) {
      logger.error('Error submitting answer:', error);
      set({ loading: false, error: 'Failed to submit answer' });
      return false;
    }
  },

  generateFeedback: async (userId: string, isGuest: boolean = false) => {
    const { currentQuestion, textAnswer, outlineAnswer, currentSessionId } = get();
    const userAnswer = outlineAnswer || textAnswer;
    if (!currentQuestion || !userAnswer || !currentSessionId) return;

    set({ loading: true, error: null });
    try {
      // Dynamic import to avoid circular dependency
      const { evaluateAnswer } = require('../services/aiService');
      
      const feedback = await evaluateAnswer(currentQuestion, userAnswer);

      const { submitAnswer: serviceSubmit } = require('../services/practiceService');
      
      await serviceSubmit({
        sessionId: currentSessionId,
        userAnswer,
        timeSpentSeconds: get().timeSpentSeconds,
        isGuest,
        aiFeedback: feedback
      });
      
      set({ loading: false, feedback });
    } catch (error) {
      logger.error('Error generating feedback:', error);
      set({ loading: false, error: 'Failed to generate feedback' });
    }
  },

  nextMCQQuestion: () => {
    const { currentQuestionIndex, currentQuestion } = get();
    const totalQuestions = currentQuestion?.mcq_version?.sub_questions.length || 0;
    
    if (currentQuestionIndex < totalQuestions - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  nextQuizQuestion: async (userId: string, isGuest: boolean = false) => {
      const { 
          currentQueueIndex, 
          questionQueue, 
          currentQuestion, 
          currentQuestionIndex,
          currentQuizStep,
          totalQuizSteps
      } = get();
      
      if (!currentQuestion) return false;

      const subQuestions = currentQuestion.mcq_version?.sub_questions || [];
      
      // Check if more sub-questions in CURRENT question
      if (currentQuestionIndex < subQuestions.length - 1) {
          // Stay on same question, next sub-question
          set({ 
              currentQuestionIndex: currentQuestionIndex + 1,
              currentQuizStep: Math.min(currentQuizStep + 1, totalQuizSteps)
          });
          return true;
      } else {
          // Move to NEXT question in queue
          if (currentQueueIndex < questionQueue.length - 1) {
              const nextIndex = currentQueueIndex + 1;
              const nextQuestion = questionQueue[nextIndex];
              
              set({ 
                  currentQueueIndex: nextIndex,
                  currentQuizStep: Math.min(currentQuizStep + 1, totalQuizSteps),
                  // IMPORTANT: Clear previous question's answers to avoid ghost state?
                  // Actually `startPractice` handles clearing mcqAnswers if not quizActive,
                  // BUT in startQuiz we probably don't want to clear mcqAnswers inside startPractice 
                  // every time if we want to support back navigation.
                  // Current implementation clears it in startPractice.
              });
              
              await get().startPractice(nextQuestion, 'mcq', userId, isGuest);
              return true;
          }
      }
      
      return false;
  },

  calculateMCQScore: () => {
    const { mcqAnswers, currentQuestion } = get();
    if (!currentQuestion?.mcq_version) return 0;
    
    const totalQuestions = currentQuestion.mcq_version.sub_questions.length;
    const correctAnswers = mcqAnswers.filter(a => a.correct).length;
    
    return Math.round((correctAnswers / totalQuestions) * 100);
  },

  calculateQuizScore: () => {
      const { quizAnswers, totalQuizSteps } = get();
      const correct = quizAnswers.filter(a => a.isCorrect).length;
      // Use totalQuizSteps as the denominator to reflect true progress/score
      // prevent division by zero
      const total = totalQuizSteps || 1;
      const percentage = Math.round((correct / total) * 100);

      return { correct, total, percentage };
  },

  updateTimeSpent: () => {
    const { startTime } = get();
    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
    set({ timeSpentSeconds });
  },

  resetPractice: () => {
    set({
      currentQuestion: null,
      currentMode: 'mcq',
      currentQuestionIndex: 0,
      currentSessionId: null,
      mcqAnswers: [],
      textAnswer: '',
      outlineAnswer: null,
      startTime: 0,
      timeSpentSeconds: 0,
      error: null,
      // Reset quiz state as well
      questionQueue: [],
      currentQueueIndex: 0,
      quizAnswers: [],
      isQuizActive: false,
      totalQuizSteps: 0,
      currentQuizStep: 0,
    });
  },
}));
