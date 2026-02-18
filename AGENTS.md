# AGENTS.md - Coding Agent Instructions

## Build & Development Commands

```bash
# Development
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Start web version

# Type Checking
npx tsc --noEmit       # Run TypeScript check (no emit)

# Supabase
npx supabase db push --include-all --yes     # Push DB migrations
npx supabase functions deploy transcribe     # Deploy Edge Function
npx supabase secrets set OPENAI_API_KEY=key  # Set secrets
npm run test-supabase  # Test Supabase connection
npm run verify-rpcs    # Verify RPC functions
```

**Note:** No test runner (Jest/Vitest) is currently configured. Tests need to be run manually or a test framework must be set up first.

## Code Style Guidelines

### Imports
- Order: React → External libraries → Internal modules (`@/*`)
- Use `@/*` path alias for all internal imports (configured in tsconfig.json)
- Group imports by category with blank lines between groups

```typescript
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/hooks/useAuth';
import { useQuestionsStore } from '@/stores/questionsStore';
import { theme } from '@/theme';
```

### Naming Conventions
- **Components:** PascalCase (e.g., `OutlineBuilder`, `FullPracticeLesson`)
- **Interfaces:** PascalCase (e.g., `OutlineBuilderProps`, `UserProgress`)
- **Types:** PascalCase (e.g., `QuestionCategory`, `LessonType`)
- **Functions:** camelCase (e.g., `evaluateAnswer`, `getUserProgress`)
- **Constants:** UPPER_SNAKE_CASE for true constants
- **Files:** PascalCase for components, camelCase for utilities
- **Zustand Stores:** camelCase with `Store` suffix (e.g., `useQuestionsStore`)

### TypeScript
- Strict mode enabled - all code must be fully typed
- Prefer `type` over `interface` for simple shapes
- Use `interface` for component props and extensible types
- Export types from `@/types/index.ts`
- Use explicit return types on all exported functions

### Error Handling
- Always wrap async operations in try/catch
- Log errors with `console.error` before re-throwing
- Use the logger utility for consistent logging
- Never swallow errors silently

```typescript
try {
  const { data, error } = await supabase.from('table').select('*');
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Operation failed:', error);
  throw error;
}
```

### Component Structure
- Use functional components with hooks
- Props interfaces must be exported
- Place styles at the bottom of the file using `StyleSheet.create`
- Destructure props in function parameters

```typescript
export interface ComponentProps {
  title: string;
  onPress: () => void;
}

export function Component({ title, onPress }: ComponentProps) {
  return <View>...</View>;
}

const styles = StyleSheet.create({ ... });
```

### State Management
- **Zustand:** Global state (stores in `/stores/`)
- **React Context:** Auth and theme only
- **Local state:** useState/useReducer for component-level state
- **AsyncStorage:** Guest session persistence

### Services Pattern
- Export individual async functions from service files
- Services handle all Supabase interactions
- Return typed data, throw on errors
- File location: `/src/services/*.ts`

### Styling
- Use NativeWind (Tailwind for RN) for styling when possible
- Swiss-style design: Black/White, high contrast, minimalist
- Reference theme from `@/theme` for consistent colors
- No inline styles except for dynamic values

## File Organization

```
/src
  /components        # Reusable UI components
    /ui             # Base UI components (Button, Card, etc.)
  /screens          # Screen components (one per route)
    /lessons        # Lesson type screens
  /services         # API/data layer
  /stores           # Zustand stores
  /hooks            # Custom React hooks
  /types            # TypeScript definitions
  /utils            # Helper functions
  /theme            # Design tokens, colors
  /navigation       # Navigation configuration
  /contexts         # React Context providers
  /lib              # Third-party client setup
  /data             # Static data, sample content
  /database         # DB utilities, seeding
```

## Key Patterns

### Supabase Queries
- Always use typed Supabase client from `@/lib/supabaseClient`
- Destructure `{ data, error }` and check error immediately
- Use proper typing on returned data

### Navigation
- Type all navigation props using `NativeStackNavigationProp`
- Define routes in `@/navigation/types.ts`
- Use navigation hooks from `@react-navigation/native`

### Voice Practice (Important)
- Audio stays local on device
- Only transcribed text + AI feedback is stored
- Flow: Record → base64 → Whisper API → Transcript → AI Analysis

### Component Exports
- Screens: Default export
- Components: Named export
- UI components: Export from `/components/ui/index.ts`
- Types: Re-export from `/types/index.ts`

## Environment

- **Framework:** React Native 0.81.5 + Expo 54
- **Language:** TypeScript 5.9 (strict mode)
- **State:** Zustand 5.x
- **Backend:** Supabase
- **Styling:** NativeWind (Tailwind CSS for RN)

## Pre-commit Checklist

1. Run `npx tsc --noEmit` - fix all TypeScript errors
2. Verify no `console.log` in production code (use logger instead)
3. Ensure all functions have explicit return types
4. Check that error handling is in place for all async operations
5. Verify imports use `@/*` path alias
