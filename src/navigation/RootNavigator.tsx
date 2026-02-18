import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import type { RootStackParamList } from './types';

// Screens
import {
  WelcomeScreen,
  AuthScreen,
  QuickQuizScreen,
  QuizResultsScreen,
  HomeScreen,
  QuestionListScreen,
  QuestionDetailScreen,
  TextPracticeScreen,
  ProgressScreen,
  ProfileScreen,
  LessonScreen
} from '../screens';
import BottomTabNavigator from './BottomTabNavigator';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Loading screen component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary[500]} />
  </View>
);

export default function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Welcome');
  const [isReady, setIsReady] = useState(false);

  // Determine initial route on mount
  useEffect(() => {
    const determineRoute = async () => {
      try {
        let targetRoute: keyof RootStackParamList = 'Welcome';
        
        // User must be authenticated to access the app
        if (user) {
          targetRoute = 'MainTabs';
        }

        // Only update route if we're still in loading state or at initial route
        const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
        if (!currentRoute || currentRoute === 'Welcome') {
          setInitialRoute(targetRoute);
        }
      } catch (error) {
        console.error('Error determining initial route:', error);
        setInitialRoute('Welcome');
      } finally {
        setIsReady(true);
      }
    };

    // Only run when auth loading is complete
    if (!authLoading) {
      determineRoute();
    }
  }, [authLoading, user]);

  // Navigate to the home/practice tab when the user taps a daily reminder notification
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      // Only navigate if the user is authenticated and the navigator is ready
      if (navigationRef.current?.isReady() && user) {
        navigationRef.current.navigate('MainTabs');
      }
    });
    return () => subscription.remove();
  }, [user]);

  // Handle navigation when user state changes (e.g., after login)
  useEffect(() => {
    const handleUserChange = async () => {
      if (!isReady || authLoading) return;
      
      const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
      
      // If user just logged in (user exists) and we're still on Welcome or Auth, navigate to MainTabs
      if (user && (currentRoute === 'Welcome' || currentRoute === 'Auth')) {
        console.log('Navigating to MainTabs after login');
        navigationRef.current?.navigate('MainTabs');
      }
    };

    handleUserChange();
  }, [user, isReady, authLoading]);

  // Show loading screen while determining route
  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer 
      ref={navigationRef}
      initialState={undefined}
    >
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="QuickQuiz" component={QuickQuizScreen} />
        <Stack.Screen name="QuizResults" component={QuizResultsScreen} />
        <Stack.Screen name="LessonScreen" component={LessonScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
