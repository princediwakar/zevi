import { UserProgress } from '../types';

export interface AchievementDef {
    id: string;
    title: string;
    description: string;
    icon: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    condition: (progress: UserProgress) => boolean;
}

// Achievement tiers
const TIER_COLORS = {
    bronze: '🟤',
    silver: '⚪',
    gold: '🟡',
    platinum: '💎'
};

export const ACHIEVEMENTS: AchievementDef[] = [
    // Streak achievements
    {
        id: 'streak_3',
        title: 'On Fire',
        description: 'Reach a 3-day streak',
        icon: '🔥',
        tier: 'bronze',
        condition: (p) => (p.current_streak || 0) >= 3
    },
    {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Reach a 7-day streak',
        icon: '⚡',
        tier: 'silver',
        condition: (p) => (p.current_streak || 0) >= 7
    },
    {
        id: 'streak_14',
        title: 'Two Week Titan',
        description: 'Reach a 14-day streak',
        icon: '🌟',
        tier: 'gold',
        condition: (p) => (p.current_streak || 0) >= 14
    },
    {
        id: 'streak_30',
        title: 'Monthly Master',
        description: 'Reach a 30-day streak',
        icon: '🏆',
        tier: 'platinum',
        condition: (p) => (p.current_streak || 0) >= 30
    },
    
    // Question count achievements
    {
        id: 'first_step',
        title: 'First Step',
        description: 'Complete your first practice question',
        icon: '🌱',
        tier: 'bronze',
        condition: (p) => (p.total_questions_completed || 0) >= 1
    },
    {
        id: 'getting_started',
        title: 'Getting Started',
        description: 'Complete 5 questions',
        icon: '📚',
        tier: 'bronze',
        condition: (p) => (p.total_questions_completed || 0) >= 5
    },
    {
        id: 'dedicated',
        title: 'Dedicated',
        description: 'Complete 10 questions',
        icon: '🎯',
        tier: 'silver',
        condition: (p) => (p.total_questions_completed || 0) >= 10
    },
    {
        id: 'serious_practice',
        title: 'Serious Practice',
        description: 'Complete 25 questions',
        icon: '💪',
        tier: 'silver',
        condition: (p) => (p.total_questions_completed || 0) >= 25
    },
    {
        id: 'expert',
        title: 'Expert',
        description: 'Complete 50 questions',
        icon: '👑',
        tier: 'gold',
        condition: (p) => (p.total_questions_completed || 0) >= 50
    },
    {
        id: 'master',
        title: 'PM Master',
        description: 'Complete 100 questions',
        icon: '🎓',
        tier: 'platinum',
        condition: (p) => (p.total_questions_completed || 0) >= 100
    },
    
    // Text/Outline practice achievements
    {
        id: 'writer',
        title: 'Wordsmith',
        description: 'Complete 5 text-based answers',
        icon: '✍️',
        tier: 'bronze',
        condition: (p) => (p.total_text_completed || 0) >= 5
    },
    {
        id: 'outline_pro',
        title: 'Outline Pro',
        description: 'Complete 15 text-based answers',
        icon: '📝',
        tier: 'silver',
        condition: (p) => (p.total_text_completed || 0) >= 15
    },
    
    // MCQ achievements
    {
        id: 'quiz_taker',
        title: 'Quiz Taker',
        description: 'Complete 10 MCQ questions',
        icon: '❓',
        tier: 'bronze',
        condition: (p) => (p.total_mcq_completed || 0) >= 10
    },
    {
        id: 'quiz_master',
        title: 'Quiz Master',
        description: 'Complete 30 MCQ questions',
        icon: '🧠',
        tier: 'silver',
        condition: (p) => (p.total_mcq_completed || 0) >= 30
    },
    
    // Framework mastery achievements
    {
        id: 'circles_master',
        title: 'CIRCLES Expert',
        description: 'Reach 80% mastery in CIRCLES',
        icon: '⭕',
        tier: 'silver',
        condition: (p) => (p.framework_mastery?.['CIRCLES'] || 0) >= 80
    },
    {
        id: 'star_master',
        title: 'STAR Expert',
        description: 'Reach 80% mastery in STAR',
        icon: '⭐',
        tier: 'silver',
        condition: (p) => (p.framework_mastery?.['STAR'] || 0) >= 80
    },
    {
        id: 'metrics_master',
        title: 'METRICS Expert',
        description: 'Reach 80% mastery in METRICS',
        icon: '📊',
        tier: 'silver',
        condition: (p) => (p.framework_mastery?.['METRICS'] || 0) >= 80
    },
    {
        id: 'framework_master',
        title: 'Framework Master',
        description: 'Reach 80% in all frameworks',
        icon: '🎓',
        tier: 'gold',
        condition: (p) => {
            const frameworks = ['CIRCLES', 'STAR', 'METRICS', 'PRIORITIZATION'];
            return frameworks.every(fw => (p.framework_mastery?.[fw] || 0) >= 80);
        }
    },
    
    // Readiness achievements
    {
        id: 'halfway_there',
        title: 'Halfway There',
        description: 'Reach 50% interview readiness',
        icon: '📈',
        tier: 'silver',
        condition: (p) => (p.readiness_score || 0) >= 50
    },
    {
        id: 'interview_ready',
        title: 'Interview Ready',
        description: 'Reach 80% interview readiness',
        icon: '🎉',
        tier: 'gold',
        condition: (p) => (p.readiness_score || 0) >= 80
    },
];

export const getUnlockedAchievements = (progress: UserProgress | null): AchievementDef[] => {
    if (!progress) return [];
    return ACHIEVEMENTS.filter(a => a.condition(progress));
};

export const getNextAchievement = (progress: UserProgress | null): AchievementDef | null => {
    if (!progress) return ACHIEVEMENTS[0];
    const unlocked = getUnlockedAchievements(progress);
    const unlockedIds = new Set(unlocked.map(a => a.id));
    return ACHIEVEMENTS.find(a => !unlockedIds.has(a.id)) || null;
};

export const getAchievementProgress = (progress: UserProgress | null): number => {
    if (!progress) return 0;
    const unlocked = getUnlockedAchievements(progress);
    return Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);
};

