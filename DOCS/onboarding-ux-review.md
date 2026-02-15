# UX Review: Onboarding Flow

**Repository:** Zevi - PM Interview Prep App  
**Framework:** React Native (Expo) with TypeScript  
**Review Date:** 2026-02-14  
**Auditor:** ClaudeUX Auditor  
**Scope:** Onboarding Flow (7 steps)

---

## 1. Repository Analysis and Scope

### Project Overview

| Aspect | Details |
|--------|---------|
| **Framework** | React Native with Expo |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS (via className) |
| **Navigation** | React Navigation (Native Stack) |
| **State Management** | React Context + useState |
| **Backend** | Supabase |

### Onboarding Flow Structure

| Step | Component | Purpose |
|------|-----------|---------|
| 1 | `WelcomeStep` | Entry point - value proposition |
| 2 | `GoalStep` | Capture user's career goal |
| 3 | `CompanyStep` | Select target companies |
| 4 | `ExperienceStep` | Determine experience level |
| 5 | `TimelineStep` | Set interview timeline + weekly practice goal |
| 6 | `ReminderStep` | Configure notification preferences |
| 7 | `PathRevealStep` | Loading screen before completion |

### Routing Configuration

- Entry: `RootStackParamList.Onboarding` → `OnboardingFlow.tsx`
- Exit: `navigation.reset({ routes: [{ name: 'MainTabs' }] })` (src/screens/onboarding/OnboardingFlow.tsx:47-51)

---

## 2. Heuristic Evaluation

| # | Heuristic | Status | Issue/Strength | Code Evidence | Severity |
|---|------------|--------|----------------|---------------|----------|
| 1 | **Visibility of System Status** | ⚠️ Issue | Progress bar is hardcoded/static; no actual progress tracking | `GoalStep.tsx:32` - `<View className="h-full bg-blue-500 w-[16%] rounded-full" />` (16% fixed), similarly 30%, 50%, 70%, 90% in other steps | Moderate |
| 1 | **Visibility of System Status** | ✅ Strength | PathRevealStep shows dynamic status messages | `PathRevealStep.tsx:23-27` - Shows "Analyzing X companies...", "Calibrating for Y role..." | Minor |
| 2 | **Match Between System and Real World** | ✅ Strength | Clear, conversational language | All step titles use natural language: "What's your goal?", "Target companies?", "Your experience level?" | - |
| 3 | **User Control and Freedom** | ⚠️ Issue | Back navigation present but "Skip" only on CompanyStep | `CompanyStep.tsx:73-78` - Skip button only available here; other screens force completion | Moderate |
| 4 | **Consistency and Standards** | ⚠️ Issue | Inconsistent button placement - some use flex-[2] for primary, others full width | `CompanyStep.tsx:80` uses `flex-[2]` while `GoalStep.tsx:76` uses `w-full` | Minor |
| 5 | **Error Prevention** | ✅ Strength | Form validation prevents empty submissions | All steps check `data.targetRole`, `data.targetCompanies.length > 0`, `data.experienceLevel`, `timeline` before enabling Continue | - |
| 6 | **Recognition Rather Than Recall** | ✅ Strength | Visual selection with icons and clear labels | `ExperienceStep.tsx:22-27` - Uses icons (🎓, 🔄, 💼) with descriptive text | - |
| 7 | **Flexibility and Efficiency of Use** | ⚠️ Issue | No way to edit previous selections after moving forward | Once a step is completed, user can only go back; no direct navigation to specific step | Minor |
| 8 | **Aesthetic and Minimalist Design** | ✅ Strength | Clean, minimal UI with Swiss style | Consistent use of Tailwind with proper spacing, rounded corners | - |
| 9 | **Error Recovery** | ⚠️ Issue | No error handling for save failures | `OnboardingFlow.tsx:43-52` - Only logs warning if no user, no user-facing error | Serious |
| 10 | **Help and Documentation** | ⚠️ Issue | No help tooltips or guidance within steps | All steps assume user knows what to do | Minor |

---

## 3. Accessibility Review

| Issue | WCAG Criterion | Code Evidence | Severity | Suggested Fix |
|-------|-----------------|---------------|----------|---------------|
| **Missing accessibility labels** | 4.1.2 Name, Role, Value | `TouchableOpacity` components lack `accessibilityLabel` and `accessibilityHint` | Serious | Add `accessibilityLabel` to all interactive elements |
| **No keyboard navigation** | 2.1.1 Keyboard | React Native doesn't support keyboard navigation out of the box - no `accessibilityRole="button"` | Serious | Add explicit accessibility props |
| **Touch targets too small** | 2.5.5 Target Size | Some buttons like small checkmarks (w-6 h-6) are 24px - below 44px recommended | Moderate | Increase touch targets to minimum 44x44px |
| **No focus indicators** | 2.4.7 Focus Visible | No visual focus states for keyboard/switch navigation | Moderate | Add focus-visible styles |
| **Missing semantic headings** | 1.3.1 Info and Relationships | All text uses `Text` components without proper heading hierarchy | Minor | Use proper heading levels (h1, h2) |
| **Switch component missing labels** | 4.1.2 Name, Role, Value | `ReminderStep.tsx:45` - Switch has no accessibilityLabel | Moderate | Add `accessibilityLabel="Enable Reminders"` to Switch |

---

## 4. User Flow and Interaction Analysis

### Current Flow Diagram

```
WelcomeStep → GoalStep → CompanyStep → ExperienceStep → TimelineStep → ReminderStep → PathRevealStep → MainTabs
```

### Friction Points Identified

1. **Missing Progress Indicator on Welcome**
   - WelcomeStep has no progress bar, creating inconsistent UX
   - File: `WelcomeStep.tsx` - No progress indicator present

2. **Forced Progression Without Skip Options**
   - Only CompanyStep has a "Skip" button
   - Users may want to skip other steps (e.g., ReminderStep)
   - File: `CompanyStep.tsx:73-78`

3. **No Data Persistence on Back Navigation**
   - When going back, data is preserved (good), but no visual feedback of saved state
   - Could cause confusion about whether selections were saved

4. **PathRevealStep Auto-Navigates**
   - 2.5 second delay with no way to skip
   - Users with slow connections may think it's stuck
   - File: `PathRevealStep.tsx:11-15`

5. **No Error Handling for Async Operations**
   - If Supabase save fails, user is silently redirected to MainTabs
   - File: `OnboardingFlow.tsx:43-52`

---

## 5. Visual and Consistency Review

### Layout Consistency

| Aspect | Status | Notes |
|--------|--------|-------|
| **Header Structure** | ✅ Consistent | All steps (except Welcome) have header with back button + progress bar |
| **Content Padding** | ✅ Consistent | Most use `px-6` padding |
| **Button Placement** | ⚠️ Inconsistent | Some use `w-full`, others use `flex-[2]` with gap |
| **Typography** | ✅ Consistent | Uses Tailwind text classes throughout |
| **Spacing** | ✅ Consistent | Uses consistent spacing tokens |

### Issues Identified

1. **Progress Bar Widths Are Hardcoded**
   ```typescript
   // GoalStep - 16%
   <View className="h-full bg-blue-500 w-[16%] rounded-full" />
   
   // CompanyStep - 30%
   <View className="h-full bg-blue-500 w-[30%] rounded-full" />
   ```
   These should be calculated: `(stepIndex + 1) / totalSteps * 100%`

2. **WelcomeStep Lacks Progress Bar**
   - Creates inconsistent experience at the entry point
   - File: `WelcomeStep.tsx`

3. **Lucide Icons Imported But Not Used**
   ```typescript
   // GoalStep.tsx:6
   import { ChevronLeft } from 'lucide-react-native';
   // But actually uses: <Text className="text-2xl text-slate-800">←</Text>
   ```

4. **Inconsistent Selection Indicators**
   - GoalStep uses filled circle with checkmark
   - ExperienceStep uses empty circle with dot
   - TimelineStep uses empty circle with dot
   - Should unify selection patterns

---

## 6. Strengths and Patterns Summary

### What's Working Well

1. **Clean Swiss Design Aesthetic**
   - Consistent use of `slate` colors
   - Proper elevation with shadows
   - Generous whitespace

2. **Proper Form Validation**
   - Continue buttons disabled until required fields are filled
   - Visual feedback with gray/blue states

3. **State Management**
   - Centralized `OnboardingData` state
   - Proper prop drilling with `updateData` callback

4. **Good Use of Visual Selection**
   - Cards with icons for choices
   - Clear selected/unselected states

5. **Loading State Consideration**
   - PathRevealStep provides feedback during "processing"

---

## 7. Prioritization and Recommendations

### Impact vs. Effort Matrix

| Recommendation | Impact | Effort | Priority | Files |
|----------------|--------|--------|----------|-------|
| Add accessibility labels to all interactive elements | High | Low | **P1** | All step files |
| Calculate progress bar dynamically | Medium | Low | **P1** | `OnboardingFlow.tsx`, all step files |
| Add error handling for Supabase save failures | High | Medium | **P1** | `OnboardingFlow.tsx:43-52` |
| Add Skip button to all steps | Medium | Low | **P2** | All step files |
| Increase touch target sizes (min 44px) | Medium | Low | **P2** | `GoalStep.tsx`, `ExperienceStep.tsx`, `TimelineStep.tsx` |
| Add progress bar to WelcomeStep | Low | Low | **P2** | `WelcomeStep.tsx` |
| Unify selection indicator patterns | Low | Medium | **P3** | All step files |
| Remove unused Lucide imports | Low | Low | **P3** | `GoalStep.tsx` |

### Quick Wins (Immediate Actions)

1. **Add accessibility props** (5 min per file)
   ```typescript
   <TouchableOpacity
     onPress={onNext}
     accessibilityLabel="Continue to next step"
     accessibilityRole="button"
   >
   ```

2. **Fix progress bar calculation** (10 min)
   ```typescript
   const progressWidth = `${((step + 1) / steps.length) * 100}%`;
   ```

3. **Add error handling** (15 min)
   ```typescript
   const finishOnboarding = async () => {
     try {
       if (user) {
         await saveUserProfile(user.id, data);
         await initializeLearningPath(user.id, data);
       }
       navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
     } catch (error) {
       Alert.alert('Error', 'Failed to save your profile. Please try again.');
     }
   };
   ```

---

## 8. Final Deliverables

### Executive Summary

**Overall UX Maturity: 6.5/10**

The onboarding flow demonstrates good structural foundation with clean design and proper state management. However, critical accessibility gaps and missing error handling reduce its effectiveness for real-world use. The flow is intuitive for most users but lacks the polish expected in production apps.

### Top 5 Quick Wins

1. **Add accessibility labels** - Critical for screen reader users
2. **Implement error handling** - Users currently lose data on save failures
3. **Calculate progress dynamically** - Hardcoded values cause maintenance issues
4. **Add Skip buttons universally** - Increases user control and reduces friction
5. **Fix touch target sizes** - Improves usability on all devices

### Critical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Data loss on save failure** | High | Add try-catch with user feedback |
| **Inaccessible to screen readers** | High | Add accessibilityLabel and accessibilityRole to all interactive elements |
| **Poor experience on small screens** | Medium | Review scroll behavior and padding |

### Next Steps

1. **Manual Testing**
   - Test on various screen sizes (iPhone SE to Pro Max)
   - Test with VoiceOver/TalkBack enabled
   - Test slow network conditions

2. **Recommended Tools**
   - Run `expo lint` for code quality
   - Use React Native Accessibility API
   - Test with Charles Proxy to simulate failures

3. **Prototype Iterations**
   - A/B test different progress bar styles
   - Test skip vs. required flows
   - Consider adding inline help tooltips

---

*Note: This review is based on static code analysis. Real device testing and user research are recommended to validate these findings.*
