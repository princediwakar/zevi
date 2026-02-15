import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabParamList } from './types';
import type { RootStackParamList } from './types';

// Screens
import {
  HomeScreen,
  QuickQuizScreen,
  QuizResultsScreen,
  ProgressScreen,
  ProfileScreen,
  CategoryBrowseScreen,
  QuestionListScreen,
  QuestionDetailScreen,
  TextPracticeScreen,
  SettingsScreen,
  LessonScreen,
  LearnScreen,
  CategoryDetailScreen,
  FrameworkDetailScreen,
} from '../screens';
import { theme } from '../theme';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const HomeStack = createNativeStackNavigator<RootStackParamList>();
const LearnStack = createNativeStackNavigator<RootStackParamList>();
const ProgressStack = createNativeStackNavigator<RootStackParamList>();
const ProfileStack = createNativeStackNavigator<RootStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Main" component={HomeScreen} />
      <HomeStack.Screen name="CategoryBrowse" component={CategoryBrowseScreen} />
      <HomeStack.Screen name="QuestionList" component={QuestionListScreen} />
      <HomeStack.Screen name="QuestionDetail" component={QuestionDetailScreen} />
      <HomeStack.Screen name="TextPractice" component={TextPracticeScreen} />
      <HomeStack.Screen name="LessonScreen" component={LessonScreen} />
    </HomeStack.Navigator>
  );
}

function LearnStackNavigator() {
  return (
    <LearnStack.Navigator screenOptions={{ headerShown: false }}>
      <LearnStack.Screen name="LearnScreen" component={LearnScreen} />
      <LearnStack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
      <LearnStack.Screen name="FrameworkDetail" component={FrameworkDetailScreen} />
      <LearnStack.Screen name="LessonScreen" component={LessonScreen} />
      <LearnStack.Screen name="QuickQuiz" component={QuickQuizScreen} />
    </LearnStack.Navigator>
  );
}

function ProgressStackNavigator() {
  return (
    <ProgressStack.Navigator screenOptions={{ headerShown: false }}>
      <ProgressStack.Screen name="Progress" component={ProgressScreen} />
    </ProgressStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    </ProfileStack.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.neutral[500],
        tabBarStyle: {
          backgroundColor: theme.colors.surface.primary,
          borderTopColor: theme.colors.border.light,
          borderTopWidth: 1,
          paddingTop: 12,
          paddingBottom: 16,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="LearnTab"
        component={LearnStackNavigator}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressStackNavigator}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}