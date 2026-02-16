import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Question } from '../types';

export type RootStackParamList = {
  Welcome: undefined;
  Auth: { mode?: 'signin' | 'signup' } | undefined;
  QuickQuiz: { questions?: Question[]; lessonId?: string; sourceQuestionId?: string; questionCount?: number } | undefined;
  QuizResults: { sourceQuestionId?: string } | undefined;
  Main: undefined;
  QuestionList: { category: string };
  QuestionDetail: { questionId: string };
  TextPractice: { questionId: string };
  LessonScreen: { lessonId: string };
  LearnScreen: undefined;
  LearningPathBrowse: undefined;
  CategoryDetail: { category: string };
  FrameworkDetail: { frameworkName: string };
  Progress: undefined;
  Profile: undefined;
  Settings: undefined;
  MainTabs: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  LearnTab: undefined;
  ProgressTab: undefined;
  ProfileTab: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
