# PM Interview Prep App - Compressed Technical Spec

## Product Concept
Mobile app (React Native) that teaches PM interview skills through **framework mastery** and **pattern recognition**. Think Duolingo's progression + realistic PM interview practice.

**Core Differentiator:** AI analyzes framework application (not just correct/incorrect), mobile-native input (bullet outlines + voice, not essays).

---

## Tech Stack
- React Native (Expo), TypeScript, Zustand, NativeWind
- Supabase (PostgreSQL, Auth)
- Claude API (framework analysis)
- Whisper API (voice transcription)
- Stripe (payments)

---

## Database Schema (Essential Tables)

```sql
-- Users
users: id, email, target_role, interview_date, total_xp, current_level, 
       interview_readiness_score (0-100), current_streak,
       subscription_tier (free/premium)

-- Content structure
learning_paths: id, name, category, order_index
units: id, path_id, name, framework_name, order_index
lessons: id, unit_id, name, type (learn/drill/pattern/full_practice/quiz),
         content (jsonb), xp_reward

-- Questions
questions: id, question_text, pattern_type, primary_framework,
           framework_steps (jsonb), expert_outline (jsonb),
           evaluation_rubric (jsonb)

-- User progress
user_progress: user_id, current_path_id, completed_lessons[],
               framework_mastery (jsonb: {circles: 75, star: 85, ...}),
               pattern_mastery (jsonb), readiness_by_category (jsonb),
               daily_xp, practice_calendar (jsonb)

-- Practice sessions
practice_sessions: id, user_id, question_id, answer_data (jsonb),
                   ai_feedback (jsonb), time_spent, xp_earned
```

---

## 5-Screen Onboarding (Personalization)

1. **Goal**: APM / PM / Senior PM
2. **Timeline**: 1-2 weeks / 3-4 weeks / 1-3 months / 3+ months
3. **Companies**: Meta, Google, Amazon, Startups (multi-select)
4. **Daily practice**: 15 min / 30 min / 45 min
5. **Result**: "Your plan: 5 paths, 28 units, 84 lessons, ~25 hours. Reach 85% ready in 3 weeks"

---

## Home Screen (Learning Path UI)

```
┌─────────────────────────────┐
│ 🔥 7  ⚡ 340 XP             │
│ Interview Ready: 42% 🎯     │
│ ▓▓▓▓▓▓▓░░░░░░░░░░ 42/100  │
│                             │
│ 📗 Product Sense ✓ (100%)   │
│ 📘 Execution 🎯 (65%)       │
│   ├─ ✓ Goal Setting         │
│   ├─ ✓ Metrics Framework    │
│   ├─ → Root Cause (2/4)     │
│   │   ├─ ✓ Learn            │
│   │   ├─ ✓ Drill            │
│   │   ├─ 📕 Practice ← NOW  │
│   │   └─ 🔒 Quiz            │
│   └─ 🔒 A/B Testing         │
│ 📙 Strategy 🔒 (0%)         │
└─────────────────────────────┘
```

**Bottom tabs:** Home | Progress | Practice | Profile

---

## 5 Lesson Types

### 1. LEARN (5 min)
- 5 swipeable cards explaining framework/concept
- Example: "What is CIRCLES?" with video clip
- Light check question at end
- **Output:** +10 XP

### 2. DRILL (7 min)
- Master ONE framework step through repetition
- 5 questions, all focus on same step (e.g., "Comprehend")
- Multi-select: "What should you clarify?"
- Instant feedback
- **Output:** +10 XP, step mastery

### 3. PATTERN (12 min)
- Learn interview pattern (Design X for Y, Metric Dropped, etc.)
- Practice 3 similar questions using pattern template
- **Bullet outline builder** - tap to add points per section
- **Output:** +15 XP, pattern mastery %

### 4. FULL PRACTICE (15 min)
- Complete question, timed
- **Two modes:**
  - **Outline Builder**: Add bullets under each framework step
  - **Voice (Premium)**: Record answer, AI transcribes
- AI analyzes framework usage, depth, completeness
- **Output:** +20 XP, detailed AI feedback

### 5. QUIZ (10 min)
- 10 questions testing unit mastery
- Must score 8/10 to unlock next unit
- Can retry with new questions
- **Output:** +50 XP, unlock next unit

---

## Mobile-Native Input Methods

### Bullet Outline Builder
```
Build your answer:

▸ 1. Clarify (tap to expand)
▾ 2. Segment users
  • Power users who...
  • [Add segment] +
▸ 3. Pain points
▸ 4. Solutions
...

[Get Feedback]
```

**How it works:**
- Tap section → expands
- Tap "Add point" → type short bullet OR pick template
- All bullets saved as JSON structure
- Submit → AI analyzes coverage of each section

### Voice Recording (Premium)
```
🎤 Recording... ⏱️ 2:34

[Pause] [Stop & Submit]
```

**Flow:**
1. User records answer (3-5 min)
2. Whisper API transcribes
3. Claude analyzes transcript using same rubric
4. PLUS delivery analysis: pace (wpm), filler words, confidence

---

## AI Feedback System

**Prompt structure:**
```
Question: [question_text]
Framework: [primary_framework]
Expected steps: [framework_steps from DB]
Expert outline: [expert_outline from DB]
Rubric: [evaluation_rubric from DB]

User's answer: [bullet outline or transcript]

Analyze and return JSON:
{
  overall_score: 7.5,
  framework_analysis: {
    comprehend: {score: 8, feedback: "...", strengths: [...], missing: [...]},
    identify: {score: 7, ...},
    ...
  },
  structure_score: 8,
  depth_score: 6,
  completeness_score: 7,
  key_strengths: ["Strong clarification", ...],
  key_improvements: ["Go deeper on metrics", ...],
  next_practice: ["prioritization", "metrics"]
}
```

**Feedback UI:**
```
Overall: 7.5/10

Structure: 8/10 ⭐⭐⭐⭐
✓ Used CIRCLES well
✓ Covered all steps

Depth: 6/10 ⭐⭐⭐
⚠ Segmentation surface-level
⚠ Need 3-4 user types, not 2

Completeness: 7/10 ⭐⭐⭐⭐
⚠ Missing success metrics

Practice next:
• Metrics questions (8 available)
```

---

## Interview Patterns (8 Total)

Each pattern has template approach:

**Example: "Design X for Y"**
```
Template:
1. Clarify who Y is
2. Segment Y into types
3. Choose primary segment
4. Map their journey
5. Identify pain points
6. Design X to solve pains
7. Prioritize features
8. Define success metrics
```

Users practice 15-20 questions per pattern until mastery.

**Pattern mastery tracked:** `{design_x_for_y: 85%, metric_dropped: 65%, ...}`

---

## Gamification (Minimal)

### XP & Levels
- Drill correct: +2 XP
- Lesson done: +10 XP
- Full practice: +20 XP
- Quiz pass: +50 XP
- Levels: Every 100 XP (1→2→3→4→5)

### Streaks
- Practice daily to maintain
- Push notification if haven't practiced
- Milestones: 7, 14, 30, 100 days

### Achievements (12 total)
- First Lesson, Framework Master, Week Warrior, Interview Ready (80%), etc.

**No gems, no leaderboards** - stay focused on interview prep.

---

## Progress Dashboard

```
Interview Ready: 68% 🎯
▓▓▓▓▓▓▓░░░ 68/100

Framework Mastery:
CIRCLES        ████████ 95%
STAR           ████████ 90%
Metrics        ██████░░ 75%
Prioritization ████░░░░ 55%

Pattern Mastery:
Design X for Y ████████ 85%
Metric Drop    █████░░░ 65%
Prioritize     ████░░░░ 50%

Category Readiness:
Product Sense  ████████ 82%
Execution      ██████░░ 68%
Strategy       ████░░░░ 45%
Behavioral     ████████ 92%

To reach 80% ready:
• Complete Strategy path
• Master prioritization (8 questions left)
Estimated: 9 days
```

---

## Premium Features ($19/mo or $99/yr)

**Free limitations:**
- Outline mode only (no voice)
- No mock interviews

**Premium unlocks:**
- 🎤 Voice practice (record answers)
- 🎭 Mock interviews (45 min, 2 questions, full analysis)
- 📊 Advanced analytics
- 📱 Offline mode

---

## Mock Interview Mode (Premium)

```
🎭 Mock Interview
• 2 random questions (1 product, 1 execution)
• 45 minutes total
• Voice recording only
• No hints, no pausing
• Realistic pressure

[Start Mock Interview]
```

**Post-mock report:**
```
Overall: 7.8/10 ⭐⭐⭐⭐

✓ Interview Ready: Yes

Q1 (Product): 8.5 content, 8.0 structure, 7.0 depth, 8.0 delivery
Q2 (Execution): 7.5 content, 8.5 structure, 7.0 depth, 7.5 delivery

Strengths: Clear frameworks, confident delivery
Improvements: Go deeper on metrics, reduce fillers (12x "um")

[Play Recordings] [Compare Expert Answers]
```

---

## User Flows (Key Paths)

### First-time user
1. Onboarding (2 min) → Personalized plan shown
2. First lesson auto-selected: "Learn: What is CIRCLES?"
3. Complete 5 cards + check question (2 min)
4. +10 XP, next lesson unlocked
5. Prompt: "Great start! Come back tomorrow 🔥"

### Daily active user
1. Opens app → "Continue: Drill - Metrics" highlighted
2. Completes 5-question drill (7 min)
3. +10 XP, daily goal met
4. Streak extended 🔥
5. Push notification next day: "Keep your 8-day streak!"

### Free → Premium conversion
1. User completes several practice sessions
2. Modal: "Upgrade to Premium for voice practice and mock interviews"
3. User upgrades → Stripe payment → Immediate unlimited access

### Reaching 80% ready
1. User completes Strategy path
2. Readiness hits 80%
3. Big celebration: "🎉 Interview Ready! You're ready for Meta, Google, Startups"
4. CTA: "Take a Mock Interview" or "Keep practicing"

---

## File Structure

```
/app
  /screens
    OnboardingScreen.tsx
    HomeScreen.tsx
    LessonScreen.tsx (handles all 5 types)
    FeedbackScreen.tsx
    ProgressScreen.tsx
    MockInterviewScreen.tsx (premium)
    SettingsScreen.tsx
  /components
    LessonCard.tsx
    OutlineBuilder.tsx (bullet point UI)
    VoiceRecorder.tsx
    FeedbackCard.tsx
    ProgressBar.tsx
    StreakBadge.tsx
  /store (Zustand)
    authStore.ts
    progressStore.ts
    lessonsStore.ts
    practiceStore.ts
    subscriptionStore.ts
  /services
    supabase.ts
    claude.ts (AI feedback)
    whisper.ts (voice transcription)
    stripe.ts
  /utils
    calculateReadiness.ts
    checkAchievements.ts

/supabase
  /migrations
    001_create_tables.sql
    002_seed_content.sql
```

---

## 6-Week Build Plan

**Week 1:** Auth, onboarding, database setup, home screen with path UI
**Week 2:** Lesson types (Learn, Drill, Pattern), XP system
**Week 3:** Full Practice (outline + voice), Claude API integration, AI feedback
**Week 4:** 3 paths × 5 units × 3 lessons = 45 lessons + 30 questions with rubrics
**Week 5:** Progress dashboard, streaks, achievements, readiness calculation
**Week 6:** Premium (paywall, Stripe, mock interviews), polish, app store submission

---

## Critical Implementation Notes

### Lesson Content JSON Structure
```typescript
// Stored in lessons.content (jsonb)
{
  type: 'drill',
  framework: 'circles',
  focus_step: 'comprehend',
  questions: [
    {
      text: 'Design meal planning app for busy professionals',
      correct_options: ['Who is busy professional?', 'What does meal planning include?'],
      incorrect_options: ['What database to use?', 'What's business model?'],
      feedback: {
        correct: 'Great! Always clarify user and scope first.',
        incorrect: 'Tech/business come later. Focus on problem definition.'
      }
    }
  ]
}
```

### AI Feedback Caching
- Cache feedback for identical answers to same question
- Key: `hash(question_id + answer_outline)`
- Reduces API costs significantly

### Readiness Calculation
```typescript
const calculateReadiness = (userProgress) => {
  const weights = {
    framework_mastery: 0.4,
    pattern_mastery: 0.3,
    category_completion: 0.2,
    practice_volume: 0.1
  };
  
  return (
    avg(userProgress.framework_mastery) * 0.4 +
    avg(userProgress.pattern_mastery) * 0.3 +
    avg(userProgress.readiness_by_category) * 0.2 +
    min(userProgress.questions_practiced / 50, 1) * 0.1
  ) * 100;
};
```

### Voice Processing Flow
1. User records → save as temp blob
2. Upload to Supabase storage
3. Call Whisper API for transcription
4. Pass transcript to Claude for analysis
5. Store audio_url + transcription in practice_sessions
6. Return combined content + delivery analysis

---

## Key Success Metrics

- **Activation:** 75% complete onboarding, 80% finish first lesson
- **Engagement:** 0.35 DAU/MAU, 15-20 min avg session, 40% hit daily goal
- **Learning:** 85% avg framework mastery after path completion
- **Retention:** 35% D7, 25% D30, 15% D90
- **Monetization:** 20% free→trial, 40% trial→paid, <7% churn

---

## Why This Works

1. **Framework-driven** - Teaches thinking, not memorization
2. **Pattern recognition** - Users see the patterns after 20 questions
3. **Mobile-native** - Bullet outlines + voice (no typing essays)
4. **AI coaching** - Specific framework feedback, not generic grades
5. **Clear progress** - "68% ready" is measurable and motivating
6. **Realistic practice** - Voice mode mirrors actual interviews
7. **Focused gamification** - XP/streaks support learning, not distract

This spec is ready for AI code generation tools. Build the elite PM interview prep app. 🚀