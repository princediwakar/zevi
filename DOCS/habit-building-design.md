# Habit Building Design for Zevi

## The Core Insight

> "If a task is clearly defined and scheduled, I would do it. Otherwise I would procrastinate."

The app must answer: **"What should I do RIGHT NOW?"** with absolute clarity.

---

## Design Philosophy

**Bold. Immersive. One thing at a time.**

- No clutter. No "AI slop" UI.
- Every element must earn its place.
- Full-screen experiences, not list views.
- Big typography. Confident design.

---

## The Four Tabs

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  PRACTICE   │    LEARN    │  PROGRESS   │   PROFILE   │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

---

## Tab 1: PRACTICE (Default View)

When user opens app → this is where they land. **One question. Bold.**

```
┌─────────────────────────────┐
│                         🔥 7│
│                             │
│   "Design Spotify           │
│    recommendations?"        │
│                             │
│        [START]              │
│                             │
│  ── different question →   │
└─────────────────────────────┘
```

### If Already Practiced Today

```
┌─────────────────────────────┐
│                         🔥 7│
│                             │
│      ✨ DONE FOR TODAY      │
│                             │
│   Come back tomorrow        │
│   to keep your streak       │
│                             │
│  ── browse categories →   │
└─────────────────────────────┘
```

### The Algorithm
1. If user hasn't practiced today → show personalized question
2. If practiced → show "Done for today" state
3. Questions selected using adaptive algorithm:
   - **Phase 1 (New Users)**: Sequential from learning path
   - **Phase 2 (Returning Users)**: Adapt based on weak areas, attempted questions, attempted lessons, quiz performance, and category mastery
4. Browse categories always accessible

---

## Tab 2: LEARN

**Same philosophy as Practice: One lesson. Bold. Done.**

```
┌─────────────────────────────┐
│  LEARN              5/20 📚 │
│                             │
│   Today's Lesson:           │
│                             │
│   "CIRCLES Framework"       │
│   5 min read               │
│                             │
│        [START]              │
│                             │
│  ── all categories →      │
└─────────────────────────────┘
```

### If Already Learned Today

```
┌─────────────────────────────┐
│  LEARN              5/20 📚 │
│                             │
│      ✓ DONE LEARNING        │
│                             │
│   Come back tomorrow        │
│   for new lessons           │
│                             │
│  ── all categories →      │
└─────────────────────────────┘
```

### On Category Tap → Full Screen Lesson
No back button. Just content and progress.

---

## Learn Habit Loop

Just like Practice, Learn needs a clear habit loop:

1. **Open Learn tab** → See today's lesson
2. **Tap START** → Read/bite-sized content
3. **Done** → "Now practice what you learned" prompt
4. **Practice** → Jump to Practice tab with question from same category
5. **Come back tomorrow** → New lesson

---

## The Two Daily Habits

| Time of Day | Habit | Action |
|-------------|-------|--------|
| Morning | Learn | 5 min lesson |
| Anytime | Practice | 1 question |

Both should feel equally natural. Both should have "done for today" states.

---

## Tab 3: PROGRESS

Current implementation is good. Keep as is. Clean, comprehensive.

---

## Tab 4: PROFILE

Current implementation is good. Keep as is. Minimal and functional.

---

## The Habit Flow

1. **Open app** → See ONE question (bold)
2. **Tap START** → Do the question
3. **Done** → Full-screen celebration
4. **Come back tomorrow** → New question

---

## Data Tracking

Use single unified streak for both Practice and Learn:

### Streak Tracking (Already Implemented)
| Field | Type | Description |
|-------|------|-------------|
| `current_streak` | int | Days in a row practiced/learned |
| `last_practice_date` | date | Last day practiced (YYYY-MM-DD) |
| `total_questions_completed` | int | All-time questions done |
| `total_lessons_completed` | int | All-time lessons done |

**Logic:**
- If `last_practice_date == today` → Already done → Show "Done for [Practice/Learn]"
- If `last_practice_date == yesterday` → Continue streak
- Otherwise → Reset streak to 0

### Database Changes Needed
```sql
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS total_lessons_completed INTEGER DEFAULT 0;
```

---

## Smart Connections

After completing a lesson → auto-recommend a question from that category.

*"Now practice what you learned."*

---

## Design Principles

### 1. One Thing Only
- When user opens app → ONE question to do
- No competing cards, no quick actions visible
- Everything else hidden behind taps

### 2. Bold Typography
- Big question text (24-32pt)
- Massive START button
- Streak shown but not competing for attention

### 3. Immersive
- Full-screen question, not a card
- Full-screen "done" state, not a toast
- No modals, no popups

### 4. Done State
- Full-screen "DONE FOR TODAY"
- Gives permission to stop
- Shows streak prominently

---

## What NOT To Add

- ❌ Learning % on Progress tab
- ❌ More quick action buttons
- ❌ Complex recommendation UI
- ❌ Additional screens/modals
- ❌ Progress bars everywhere
- ❌ Category cards with icons

---

## Current App Gap Analysis

### Already Implemented
- ✅ Four tabs (Home/Learn/Progress/Profile)
- ✅ Streak tracking
- ✅ 20+ achievements
- ✅ Framework & pattern mastery
- ✅ Weak area detection
- ✅ Quick actions (hidden behind taps)
- ✅ Activity heatmap
- ✅ XP system
- ✅ Comprehensive Progress tab
- ✅ Learn tab with categories + lessons
- ✅ Profile tab with settings

### Need to Build

**Practice Tab:**
- ❌ Today's Pick hero (simplify existing Home)
- ❌ "Done for today" full-screen state
- ❌ Remove clutter (keep question + streak + browse accessible)

**Learn Tab:**
- ❌ Today's lesson hero (same as Practice)
- ❌ "Done learning" full-screen state
- ❌ Track lessons completed (use unified streak)
- ❌ Auto-jump to Practice after lesson

**Database:**
- ❌ Add `total_lessons_completed` column

**Connection:**
- ❌ Learn → Practice auto-connection after lesson
- ❌ "Now practice what you learned" prompt

---

## Implementation Plan

### Phase 1: PRACTICE Tab
1. Simplify Home to show ONE question + streak
2. Add "Done for today" state
3. Keep browse categories accessible

### Phase 2: LEARN Tab (NEW - Not just simplified, but habit-forming)
1. Add "Today's Lesson" hero (parallel to Practice)
2. Use existing unified streak (no separate lesson streak)
3. Add "Done learning" state
4. After lesson → prompt to practice

### Phase 3: Connect Learn ↔ Practice
1. After lesson completion → "Practice now?" with question from same category
2. Auto-navigate to that question

### Phase 4: Polish
1. Full-screen celebration after questions

---

## Example Flow

**User opens app**
```
┌─────────────────────────────┐
│                         🔥 7│
│                             │
│   "Design Spotify           │
│    recommendations?"        │
│                             │
│        [START]              │
│                             │
│  ── different question →   │
└─────────────────────────────┘
```

**Taps START → Answers → Done**
```
┌─────────────────────────────┐
│                         🔥 7│
│                             │
│      ✨ DONE FOR TODAY      │
│                             │
│   Come back tomorrow        │
│   to keep your streak       │
│                             │
│  ── browse categories →   │
└─────────────────────────────┘
```

---

*Document Version: 3.0*
*Updated: 2026-02-15*
*Design Philosophy: Bold, Immersive, Clean*
