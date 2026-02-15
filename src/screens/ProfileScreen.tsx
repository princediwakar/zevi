import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

// Stores & Context
import { useUserStore } from '../stores/userStore';
import { useAuth } from '../hooks/useAuth';
import { useProgressStore } from '../stores/progressStore';

// Theme
import { theme } from '../theme';
import { SubscriptionTier } from '../types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

// ============================================
// SWISS DESIGN: Sharp, bold, minimal, high contrast
// Using centralized theme tokens for consistency
// ============================================

// Avatar component with initials - sharp corners for Swiss style
const UserAvatar = ({ name, size = 80 }: { name?: string; size?: number }) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  return (
    <View style={[styles.avatar, { width: size, height: size }]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
};

// Subscription badge component - sharp corners
const SubscriptionBadge = ({ tier }: { tier: SubscriptionTier }) => {
  const isPremium = tier === 'premium';
  return (
    <View style={[styles.subscriptionBadge, isPremium && styles.subscriptionBadgePremium]}>
      <Text style={[styles.subscriptionBadgeText, isPremium && styles.subscriptionBadgeTextPremium]}>
        {isPremium ? 'PREMIUM' : 'FREE'}
      </Text>
    </View>
  );
};

// Quick action button - sharp borders
const QuickActionButton = ({
  code,
  label,
  onPress,
  variant = 'default',
}: {
  code: string;
  label: string;
  onPress: () => void;
  variant?: 'default' | 'danger';
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.quickAction, variant === 'danger' && styles.quickActionDanger]}
    activeOpacity={0.8}
  >
    <View style={styles.quickActionContent}>
      <View style={styles.quickActionCodeBox}>
        <Text style={[styles.quickActionCode, variant === 'danger' && styles.quickActionCodeDanger]}>{code}</Text>
      </View>
      <Text style={[styles.quickActionLabel, variant === 'danger' && styles.quickActionLabelDanger]}>{label}</Text>
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, loading: userLoading, reset: resetUser } = useUserStore();
  const { signOut, isGuest, loading: authLoading } = useAuth();
  const { progress, loading: progressLoading, fetchProgress } = useProgressStore();
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (user?.id) {
      await fetchProgress(user.id, isGuest);
    }
  }, [user?.id, isGuest, fetchProgress]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    const alertTitle = isGuest ? 'Clear Guest Data' : 'Sign Out';
    const alertMessage = isGuest 
      ? 'This will delete all your guest data and start fresh. Are you sure?' 
      : 'Are you sure you want to sign out?';
    
    Alert.alert(
      alertTitle,
      alertMessage,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isGuest ? 'Clear Data' : 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              resetUser();
              setTimeout(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Welcome' }],
                });
              }, 300);
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleUpgrade = () => {
    Alert.alert('Coming Soon', 'Premium upgrade will be available soon!');
  };

  // Show loading while auth or user is loading
  if (userLoading || authLoading || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PROFILE</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>LOADING...</Text>
        </View>
      </View>
    );
  }

  const displayName = user.display_name || user.email?.split('@')[0] || 'User';
  const userLevel = user.current_level || 1;
  const userXP = user.total_xp || 0;
  const userStreak = user.current_streak || 0;
  const questionsCompleted = progress?.total_questions_completed || 0;
  const xpToNextLevel = userLevel * 100;
  const currentLevelXP = userXP % 100;
  const xpProgress = Math.min((currentLevelXP / xpToNextLevel) * 100, 100);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header - Swiss bold bar */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PROFILE</Text>
        </View>

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Profile Card - Swiss style with sharp edges */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            {/* Avatar - sharp corners */}
            <UserAvatar name={displayName} size={80} />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{displayName}</Text>
                <SubscriptionBadge tier={user.subscription_tier} />
              </View>
              <Text style={styles.email}>{user.email}</Text>
              {isGuest && (
                <View style={styles.guestBadge}>
                  <Text style={styles.guestText}>GUEST MODE</Text>
                </View>
              )}
            </View>
          </View>

          {/* Level Progress - sharp bar */}
          <View style={styles.levelSection}>
            <View style={styles.levelHeader}>
              <Text style={styles.levelLabel}>LEVEL {userLevel}</Text>
              <Text style={styles.xpLabel}>{userXP} / {xpToNextLevel} XP</Text>
            </View>
            <View style={styles.levelBarBg}>
              <View style={[styles.levelBarFill, { width: `${xpProgress}%` }]} />
            </View>
          </View>
        </View>

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>STATS</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <View style={styles.statCodeBox}>
                <Text style={styles.statCodeText}>XP</Text>
              </View>
              <Text style={styles.statValue}>{userXP.toLocaleString()}</Text>
              <Text style={styles.statLabel}>TOTAL XP</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statCodeBox}>
                <Text style={styles.statCodeText}>ST</Text>
              </View>
              <Text style={styles.statValue}>{userStreak}</Text>
              <Text style={styles.statLabel}>DAY STREAK</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statCodeBox}>
                <Text style={styles.statCodeText}>Q</Text>
              </View>
              <Text style={styles.statValue}>{questionsCompleted}</Text>
              <Text style={styles.statLabel}>QUESTIONS</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statCodeBox}>
                <Text style={styles.statCodeText}>LV</Text>
              </View>
              <Text style={styles.statValue}>{userLevel}</Text>
              <Text style={styles.statLabel}>LEVEL</Text>
            </View>
          </View>
        </View>

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Premium CTA (for free users) - Swiss bordered */}
        {user.subscription_tier === 'free' && (
          <>
            <View style={styles.premiumCard}>
              <View style={styles.premiumContent}>
                <View style={styles.premiumIcon}>
                  <Text style={styles.premiumIconText}>PRO</Text>
                </View>
                <View style={styles.premiumText}>
                  <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                  <Text style={styles.premiumSubtitle}>Advanced analytics & more</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgrade}
                activeOpacity={0.8}
              >
                <Text style={styles.upgradeButtonText}>UPGRADE NOW</Text>
              </TouchableOpacity>
            </View>
            {/* Heavy separator */}
            <View style={styles.separator} />
          </>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SETTINGS</Text>
          <View style={styles.actionsCard}>
            <QuickActionButton
              code="SET"
              label="App Settings"
              onPress={() => navigation.navigate('Settings')}
            />
            <View style={styles.actionDivider} />
            <QuickActionButton
              code="PRG"
              label="View Progress"
              onPress={() => navigation.navigate('ProgressTab' as any)}
            />
            <View style={styles.actionDivider} />
            <QuickActionButton
              code="HLP"
              label="Help & Support"
              onPress={() => Alert.alert('Coming Soon', 'Help center will be available soon!')}
            />
          </View>
        </View>

        {/* Heavy separator */}
        <View style={styles.separator} />

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.actionsCard}>
            {isGuest && (
              <>
                <QuickActionButton
                  code="NEW"
                  label="Create Account"
                  onPress={() => navigation.navigate('Auth' as any)}
                />
                <View style={styles.actionDivider} />
              </>
            )}
            <QuickActionButton
              code={isGuest ? 'CLR' : 'OUT'}
              label={isGuest ? 'Clear Guest Data' : 'Sign Out'}
              variant="danger"
              onPress={handleLogout}
            />
          </View>
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>ZEVI PM PREP v1.0.0</Text>
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
  
  scrollView: {
    flex: 1,
  },
  
  content: {
    paddingBottom: theme.swiss.layout.sectionGap + theme.spacing[8],
  },
  
  // Header - Swiss bold bar
  header: {
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
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.secondary,
  },
  
  // Heavy separator
  separator: {
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
  },
  
  // Profile Card - Swiss bordered
  profileCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    margin: theme.swiss.layout.screenPadding,
    marginTop: theme.swiss.layout.sectionGap,
    padding: theme.swiss.layout.sectionGap,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.swiss.layout.sectionGap,
  },
  // Avatar - sharp corners for Swiss style
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
  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing[5],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  name: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    marginRight: theme.spacing[3],
  },
  
  email: {
    fontSize: theme.swiss.fontSize.body,
    color: theme.colors.text.secondary,
  },
  
  // Guest badge - sharp corners
  guestBadge: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    alignSelf: 'flex-start',
    marginTop: theme.spacing[2],
    backgroundColor: theme.colors.neutral[200],
  },
  guestText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.neutral[600],
    letterSpacing: theme.swiss.letterSpacing.wide,
  },

  // Level Progress - sharp bar
  levelSection: {
    marginTop: theme.spacing[2],
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  levelLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  xpLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  levelBarBg: {
    height: 8,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 0,
    overflow: 'hidden',
  },
  levelBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: 0,
  },

  // Section
  section: {
    marginHorizontal: theme.swiss.layout.screenPadding,
    marginTop: theme.swiss.layout.sectionGap,
  },
  sectionLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    padding: theme.spacing[4],
    alignItems: 'center',
  },
  statCodeBox: {
    width: 48,
    height: 48,
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  statCodeText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  statValue: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.black,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  
  // Subscription - sharp corners
  subscriptionBadge: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.neutral[200],
  },
  subscriptionBadgePremium: {
    borderColor: theme.colors.semantic.warning,
    backgroundColor: theme.colors.semantic.warning + '20',
  },
  subscriptionBadgeText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.neutral[600],
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  subscriptionBadgeTextPremium: {
    color: theme.colors.semantic.warning,
  },

  // Premium
  premiumCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.semantic.warning,
    margin: theme.swiss.layout.screenPadding,
    padding: theme.swiss.layout.sectionGap,
    backgroundColor: theme.colors.background,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  premiumIcon: {
    width: 56,
    height: 56,
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.semantic.warning,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[4],
    backgroundColor: theme.colors.semantic.warning + '20',
  },
  premiumIconText: {
    fontSize: theme.swiss.fontSize.heading,
    fontWeight: theme.swiss.fontWeight.black,
    color: theme.colors.semantic.warning,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  premiumSubtitle: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  upgradeButton: {
    borderWidth: theme.swiss.border.heavy,
    borderColor: theme.colors.text.primary,
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[4],
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
  },

  // Quick Actions
  actionsCard: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
  },
  quickAction: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.swiss.layout.screenPadding,
  },
  quickActionDanger: {
    backgroundColor: theme.colors.semantic.error + '05',
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionCodeBox: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[4],
    backgroundColor: theme.colors.neutral[100],
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
  },
  quickActionCode: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  quickActionCodeDanger: {
    color: theme.colors.semantic.error,
  },
  quickActionLabel: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  quickActionLabelDanger: {
    color: theme.colors.semantic.error,
  },
  actionDivider: {
    height: theme.swiss.border.light,
    backgroundColor: theme.colors.text.primary,
    marginHorizontal: theme.swiss.layout.screenPadding,
  },
  
  // Version
  versionText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.swiss.layout.sectionGap,
  },
});
