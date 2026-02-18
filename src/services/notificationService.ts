import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { logger } from '@/utils/logger';

// ============================================
// Notification Service
// Handles daily practice reminder scheduling
// ============================================

const STORAGE_KEY_ENABLED = '@notifications_enabled';
const STORAGE_KEY_HOUR = '@notifications_hour';
const STORAGE_KEY_MINUTE = '@notifications_minute';

const NOTIFICATION_ID_KEY = '@notification_id';

const DEFAULT_HOUR = 9;
const DEFAULT_MINUTE = 0;

export interface NotificationSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

// Configure how notifications appear when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the user.
 * Returns true if granted, false otherwise.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reminders', {
        name: 'Daily Practice Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#000000',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    logger.error('Failed to request notification permissions:', error);
    return false;
  }
}

/**
 * Schedule a daily notification at the given hour/minute (24h).
 * Cancels any previously scheduled notification first.
 */
export async function scheduleDailyNotification(hour: number, minute: number): Promise<boolean> {
  try {
    // Cancel existing scheduled notification
    await cancelDailyNotification();

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to practice! 🎯",
        body: "Keep your streak alive — 15 min of PM practice today",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    await AsyncStorage.setItem(NOTIFICATION_ID_KEY, notificationId);
    logger.log(`Daily notification scheduled at ${hour}:${minute < 10 ? '0' + minute : minute}`);
    return true;
  } catch (error) {
    logger.error('Failed to schedule daily notification:', error);
    return false;
  }
}

/**
 * Cancel the currently scheduled daily notification.
 */
export async function cancelDailyNotification(): Promise<void> {
  try {
    const notificationId = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
      logger.log('Daily notification cancelled');
    }
  } catch (error) {
    logger.error('Failed to cancel daily notification:', error);
  }
}

/**
 * Load saved notification settings from AsyncStorage.
 */
export async function loadNotificationSettings(): Promise<NotificationSettings> {
  try {
    const [enabled, hour, minute] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEY_ENABLED),
      AsyncStorage.getItem(STORAGE_KEY_HOUR),
      AsyncStorage.getItem(STORAGE_KEY_MINUTE),
    ]);

    return {
      enabled: enabled === 'true',
      hour: hour !== null ? parseInt(hour, 10) : DEFAULT_HOUR,
      minute: minute !== null ? parseInt(minute, 10) : DEFAULT_MINUTE,
    };
  } catch (error) {
    logger.error('Failed to load notification settings:', error);
    return { enabled: false, hour: DEFAULT_HOUR, minute: DEFAULT_MINUTE };
  }
}

/**
 * Save notification settings to AsyncStorage.
 */
export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEY_ENABLED, String(settings.enabled)),
      AsyncStorage.setItem(STORAGE_KEY_HOUR, String(settings.hour)),
      AsyncStorage.setItem(STORAGE_KEY_MINUTE, String(settings.minute)),
    ]);
  } catch (error) {
    logger.error('Failed to save notification settings:', error);
  }
}

/**
 * Format hour and minute into a human-readable time string (e.g. "9:00 AM").
 */
export function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute < 10 ? `0${minute}` : `${minute}`;
  return `${displayHour}:${displayMinute} ${period}`;
}
