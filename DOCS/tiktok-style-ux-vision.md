# 🎬 Revised Vision: The "Focus Flow" Experience

*Transforming Zevi into a distraction-free, effective practice experience*

---

## The Core Insight (Revised)

After deeper analysis, the goal isn't to make this "TikTok-like" — it's to make practice **effortless**. The current app has too much navigation friction. Users should spend energy on thinking about answers, not navigating screens.

The real problems to solve:
- Too many taps to start practicing
- Context switching breaks flow
- Hard to track progress intuitively

---

## 🏗️ Revised Architecture

### 1. One-Tap Practice Entry

**Current Pain:** Home → Category → Question → Practice (4 taps minimum)

**New Flow:**
```
HomeScreen
    │
    ├── [Big "Start Practice" button] → Full-screen question
    │
    └── [Swipe right on any question card] → Instant practice
```

**Key Change:** Add gesture support to existing question cards as an OPTIONAL quick entry. Don't replace lists — enhance them.

---

### 2. Full-Screen Practice Mode (Keep This)

**Current:** Questions displayed in card with surrounding UI clutter

**New:**
- Full-screen question display (minimal chrome)
- Swipe UP to reveal hints
- Swipe UP again to reveal answer/MCQ options
- Swipe LEFT/RIGHT to skip or save for later
- Tap to type answer

```
┌─────────────────────────────┐
│  ← Back    3/20      ⚙️     │
├─────────────────────────────┤
│                             │
│  "Design a dating app       │
│   for professionals"       │
│                             │
│  [Product Sense] [Google]   │
│                             │
│      ────────               │
│      Tap for               │
│      answer →              │
│                             │
├─────────────────────────────┤
│  💾 Save  |  ⏭️ Skip        │
└─────────────────────────────┘
```

**Why swipe UP specifically?** It's intentional — users must commit to seeing the answer. This prevents accidental spoilers.

---

### 3. Progressive Disclosure (New Concept)

Instead of everything visible at once:

```
Layer 1: Question only (can I answer this?)
    ↓ Swipe up or tap "Show Options"
Layer 2: MCQ Options or Framework Hint
    ↓ Swipe up or tap "Reveal Answer"
Layer 3: Full Answer + AI Feedback
```

**Benefits:**
- Users self-assess before seeing answers
- Maintains learning value
- User controls pace (not auto-advance)

---

### 4. Smart Queue System

**Instead of:** Random questions or linear lists
**Become:** Intelligent question queue based on:
- Spaced repetition (questions user got wrong, shown more often)
- Weak categories (areas user struggles with)
- Time of day (estimation questions in morning, behavioral at night)

```
┌─────────────────────────────┐
│  Today's Focus: Strategy    │
│  Weak Areas: Estimation     │
├─────────────────────────────┤
│                             │
│   "How would you price      │
│    a new coffee subscription│
│    at Starbucks?"          │
│                             │
├─────────────────────────────┤
│  [🎯 Practice Weak Areas]   │
│  [🎲 Random Mix]            │
│  [📚 Category Specific]     │
└─────────────────────────────┘
```

---

### 5. Session-Based Progress (Replace Streaks)

**Instead of:** Daily streak gamification (anxiety-inducing)
**Become:** Session completion feels satisfying

- Clear "X questions remaining in session"
- Progress ring shows completion %
- End-of-session summary with clear next steps
- "Good stopping point" indicators (not "don't break your streak!")

---

## 🎨 Visual Design: "Swiss Focus"

| Before | After |
|--------|-------|
| Questions in card lists | Questions as hero content |
| Multiple navigation options | One primary action per screen |
| Dense information | Progressive disclosure |
| Generic progress bars | Visual progress rings |

**Keep from original:**
- Massive typography for questions
- Black/white + International Blue palette
- Minimal UI chrome

**New additions:**
- Subtle entrance animations (not distracting)
- Smooth transitions between states
- Haptic feedback on key actions (not everywhere)

---

## 🛠️ Technical Implementation

### Dependencies
- ✅ `react-native-reanimated` — Smooth transitions
- ✅ `react-native-gesture-handler` — Swipe gestures
- Need: Better state management for queue

### New Components:

1. **`FocusCard`** — Full-screen question display
2. **`ProgressiveReveal`** — Swipe-to-reveal logic
3. **`SessionQueue`** — Manages question ordering
4. **`ProgressRing`** — Animated session progress
5. **`QuickEntryGesture`** — Swipe-to-practice on existing cards

---

## 📱 Revised Rollout Strategy

### Phase 1: Quick Wins (1-2 days)
- Add "swipe right to practice" to existing QuestionCards
- Add full-screen mode to QuickQuiz
- Add progress rings to session screens

### Phase 2: Focus Mode (3-4 days)
- Build dedicated full-screen practice component
- Implement progressive disclosure
- Add gesture-based navigation within practice

### Phase 3: Intelligence (2-3 days)
- Build smart queue algorithm
- Add weak area detection
- Implement session planning

### Phase 4: Polish (2 days)
- Refine animations
- Add haptic feedback
- Accessibility pass

---

## ❌ What's NOT Changing

- **HomeScreen stays as-is** — Lists are good for browsing
- **Learn tab stays as-is** — Lessons need different UX
- **No auto-advance** — User controls pace
- **No story-style lessons** — Too much friction for learning content
- **No daily streaks** — Focus on session completion instead
- **No "addictive" mechanics** — Focus on effectiveness

---

## ✨ The New Principles

1. **One tap to start** — Minimize friction to practice
2. **Focus over discovery** — Full-screen, no distractions
3. **User control** — No auto-advance, swipe when ready
4. **Progressive disclosure** — Reveal layers intentionally
5. **Session-based** — Clear start/end points
6. **Effectiveness over engagement** — Help users learn, not get hooked

---

## 📋 Updated Checklist

- [ ] Add swipe-to-practice gesture on QuestionCards
- [ ] Create full-screen FocusCard component
- [ ] Implement progressive reveal (question → hints → answer)
- [ ] Build session queue with spaced repetition
- [ ] Add progress ring to practice screens
- [ ] Create "weak areas" detection logic
- [ ] Build session summary screen
- [ ] Add strategic haptic feedback
- [ ] Accessibility review

---

*Document Version: 2.0*
*Created: 2026-02-15*
*Revised based on: Brutal UX Review*
*For: Zevi - PM Interview Prep App*
