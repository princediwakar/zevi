# Learn Tab Implementation Plan

## Problem Statement

1. **Practice Tab is redundant** - Home already has practice questions
2. **No dedicated Learn experience** - Users need structured learning about frameworks and categories
3. **"Continue Learning" is hidden** - Buried at bottom of HomeScreen, hard to find

---

## Solution: Replace Practice Tab with Learn Tab

The Learn tab will teach users **how to answer questions in each category** - when to use which framework and why.

---

## Architecture: Dual Entry Points

```
┌─────────────────────────────────────────────────────────────┐
│                        LEARN TAB                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🔍 Search Frameworks / Categories                          │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  FRAMEWORKS (8)                          See All →    │  │
│  │                                                       │  │
│  │  [CIRCLES]  [STAR]  [METRICS]  [PRIORITIZATION]     │  │
│  │   75%       60%     45%         30%                  │  │
│  │                                                       │  │
│  │  [PROBLEM_  [SWOT]  [PORTER_   [BLUE_               │  │
│  │   STATEMENT]        FIVE_FORCES]  OCEAN]             │  │
│  │    80%        0%      0%            0%              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  BY CATEGORY (6)                                      │  │
│  │                                                       │  │
│  │  📦 Product Sense              2 frameworks    75%  │  │
│  │  ⚡ Execution                  2 frameworks    45%   │  │
│  │  🎯 Strategy                   3 frameworks     0%   │  │
│  │  👤 Behavioral                 1 framework    60%   │  │
│  │  💻 Technical                  0 frameworks     0%   │  │
│  │  📊 Estimation                 0 frameworks     0%   │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  📖 CONTINUE LEARNING                                 │  │
│  │                                                       │  │
│  │  Unit 1: Product Sense Fundamentals                  │  │
│  │  ▶ Lesson 3: CIRCLES Framework        2/5 steps    │  │
│  │  ⏱️ 10 min remaining                               │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Entry Point 1: Browse Frameworks Directly
- Grid of 8 frameworks
- Shows mastery % for each
- Tap → Framework Detail

### Entry Point 2: Browse by Category (6 Categories)
- **Product Sense** - Design, improve, features
- **Execution** - Metrics, prioritization, roadmap
- **Strategy** - Business strategy, market analysis
- **Behavioral** - Leadership, teamwork, conflicts
- **Technical** - Technical PM questions, system design
- **Estimation** - Fermi estimates, guesstimates
- Tap → Category Detail

---

## Screen Structure

### 1. LearnScreen (Main Hub)
**Location:** `src/screens/LearnScreen.tsx` (NEW)

Components:
- Search bar (frameworks + categories)
- "Frameworks" section with horizontal scroll or grid
- "By Category" section with list (6 categories)
- "Continue Learning" card (promoted from Home)

### 2. CategoryDetailScreen
**Location:** `src/screens/CategoryDetailScreen.tsx` (NEW)

Content:
- Category header with icon + description
- "When to use this category" intro
- List of frameworks for this category
- Recommended practice questions

### 3. FrameworkDetailScreen
**Location:** `src/screens/FrameworkDetailScreen.tsx` (NEW)

Content:
- Framework overview (name, description, category)
- **"When to Use This Framework"** ← Critical learning content
- Step-by-step cards (reuse LearnLesson.tsx)
- Interactive MCQ after each step
- Fill-in-the-blank exercises

---

## Content: "When to Use Which Framework"

Add `when_to_use` field to framework data:

```typescript
// src/data/frameworks.ts - Add to each framework
export const FRAMEWORKS: Record<FrameworkName, FrameworkDefinition> = {
  CIRCLES: {
    // ... existing fields
    when_to_use: [
      { question_type: "Design a new product", example: "Design a food delivery app for seniors" },
      { question_type: "Improve an existing product", example: "How would you improve Netflix?" },
      { question_type: "Add a new feature", example: "What feature would you add to Spotify?" },
    ],
    applicable_categories: ["product_sense"],
  },
  STAR: {
    // ... existing fields
    when_to_use: [
      { question_type: "Tell me about a time...", example: "Tell me about a time you dealt with a conflict" },
      { question_type: "Leadership questions", example: "Describe a time you led a team through challenge" },
    ],
    applicable_categories: ["behavioral"],
  },
  METRICS: {
    // ... existing fields
    when_to_use: [
      { question_type: "Define metrics for...", example: "What metrics would you track for Instagram?" },
      { question_type: "Metrics dropped", example: "Why did DAU drop 20%?" },
      { question_type: "A/B testing", example: "How would you test a new recommendation algorithm?" },
    ],
    applicable_categories: ["execution", "ab_testing"],
  },
  // ... etc
};
```

---

## File Changes

### New Files
| File | Purpose |
|------|---------|
| `src/screens/LearnScreen.tsx` | Main Learn hub |
| `src/screens/CategoryDetailScreen.tsx` | Category detail view |
| `src/screens/FrameworkDetailScreen.tsx` | Framework deep dive |
| `src/components/FrameworkCard.tsx` | Reusable framework card |
| `src/components/CategoryCard.tsx` | Reusable category card |
| `src/components/WhenToUseCard.tsx` | "When to use" guidance |
| `src/components/FillInBlank.tsx` | Fill-in-blank exercise |

### Modified Files
| File | Changes |
|------|---------|
| `src/navigation/types.ts` | Add new screen types |
| `src/navigation/BottomTabNavigator.tsx` | Replace Practice tab with Learn |
| `src/screens/HomeScreen.tsx` | Move "Continue Learning" to top |
| `src/data/frameworks.ts` | Add `when_to_use` field |

---

## Implementation Tasks

### Phase 1: Navigation & Home (P0) ✅ COMPLETE
- [x] Update navigation types
- [x] Replace Practice tab → Learn tab in BottomTabNavigator
- [x] Create LearnScreen with dual entry
- [x] Fix "Continue Learning" visibility on HomeScreen (move to top)

### Phase 2: Category & Framework Screens (P1) ✅ COMPLETE
- [x] Create CategoryDetailScreen
- [x] Create FrameworkDetailScreen
- [x] Add "When to Use" content to frameworks.ts
- [x] Create reusable cards (FrameworkCard, CategoryCard) - Already existed

### Phase 3: Interactive Learning (P1) ⏳ NOT STARTED
- [ ] Integrate LearnLesson.tsx into FrameworkDetailScreen
- [ ] Add MCQ quizzes per framework step
- [ ] Create FillInBlank component
- [ ] Add fill-in-blank exercises

### Phase 4: Progress Tracking (P2) ⏳ NOT STARTED
- [ ] Track framework mastery in UserProgress
- [ ] Track category mastery
- [ ] Display mastery on LearnScreen

---

## Inline Progress

**Completed:**
- ✅ Phase 1 (P0): All 4 tasks complete
- ✅ Phase 2 (P1): All 4 tasks complete

**Remaining:**
- ⏳ Phase 3 (P1): Interactive learning features
- ⏳ Phase 4 (P2): Progress tracking enhancements

---

## Data Models

### Framework with When to Use
```typescript
interface FrameworkDefinition {
  name: FrameworkName;
  description: string;
  steps: FrameworkStep[];
  icon: string;
  color: string;
  category: 'product_sense' | 'execution' | 'strategy' | 'behavioral';
  
  // NEW
  when_to_use: WhenToUseRule[];
  applicable_categories: QuestionCategory[];
}

interface WhenToUseRule {
  question_type: string;
  example: string;
}
```

### UserProgress Enhancement
```typescript
interface UserProgress {
  // Existing fields...
  
  // NEW
  framework_mastery: Record<string, number>; // {circles: 75, star: 60}
  category_mastery: Record<string, number>;   // {product_sense: 80, execution: 45}
}
```

---

## UI Mockups

### LearnScreen Layout
```
┌────────────────────────────────────────┐
│ LEARN                                   │
├────────────────────────────────────────┤
│ 🔍 Search frameworks or categories     │
│                                        │
│ FRAMEWORKS                   See All → │
│ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │CIRCLES │ │  STAR  │ │METRICS │       │
│ │  75%   │ │  60%   │ │  45%   │       │
│ └────────┘ └────────┘ └────────┘       │
│                                        │
│ BY CATEGORY (6)                        │
│ ┌────────────────────────────────┐     │
│ │ 📦 Product Sense        75%   │     │
│ │    2 frameworks                │     │
│ ├────────────────────────────────┤     │
│ │ ⚡ Execution             45%  │     │
│ │    2 frameworks                │     │
│ ├────────────────────────────────┤     │
│ │ 🎯 Strategy              0%   │     │
│ │    3 frameworks                │     │
│ ├────────────────────────────────┤     │
│ │ 👤 Behavioral            60%   │     │
│ │    1 framework                 │     │
│ ├────────────────────────────────┤     │
│ │ 💻 Technical             0%   │     │
│ │    0 frameworks                │     │
│ ├────────────────────────────────┤     │
│ │ 📊 Estimation            0%    │     │
│ │    0 frameworks                │     │
│ └────────────────────────────────┘     │
│                                        │
│ 📖 Continue Learning                   │
│ ┌────────────────────────────────┐     │
│ │ Unit 1: Product Sense          │     │
│ │ ▶ CIRCLES Framework    2/5    │     │
│ │ ⏱️ 10 min remaining            │     │
│ └────────────────────────────────┘     │
└────────────────────────────────────────┘
```

### FrameworkDetailScreen Layout
```
┌────────────────────────────────────────┐
│ ← Back          CIRCLES         75%   │
├────────────────────────────────────────┤
│                                        │
│ ┌────────────────────────────────┐     │
│ │  📦 Product Sense              │     │
│ │  A structured approach to      │     │
│ │  product sense interviews     │     │
│ └────────────────────────────────┘     │
│                                        │
│ ┌────────────────────────────────┐     │
│ │  WHEN TO USE                   │     │
│ │  ─────────────────────────     │     │
│ │  ✓ Design a new product        │     │
│ │  ✓ Improve existing product    │     │
│ │  ✓ Add new feature             │     │
│ └────────────────────────────────┘     │
│                                        │
│ LEARN THE FRAMEWORK                    │
│ ┌────────────────────────────────┐     │
│ │ 1. Comprehend            ○     │     │
│ │ 2. Identify              ○     │     │
│ │ 3. Report                ○     │     │
│ │ 4. Clarify               ○     │     │
│ │ 5. Evaluate             ○     │     │
│ │ 6. Summarize            ○     │     │
│ └────────────────────────────────┘     │
│                                        │
│ PRACTICE QUESTIONS                     │
│ ┌────────────────────────────────┐     │
│ │ "Design Instagram for..."     │     │
│ │ "How would you improve..."    │     │
│ └────────────────────────────────┘     │
└────────────────────────────────────────┘
```

---

## Summary

This plan creates a comprehensive Learn tab that:

1. **Replaces Practice tab** with a true learning experience
2. **Dual entry points** - Browse frameworks OR browse by 6 categories
3. **Teaches when to use which framework** - The critical skill users need
4. **Interactive learning** - MCQs, fill-in-the-blank, step-by-step cards
5. **Progress tracking** - Framework + category mastery

The result: Users learn not just frameworks, but **when and why** to apply each one to different question types.

---

*Plan created: February 14, 2026*
