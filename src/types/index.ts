// Core type definitions for the PM Interview Prep App

export type QuestionCategory =
  | "product_sense"
  | "execution"
  | "strategy"
  | "behavioral"
  | "technical"
  | "estimation"
  | "pricing"
  | "ab_testing";

export type FrameworkName =
  | "CIRCLES"
  | "STAR"
  | "METRICS"
  | "PRIORITIZATION"
  | "PROBLEM_STATEMENT"
  | "SWOT"
  | "PORTER_FIVE_FORCES"
  | "BLUE_OCEAN";

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  "product_sense",
  "execution",
  "strategy",
  "behavioral",
  "technical",
  "estimation",
  "pricing",
  "ab_testing"
];

export type Difficulty = 1 | 2 | 3 | 4 | 5 | "beginner" | "intermediate" | "advanced";

export type LessonType = 'learn' | 'drill' | 'pattern' | 'full_practice' | 'quiz';

export type TargetRole = 'apm' | 'pm' | 'spm' | 'gpm';
export type ExperienceLevel = 'new_grad' | 'career_switcher' | 'current_pm';
export type SubscriptionTier = 'free' | 'premium';

export type InterviewType = "phone" | "video" | "in_person" | "phone_screen" | "onsite" | "video_interview";

export type PatternType =
  | "design_x_for_y"
  | "improve_x"
  | "metrics_for_x"
  | "investigate_drop"
  | "strategy"
  | "behavioral_star";

// Outline types
export type UserOutline = Record<string, string[]>; // section -> array of bullet points

export interface OutlineAnswer {
  outline: UserOutline;
  framework?: FrameworkName;
  submittedAt: string;
}

// Question types (MCQ)
export interface MCQOption {
  text: string;
  correct: boolean;
  explanation: string;
}

export interface MCQSubQuestion {
  prompt: string;
  options: MCQOption[];
  difficulty: Difficulty;
}

export interface MCQVersion {
  enabled: boolean;
  sub_questions: MCQSubQuestion[];
}

export interface MCQAnswer {
  questionIndex: number;
  selectedOption: number;
  correct: boolean;
}

export interface EvaluationRubric {
  clarification?: string[];
  user_needs?: string[];
  solutions?: string[];
  prioritization?: string[];
  metrics?: string[];
  tradeoffs?: string[];
}

export interface FrameworkEvaluationRubric {
  [step: string]: {
    weight: number;
    criteria: string[];
    description: string;
  };
}

export type AIFrameworkAnalysis = Record<string, {
  score: number;
  feedback: string;
  strengths: string[];
  missing: string[];
}>;

// Learning Path Structure
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  category: QuestionCategory;
  difficulty_level: Difficulty;
  estimated_hours: number;
  prerequisites: string[]; // UUIDs
  order_index: number;
  is_premium: boolean;
  icon_name: string;
  color: string;
}

export interface Unit {
  id: string;
  learning_path_id: string;
  name: string;
  description: string;
  order_index: number;
  estimated_minutes: number;
  xp_reward: number;
}

export interface Lesson {
  id: string;
  unit_id: string;
  name: string;
  type: LessonType;
  order_index: number;
  content: LessonContent; // Strongly typed content
  estimated_minutes: number;
  xp_reward: number;
  is_locked: boolean;
}

// Lesson content types
export interface LessonContent {
  type: LessonType;

  // Common fields
  framework_name?: FrameworkName;
  title: string;
  description: string;

  // Type-specific content
  learn_content?: LearnContent;
  drill_content?: DrillContent;
  pattern_content?: PatternContent;
  full_practice_content?: FullPracticeContent;
  quiz_content?: QuizContent;
}

export interface LearnContent {
  cards: LearnCard[];
  check_question?: {
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
  };
}

export interface LearnCard {
  title: string;
  content: string;
  image_url?: string;
  // Rich content fields for enhanced learning
  whyItMatters?: string;
  proTip?: string;
  commonMistake?: string;
  example?: string;
  exampleCompany?: string;
  keyPoints?: string[];
  // Self-check question for active recall during learning
  selfCheck?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export interface DrillContent {
  focus_step: string; // Specific framework step to drill
  questions: DrillQuestion[];
}

export interface DrillQuestion {
  text: string;
  correct_options: string[];
  incorrect_options: string[];
  feedback: {
    correct: string;
    incorrect: string;
  };
}

export interface PatternContent {
  pattern_name: string;
  template: string[];
  questions: PatternQuestion[];
}

export interface PatternQuestion {
  text: string;
  framework_name: FrameworkName;
}

export interface FullPracticeContent {
  question: string;
  time_limit?: number; // in minutes
  mode: 'outline' | 'voice';
  framework_name: FrameworkName;
  framework_steps: string[];
  expert_outline: Record<string, string[]>;
}

export interface QuizContent {
  questions: QuizQuestion[];
  passing_score: number; // e.g., 8/10
}

export interface QuizQuestion {
  text: string;
  options?: string[];
  correct_answer: string | number;
  explanation?: string;
}

// User & Progress
export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string; // ISO string from DB

  // Personalization
  target_role?: TargetRole;
  target_companies?: string[];
  experience_level?: ExperienceLevel;
  interview_date?: string; // Date string
  weekly_goal?: number; // lessons per week
  preferred_practice_time?: string;
  
  // Gamification
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  subscription_tier: SubscriptionTier;
}

export interface UserProgress {
  user_id: string;
  current_path_id?: string;
  current_unit_id?: string;
  current_lesson_id?: string;
  
  // Completion
  completed_lessons: string[];
  completed_units: string[];
  completed_paths: string[];
  locked_lessons: string[];
  
  // Stats
  total_questions_completed: number;
  total_mcq_completed: number;
  total_text_completed: number;
  weekly_questions_used: number;
  
  // Performance
  category_progress: Record<string, number>; // Replaces category_mastery or alias
  category_mastery?: Record<string, number>; // Keep for compatibility if needed
  weak_areas: string[];
  
  // Framework & Pattern Mastery (NEW)
  framework_mastery: Record<string, number>; // {circles: 85, star: 70, metrics: 90}
  pattern_mastery: Record<string, number>; // {design_x_for_y: 75, metric_dropped: 60}
  readiness_score: number; // 0-100 overall interview readiness
  readiness_by_category: Record<string, number>; // {product_sense: 82, execution: 68}
  
  // Daily / Streak
  last_practice_date?: string;
  current_streak: number;
  longest_streak: number;
  daily_goal_xp: number;
  practice_calendar: Record<string, number>; // date -> xp
  
  // Meta
  created_at: string;
  updated_at: string;
  week_reset_date?: string;
}

// Gamification
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  xp_reward: number;
  requirement: any;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  is_new: boolean;
}

export interface Streak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  freeze_count: number;
  last_practice_date: string;
  streak_milestone_reached: number;
}

// Question & Practice
export type PracticeMode = "mcq" | "text" | "guided" | "mock";

export interface Question {
  id: string;
  lesson_id?: string; // Link to lesson
  question_text: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  company?: string;
  type: 'mcq' | 'text' | 'fill_blank' | 'match' | 'order';
  framework_name?: FrameworkName;

  // Framework-specific content
  framework_steps?: string[]; // Array of framework step names
  expert_outline?: Record<string, string[]>; // Step -> key points
  evaluation_rubric?: FrameworkEvaluationRubric; // Detailed evaluation criteria

  // Content
  correct_answer?: any; // JSONB
  options?: any; // JSONB for MCQ
  explanation?: string;
  expert_answer?: string;
  xp_reward: number;

  // Legacy fields (optional support)
  interview_type?: InterviewType;
  framework_hint?: string;
  comments?: string;
  acceptance_rate?: number;
  pattern_type?: PatternType;
  related_question_ids?: string[];
  mcq_version?: MCQVersion;
}

export interface AIFeedback {
  score: number; // 1-10
  strengths: string[];
  improvements: string[];
  expertHighlights: string[];
  recommendedPractice: string[];
}

export interface PracticeSession {
  id: string;
  user_id: string;
  lesson_id?: string;
  question_id: string;
  created_at: string;
  user_answer: string | UserOutline;
  is_correct?: boolean;
  time_spent_seconds: number;
  xp_earned: number;
  mcq_answers?: MCQAnswer[];
  
  // Legacy/Optional compatibility
  ai_feedback?: AIFeedback;
  score?: number;
  mode?: PracticeMode;
  attempt_number?: number;
  completed?: boolean;
}

// Additional legacy/utility types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Draft {
  id: string;
  user_id: string;
  question_id: string;
  draft_text: string;
  created_at: string;
  updated_at: string;
}

export type SessionWithQuestion = PracticeSession & { questions?: Pick<Question, 'id' | 'question_text' | 'category' | 'difficulty' | 'company'> };
export type DraftWithQuestion = Draft & { questions?: Pick<Question, 'id' | 'question_text' | 'category' | 'difficulty' | 'company'> };

