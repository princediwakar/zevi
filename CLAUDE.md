# 🚀 Zevi - Elite Product Builder Playbook

**Role:** You're an fully autonomous coding agent, decides, debugs and builds till the app is functional and robust.
**Capability:** Elite Product Builder & Senior Software Engineer
**Mission:** Ship a world-class PM interview prep app with mobile-native AI coaching. Think Duolingo × PM coaching.

## 🎯 Core Product Concept
Mobile-native PM interview prep with **framework mastery + pattern recognition**. AI analyzes framework application (not just answers). Differentiator: bullet outline builder + voice (no essays).

## 🎯 Design Philosophy (Habit Building)
**Bold. Immersive. One thing at a time.**
- No clutter. No "AI slop" UI.
- Every element must earn its place.
- Full-screen experiences, not list views.
- Big typography. Confident design.

### The Four Tabs
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  PRACTICE   │    LEARN    │  PROGRESS   │   PROFILE   │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Tab 1: PRACTICE (Default View)
When user opens app → ONE question. Bold.
- Show personalized question (adaptive algorithm)
- Big START button
- Streak visible but not competing
- "Done for today" full-screen state after completion

### Tab 2: LEARN
**Same philosophy as Practice: One lesson. Bold. Done.**
- "Today's Lesson" hero (parallel to Practice)
- Use existing unified streak (no separate lesson streak)
- "Done learning" full-screen state
- After lesson → prompt to practice

### The Habit Flow
1. **Open app** → See ONE question (bold)
2. **Tap START** → Do the question
3. **Done** → Full-screen celebration
4. **Come back tomorrow** → New question

### Key Metrics to Ship
- **Activation:** 75% complete onboarding → 80% finish first lesson
- **Engagement:** 15-20 min avg session, 40% hit daily goal
- **Learning:** 85% avg framework mastery after path completion
- **Monetization:** 20% free→trial, 40% trial→paid

## 📊 Current State (Updated Feb 2026)

### ✅ SHIPPED & STABLE
- **Core stack:** React Native 0.81.5 + Expo 54, TypeScript, Zustand, Supabase
- **Auth & Onboarding:** 5-step personalization, guest mode
- **Home screen:** Learning path visualization, category cards
- **OutlineBuilder:** ✅ COMPLETE - mobile-native bullet outline builder with pattern/full_practice modes
- **FullPracticeLesson:** ✅ INTEGRATED - uses OutlineBuilder for step-by-step framework practice
- **Database:** ✅ SEEDED - 2 learning paths, 5 units, 50 questions (with MCQ data)
- **Quick Quiz:** ✅ WORKING - Multiple choice questions with proper UUIDs
- **Four tabs:** Home/Learn/Progress/Profile navigation
- **Streak tracking:** current_streak, longest_streak, last_practice_date

### 🔴 CRITICAL GAPS (Habit Building Implementation)

**Phase 1: Practice Tab Redesign**
- ❌ Today's Pick hero (simplify existing Home) - NEEDS BUILD
- ❌ "Done for today" full-screen state - NEEDS BUILD
- ❌ Remove clutter (keep question + streak + browse accessible)

**Phase 2: Learn Tab Redesign**
- ❌ Today's lesson hero - NEEDS BUILD
- ❌ "Done learning" full-screen state - NEEDS BUILD
- ❌ Track lessons completed (use unified streak) - NEEDS BUILD
- ❌ Auto-jump to Practice after lesson - NEEDS BUILD

**Phase 3: Database**
- ❌ Add `total_lessons_completed` column - NEEDS BUILD

**Phase 4: Connection**
- ❌ Learn → Practice auto-connection after lesson - NEEDS BUILD
- ❌ "Now practice what you learned" prompt - NEEDS BUILD

## 🏗️ Architecture Patterns

### File Structure (Current)
```
/src
  /screens/lessons/           # 5 lesson types
    LearnLesson.tsx          🟡 Needs swipeable cards
    DrillLesson.tsx          🟡 Needs single-step focus
    PatternLesson.tsx        ✅ Uses OutlineBuilder correctly
    FullPracticeLesson.tsx   ✅ Complete with OutlineBuilder integration
    QuizLesson.tsx           ✅ Complete - MCQ quiz functionality

  /components/
    OutlineBuilder.tsx       ✅ COMPLETE - 581 lines, pattern/full_practice modes
    ... + 10+ UI components

  /stores/                   ✅ Zustand stores complete
  /services/                 🟡 AI feedback needs enhancement
  /types/                    ✅ TypeScript definitions solid
```

### State Management
- **Zustand:** Global state (questions, practice, progress)
- **React Context:** Auth + theme
- **AsyncStorage:** Guest session persistence

### Database Schema (Supabase PostgreSQL)
Key tables: `users`, `learning_paths`, `units`, `lessons`, `questions`, `user_progress`, `practice_sessions`

## 🎮 5 Lesson Types (From NEW_PLAN.md)
1. **LEARN (5 min):** 5 swipeable cards explaining framework → +10 XP
2. **DRILL (7 min):** Master ONE framework step through repetition → +10 XP
3. **PATTERN (12 min):** Learn interview pattern with OutlineBuilder → +15 XP
4. **FULL PRACTICE (15 min):** Complete question, timed, OutlineBuilder or voice → +20 XP
5. **QUIZ (10 min):** 10 questions testing unit mastery (8/10 to unlock) → +50 XP

## 🚨 Implementation Priorities (Order Matters)

### PHASE 1: Core Loop (✅ COMPLETED)
1. ✅ Database seeded with learning paths and questions
2. ✅ Quick Quiz working with MCQ questions
3. ✅ Guest mode functional
4. ✅ TypeScript errors fixed (0 errors)

### PHASE 2: Core Experience
1. **AI Framework Analysis** - Enhance aiFeedbackService.ts with CIRCLES/STAR/METRICS rubrics
2. **VoiceRecorder.tsx** -  (record → Whisper → AI)
3. **Progress Dashboard** - Framework mastery visualization, readiness calculation
4. **Learn/Drill/Pattern polish** - Swipeable cards, templates, single-step focus

### PHASE 3: Advanced
1. **MockInterviewScreen.tsx** -  (45 min, 2 questions)

## 🔧 Key Implementation Details

### AI Feedback System (Current Gap)
**Need:** Framework-specific analysis with rubric scoring
**Pattern:** Question → Framework → Expected steps → Expert outline → User answer → AI analysis
**Output JSON:** `{ overall_score, framework_analysis: { step: {score, feedback, strengths, missing} }, structure_score, depth_score, completeness_score }`

### Mobile-Native Input (✅ Complete)
**OutlineBuilder:** Two modes:
- `pattern`: All sections expandable (used in PatternLesson)
- `full_practice`: Step-by-step navigation (used in FullPracticeLesson)
**Props:** `sections`, `value`, `onChange`, `expertOutline`, `showExpertOutline`, `currentStep`, `mode`

### Voice Recording Flow (Future)
1. User records (3-5 min) → temp blob
2. Upload to Supabase storage
3. Whisper API transcription
4. AI analyzes transcript + delivery (pace, fillers, confidence)
5. Store `audio_url + transcription` in `practice_sessions`

### Readiness Calculation Formula
```typescript
const calculateReadiness = (userProgress) => (
  avg(framework_mastery) * 0.4 +
  avg(pattern_mastery) * 0.3 +
  avg(readiness_by_category) * 0.2 +
  min(questions_practiced / 50, 1) * 0.1
) * 100;
```

## 🎨 Design System
- **Swiss-style:** International Blue (#2563EB) primary
- **High contrast:** Black/white theme
- **Theme-aware:** Colors via ThemeContext
- **Mobile-native:** Bullet outlines, not essays

## ⚡ Quick Commands
```bash
npm install          # Dependencies
npm start            # Expo dev server
npx expo start       # Start Expo with environment
npx tsc --noEmit     # TypeScript check (0 errors)
```

## 🧠 Elite Builder Mindset
1. **Ship the core loop:** Onboarding → Learn → Drill → Pattern → Practice → Quiz → Progress
2. **Mobile-native first:** Bullet outlines > essays, voice > typing
3. **Framework mastery:** AI should critique CIRCLES application, not just "good/bad"
4. **Monetize through value:** Voice practice and mock interviews as premium features
5. **Progress is everything:** Users need to see "68% ready" moving toward "80% interview ready"

**Status:** App is functional! Core quiz loop working. Focus on AI feedback and polish next.

---
*Elite builders ship.*
