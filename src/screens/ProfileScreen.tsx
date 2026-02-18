import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Switch,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

import { useUserStore } from '../stores/userStore';
import { useAuth } from '../hooks/useAuth';
import { useProgressStore } from '../stores/progressStore';
import {
  requestNotificationPermissions,
  scheduleDailyNotification,
  cancelDailyNotification,
  loadNotificationSettings,
  saveNotificationSettings,
  formatTime,
} from '@/services/notificationService';
import { theme } from '../theme';
import { SwissStreakBox } from '../components';
import { TimePickerModal } from '../components/TimePickerModal';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, loading: userLoading, reset: resetUser } = useUserStore();
  const { signOut, loading: authLoading } = useAuth();
  const { fetchProgress } = useProgressStore();
  const [refreshing, setRefreshing] = useState(false);

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationHour, setNotificationHour] = useState(9);
  const [notificationMinute, setNotificationMinute] = useState(0);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const timeRowAnim = useRef(new Animated.Value(0)).current;

  const loadData = useCallback(async (): Promise<void> => {
    if (user?.id) await fetchProgress(user.id);
  }, [user?.id, fetchProgress]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    loadNotificationSettings().then((s) => {
      setNotificationsEnabled(s.enabled);
      setNotificationHour(s.hour);
      setNotificationMinute(s.minute);
      setSettingsLoading(false);
      if (s.enabled) Animated.timing(timeRowAnim, { toValue: 1, duration: 0, useNativeDriver: false }).start();
    });
  }, []);

  useEffect(() => {
    Animated.timing(timeRowAnim, {
      toValue: notificationsEnabled ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [notificationsEnabled]);

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = (): void => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            resetUser();
            setTimeout(() => navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] }), 300);
          } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        },
      },
    ]);
  };

  const handleNotificationToggle = async (value: boolean): Promise<void> => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert('Permissions Required', 'Please enable notifications in your device settings.', [{ text: 'OK' }]);
        return;
      }
      const success = await scheduleDailyNotification(notificationHour, notificationMinute);
      if (success) {
        setNotificationsEnabled(true);
        await saveNotificationSettings({ enabled: true, hour: notificationHour, minute: notificationMinute });
      }
    } else {
      await cancelDailyNotification();
      setNotificationsEnabled(false);
      await saveNotificationSettings({ enabled: false, hour: notificationHour, minute: notificationMinute });
    }
  };

  const handleTimeConfirm = async (hour: number, minute: number): Promise<void> => {
    setShowTimePicker(false);
    setNotificationHour(hour);
    setNotificationMinute(minute);
    if (notificationsEnabled) await scheduleDailyNotification(hour, minute);
    await saveNotificationSettings({ enabled: notificationsEnabled, hour, minute });
  };

  const timeRowMaxHeight = timeRowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 72] });

  if (userLoading || authLoading || !user) {
    return (
      <View style={s.container}>
        <View style={s.header}>
          <Text style={s.headerTitle}>PROFILE</Text>
          <SwissStreakBox streak={0} />
        </View>
        <View style={s.centered}><Text style={s.loadingText}>LOADING...</Text></View>
      </View>
    );
  }

  const displayName = user.display_name || user.email?.split('@')[0] || 'User';
  const userLevel = user.current_level || 1;
  const userXP = user.total_xp || 0;
  const userStreak = user.current_streak || 0;
  const xpToNextLevel = userLevel * 100;
  const xpProgress = Math.min(((userXP % 100) / xpToNextLevel) * 100, 100);
  const isPremium = user.subscription_tier === 'premium';

  return (
    <View style={s.container}>
      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>PROFILE</Text>
        <SwissStreakBox streak={userStreak} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* ── Profile card ── */}
        <View style={s.card}>
          {/* Avatar */}
          <View style={s.cardRow}>
            <View style={[s.avatar, { width: 80, height: 80 }]}>
              <Text style={s.avatarText}>
                {displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            </View>
            <View style={s.profileInfo}>
              <View style={s.nameRow}>
                <Text style={s.name}>{displayName}</Text>
                <View style={[s.badge, isPremium && s.badgePremium]}>
                  <Text style={[s.badgeText, isPremium && s.badgeTextPremium]}>
                    {isPremium ? 'PREMIUM' : 'FREE'}
                  </Text>
                </View>
              </View>
              <Text style={s.email}>{user.email}</Text>
            </View>
          </View>

          {/* XP bar */}
          <View style={s.xpSection}>
            <View style={s.xpHeader}>
              <Text style={s.xpLabel}>LEVEL {userLevel}</Text>
              <Text style={s.xpLabel}>{userXP} / {xpToNextLevel} XP</Text>
            </View>
            <View style={s.xpBarBg}>
              <View style={[s.xpBarFill, { width: `${xpProgress}%` }]} />
            </View>
          </View>
        </View>


        {/* ── NOTIFICATIONS ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>NOTIFICATIONS</Text>
          <View style={s.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.settingLabel}>Daily Practice Reminder</Text>
              <Text style={s.settingDesc}>
                {notificationsEnabled
                  ? `Reminder set for ${formatTime(notificationHour, notificationMinute)}`
                  : 'Get a daily nudge to keep your streak'}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              disabled={settingsLoading}
              trackColor={{ false: theme.colors.neutral[300], true: theme.colors.text.primary }}
              thumbColor={theme.colors.background}
            />
          </View>

          <Animated.View style={[s.timeRow, { maxHeight: timeRowMaxHeight, opacity: timeRowAnim, overflow: 'hidden' }]}>
            <View style={s.timeRowInner}>
              <View style={{ flex: 1 }}>
                <Text style={s.settingLabel}>Reminder Time</Text>
                <Text style={s.settingDesc}>Tap to change</Text>
              </View>
              <TouchableOpacity style={s.timeBtn} onPress={() => setShowTimePicker(true)} activeOpacity={0.7}>
                <Text style={s.timeBtnText}>{formatTime(notificationHour, notificationMinute)}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

        </View>


        {/* ── ACCOUNT ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>ACCOUNT</Text>
          <View>
            <TouchableOpacity
              style={s.action}
              onPress={() => Alert.alert('Coming Soon', 'Help center will be available soon!')}
              activeOpacity={0.8}
            >
              <Text style={s.actionLabel}>Help & Support</Text>
            </TouchableOpacity>
            <View style={s.actionDivider} />
            <TouchableOpacity style={[s.action, s.actionDanger]} onPress={handleLogout} activeOpacity={0.8}>
              <Text style={[s.actionLabel, s.actionLabelDanger]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={s.version}>ZEVI PM PREP v1.0.0</Text>
      </ScrollView>

      <TimePickerModal
        visible={showTimePicker}
        hour={notificationHour}
        minute={notificationMinute}
        onConfirm={handleTimeConfirm}
        onCancel={() => setShowTimePicker(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: theme.spacing[8] },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.swiss.layout.headerPaddingTop,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingBottom: theme.swiss.layout.headerPaddingBottom,
    borderBottomWidth: theme.swiss.border.heavy,
    borderBottomColor: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  loadingText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.secondary,
  },

  sep: { height: theme.swiss.border.standard, backgroundColor: theme.colors.text.primary },

  // Profile card
  card: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    margin: theme.swiss.layout.screenPadding,
    padding: theme.swiss.layout.elementGap,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.swiss.layout.elementGap },
  avatar: {
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
  },
  avatarText: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  profileInfo: { flex: 1, marginLeft: theme.spacing[5] },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing[1] },
  name: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    marginRight: theme.spacing[3],
  },
  email: { fontSize: theme.swiss.fontSize.body, color: theme.colors.text.secondary },

  badge: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.neutral[200],
  },
  badgePremium: { borderColor: theme.colors.semantic.warning, backgroundColor: theme.colors.semantic.warning + '20' },
  badgeText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.neutral[600],
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  badgeTextPremium: { color: theme.colors.semantic.warning },

  xpSection: { marginTop: theme.spacing[2] },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing[2] },
  xpLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  xpBarBg: { height: 8, backgroundColor: theme.colors.neutral[200], overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: theme.colors.primary[500] },

  // Sections / settings
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    borderBottomWidth: theme.swiss.border.light,
    borderBottomColor: theme.colors.text.primary,
  },
  settingLabel: { fontSize: theme.swiss.fontSize.body, fontWeight: theme.swiss.fontWeight.medium, color: theme.colors.text.primary },
  settingDesc: { fontSize: theme.swiss.fontSize.small, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  timeRow: { borderBottomWidth: theme.swiss.border.light, borderBottomColor: theme.colors.text.primary },
  timeRowInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing[4] },
  timeBtn: {
    borderWidth: theme.swiss.border.heavy,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  timeBtnText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.tight,
    color: theme.colors.text.primary,
  },

  // Account actions
  action: { paddingVertical: theme.spacing[4] },
  actionDanger: { backgroundColor: theme.colors.semantic.error + '05' },
  actionLabel: { fontSize: theme.swiss.fontSize.body, fontWeight: theme.swiss.fontWeight.medium, color: theme.colors.text.primary },
  actionLabelDanger: { color: theme.colors.semantic.error },
  actionDivider: { height: theme.swiss.border.light, backgroundColor: theme.colors.text.primary},

  version: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginVertical: theme.spacing[5],
  },
});
