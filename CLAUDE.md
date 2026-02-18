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

## 📊 Current State (Updated Feb 2026)

### ✅ SHIPPED & STABLE
- **Core stack:** React Native 0.81.5 + Expo 54, TypeScript, Zustand, Supabase
- **Auth & Onboarding:** 5-step personalization, guest mode
- **Home screen:** Learning path visualization, category cards
- **OutlineBuilder:** ✅ COMPLETE - mobile-native bullet outline builder
- **FullPracticeLesson:** ✅ INTEGRATED - OutlineBuilder + Voice mode
- **Database:** ✅ SEEDED - learning paths, units, questions
- **Voice Practice:** ✅ COMPLETE - Record → Local Audio → base64 → Whisper → Transcript → AI Feedback

### 🔴 CRITICAL GAPS
- Practice Tab Redesign
- Learn Tab Redesign  
- Database: Add `total_lessons_completed` column

## 🏗️ Architecture Patterns

### File Structure
```
/src
  /screens/lessons/
    FullPracticeLesson.tsx   ✅ Complete with OutlineBuilder + Voice
  /components/
    OutlineBuilder.tsx      ✅ COMPLETE
    VoiceRecorder.tsx      ✅ COMPLETE - audio stays local
  /services/
    aiFeedbackService.ts   ✅ COMPLETE
    aiService.ts           ✅ COMPLETE
```

### State Management
- **Zustand:** Global state (questions, practice, progress)
- **React Context:** Auth + theme
- **AsyncStorage:** Guest session persistence

## 🎮 5 Lesson Types
1. **LEARN (5 min):** 5 swipeable cards → +10 XP
2. **DRILL (7 min):** Master ONE step → +10 XP
3. **PATTERN (12 min):** Learn pattern with OutlineBuilder → +15 XP
4. **FULL PRACTICE (15 min):** Outline or Voice → +20 XP
5. **QUIZ (10 min):** 10 MCQs → +50 XP

## 🎤 Voice Practice Flow (IMPORTANT)
**Audio stays local - only transcription is stored!**

```
1. Record audio (stays on device)
2. Convert to base64  
3. Send base64 → Whisper API (Edge Function)
4. Get transcription back
5. AI analyzes transcription for feedback
6. Store: transcription + AI feedback ONLY
```

## 🎨 Design System
- **Primary:** Black and White (Swiss-style)
- **Style:** High contrast, minimalist
- **Theme:** Light/dark via ThemeContext
- **Typography:** Bold, confident

## ⚡ Quick Commands
```bash
npm start            # Expo dev server
npx tsc --noEmit   # TypeScript check

# Supabase
npx supabase db push --include-all --yes
npx supabase functions deploy transcribe
npx supabase secrets set OPENAI_API_KEY=your-key
```

## 🧠 Elite Builder Mindset
1. **Ship the core loop:** Onboarding → Learn → Drill → Pattern → Practice → Quiz → Progress
2. **Mobile-native first:** Bullet outlines > essays, voice > typing
3. **Framework mastery:** AI should critique CIRCLES application, not just "good/bad"
4. **Progress is everything:** Users need to see "68% ready" moving toward "80% interview ready"

**Status:** Voice practice complete! Audio stays local, only transcript + AI feedback stored.

---
*Elite builders ship.*
