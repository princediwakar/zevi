import React from 'react';
import { View, StyleSheet, Switch, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

// ============================================
// SWISS DESIGN: Sharp edges, bold typography
// Using centralized theme tokens for consistency
// ============================================

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header - Swiss bold */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SETTINGS</Text>
          <Text style={styles.headerSubtitle}>Customize your app</Text>
        </View>

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>APPEARANCE</Text>
          
          {/* Setting Row - bordered */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Switch theme (coming soon)</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ 
                false: theme.colors.neutral[300], 
                true: theme.colors.text.primary 
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
          
          {/* Setting Row - bordered */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Practice Reminders</Text>
              <Text style={styles.settingDescription}>Daily streak reminders</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ 
                false: theme.colors.neutral[300], 
                true: theme.colors.text.primary 
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          
          {/* Action buttons - Swiss bordered */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>VIEW PROFILE</Text>
          </TouchableOpacity>
          
          <View style={styles.actionDivider} />
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>CHANGE PASSWORD</Text>
          </TouchableOpacity>
          
          <View style={styles.actionDivider} />
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>DATA & PRIVACY</Text>
          </TouchableOpacity>
        </View>

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <Text style={styles.aboutText}>Version 1.0.0</Text>
          <Text style={styles.aboutText}>PM Interview Prep App</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================
// SWISS STYLE: Sharp edges, bold typography, no gradients
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  content: {
    flex: 1,
  },
  
  // Header - Swiss bold bar
  header: {
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.headerPaddingBottom,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
  },
  headerTitle: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  headerSubtitle: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  
  // Heavy separator
  separator: {
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
  },
  
  section: {
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingVertical: theme.swiss.layout.sectionGap,
  },
  sectionLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },
  
  // Setting Row - bordered
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    borderBottomWidth: theme.swiss.border.light,
    borderBottomColor: theme.colors.text.primary,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  settingDescription: {
    fontSize: theme.swiss.fontSize.small,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  
  // Action buttons - Swiss bordered
  actionButton: {
    paddingVertical: theme.spacing[4],
    borderBottomWidth: theme.swiss.border.light,
    borderBottomColor: theme.colors.text.primary,
  },
  actionButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  actionDivider: {
    height: theme.swiss.border.light,
    backgroundColor: theme.colors.text.primary,
  },
  
  // About
  aboutText: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
  },
});
