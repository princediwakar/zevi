export interface OnboardingData {
  targetRole?: 'apm' | 'pm' | 'spm' | 'gpm';
  targetCompanies: string[]; // Can be specific names or categories like 'FAANG', 'Startup'
  experienceLevel?: 'new_grad' | 'career_switcher' | 'current_pm';
  interviewDate?: Date; // Optional, for urgency
  interviewTimeline?: 'urgent' | '1-3_months' | '3+_months' | 'no_date'; // Discrete bucket
  weeklyGoal: number; // days per week (3, 5, 7)
  preferredPracticeTime?: string; // 'morning' | 'evening'
}

export interface OnboardingStepProps {
  onNext: () => void;
  onBack?: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}
