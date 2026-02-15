import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

// Stores & Context
import { useUserStore } from '../stores/userStore';
import { useAuth } from '../hooks/useAuth';
import { useProgressStore } from '../stores/progressStore';

// UI Components
import {
  Container,
  DisplayLG,
  H2,
  H3,
  H4,
  BodyLG,
  BodyMD,
  BodySM,
  LabelSM,
  Card,
  Grid,
  Button,
  Row,
  Column,
  Spacer,
} from '../components/ui';

// Theme
import { theme } from '../theme';
import { SubscriptionTier } from '../types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

// Avatar component with initials
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
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <H2 style={styles.avatarText}>{initials}</H2>
    </View>
  );
};

// Stat card component
const StatCard = ({
  value,
  label,
  code,
  color = theme.colors.primary[500],
}: {
  value: string | number;
  label: string;
  code: string;
  color?: string;
}) => (
  <Card variant="filled" padding={4} style={styles.statCard}>
    <View style={[styles.statCodeContainer, { backgroundColor: color + '15' }]}>
      <H3 style={[styles.statCode, { color }]}>{code}</H3>
    </View>
    <Spacer size={theme.spacing[2]} />
    <H3 style={[styles.statValue, { color }]}>{value}</H3>
    <LabelSM color="secondary" uppercase>
      {label}
    </LabelSM>
  </Card>
);

// Subscription badge component
const SubscriptionBadge = ({ tier }: { tier: SubscriptionTier }) => {
  const isPremium = tier === 'premium';
  return (
    <View
      style={[
        styles.subscriptionBadge,
        {
          backgroundColor: isPremium ? theme.colors.semantic.warning + '20' : theme.colors.neutral[200],
        },
      ]}
    >
      <BodySM style={{ color: isPremium ? theme.colors.semantic.warning : theme.colors.neutral[600], fontWeight: '700', letterSpacing: 1 }}>
        {isPremium ? 'PREMIUM' : 'FREE'}
      </BodySM>
    </View>
  );
};

// Quick action button
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
    style={[
      styles.quickAction,
      variant === 'danger' && styles.quickActionDanger,
    ]}
  >
    <Row style={styles.quickActionContent}>
      <View style={styles.quickActionCodeContainer}>
        <H4 style={[styles.quickActionCode, variant === 'danger' && { color: theme.colors.semantic.error }]}>{code}</H4>
      </View>
      <BodyMD
        style={[
          styles.quickActionLabel,
          variant === 'danger' && { color: theme.colors.semantic.error },
        ]}
      >
        {label}
      </BodyMD>
    </Row>
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
      <Container variant="screen" padding="lg" safeArea>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Spacer size={theme.spacing[4]} />
          <BodyMD color="secondary">Loading profile...</BodyMD>
        </View>
      </Container>
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
    <Container variant="screen" padding="none" safeArea>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <DisplayLG style={styles.title}>PROFILE</DisplayLG>
        </View>

        {/* Profile Card */}
        <Card variant="filled" padding={6} style={styles.profileCard}>
          <Row style={styles.profileHeader}>
            <UserAvatar name={displayName} size={80} />
            <Column style={styles.profileInfo}>
              <Row style={styles.nameRow}>
                <H2 style={styles.name}>{displayName}</H2>
                <SubscriptionBadge tier={user.subscription_tier} />
              </Row>
              <BodyMD color="secondary">{user.email}</BodyMD>
              {isGuest && (
                <View style={styles.guestBadge}>
                  <LabelSM style={styles.guestText}>GUEST MODE</LabelSM>
                </View>
              )}
            </Column>
          </Row>

          <Spacer size={theme.spacing[6]} />

          {/* Level Progress */}
          <View style={styles.levelSection}>
            <Row style={styles.levelHeader}>
              <LabelSM color="secondary">LEVEL {userLevel}</LabelSM>
              <LabelSM color="secondary">{userXP} / {xpToNextLevel} XP</LabelSM>
            </Row>
            <View style={styles.levelBarBg}>
              <View style={[styles.levelBarFill, { width: `${xpProgress}%` }]} />
            </View>
          </View>
        </Card>

        <Spacer size={theme.spacing[6]} />

        {/* Stats Grid */}
        <View style={styles.section}>
          <LabelSM color="secondary" uppercase style={styles.sectionTitle}>
            Stats
          </LabelSM>
          <Grid columns={2} gap={4}>
            <StatCard
              value={userXP.toLocaleString()}
              label="Total XP"
              code="XP"
              color={theme.colors.primary[500]}
            />
            <StatCard
              value={userStreak}
              label="Day Streak"
              code="ST"
              color={theme.colors.semantic.warning}
            />
            <StatCard
              value={questionsCompleted}
              label="Questions"
              code="Q"
              color={theme.colors.semantic.success}
            />
            <StatCard
              value={userLevel}
              label="Level"
              code="LV"
              color={theme.colors.semantic.info}
            />
          </Grid>
        </View>

        {/* Premium CTA (for free users) */}
        {user.subscription_tier === 'free' && (
          <>
            <Spacer size={theme.spacing[6]} />
            <Card
              variant="outline"
              padding={5}
              style={[styles.premiumCard, { borderColor: theme.colors.semantic.warning }]}
            >
              <Row style={styles.premiumContent}>
                <View style={[styles.premiumIcon, { backgroundColor: theme.colors.semantic.warning + '15' }]}>
                  <H2 style={{ color: theme.colors.semantic.warning }}>PRO</H2>
                </View>
                <Column style={styles.premiumText}>
                  <BodyLG style={{ fontWeight: '700' }}>Upgrade to Premium</BodyLG>
                  <BodySM color="secondary">Advanced analytics & more</BodySM>
                </Column>
              </Row>
              <Spacer size={theme.spacing[4]} />
              <Button variant="primary" fullWidth onPress={handleUpgrade}>
                UPGRADE NOW
              </Button>
            </Card>
          </>
        )}

        {/* Quick Actions */}
        <Spacer size={theme.spacing[6]} />
        <View style={styles.section}>
          <LabelSM color="secondary" uppercase style={styles.sectionTitle}>
            Settings
          </LabelSM>
          <Card variant="outline" padding={0} style={styles.actionsCard}>
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
          </Card>
        </View>

        {/* Account Actions */}
        <Spacer size={theme.spacing[6]} />
        <View style={styles.section}>
          <LabelSM color="secondary" uppercase style={styles.sectionTitle}>
            Account
          </LabelSM>
          <Card variant="outline" padding={0} style={styles.actionsCard}>
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
          </Card>
        </View>

        {/* App Version */}
        <Spacer size={theme.spacing[8]} />
        <BodySM color="secondary" align="center">
          Zevi PM Prep v1.0.0
        </BodySM>
        <Spacer size={theme.spacing[4]} />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing[6],
    paddingBottom: theme.spacing[12],
  },
  header: {
    marginBottom: theme.spacing[6],
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Profile Card
  profileCard: {
    backgroundColor: theme.colors.surface.secondary,
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing[5],
  },
  nameRow: {
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  name: {
    marginRight: theme.spacing[3],
  },
  avatar: {
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: theme.colors.text.inverse,
    fontWeight: '700',
  },
  guestBadge: {
    backgroundColor: theme.colors.neutral[200],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: theme.spacing[2],
  },
  guestText: {
    color: theme.colors.neutral[600],
    fontWeight: '600',
  },

  // Level Progress
  levelSection: {
    marginTop: theme.spacing[2],
  },
  levelHeader: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  levelBarBg: {
    height: 8,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  levelBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: 4,
  },

  // Section
  section: {
    marginBottom: theme.spacing[2],
  },
  sectionTitle: {
    marginBottom: theme.spacing[4],
    letterSpacing: 1,
  },

  // Stats
  statCard: {
    alignItems: 'center',
  },
  statCodeContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  statCode: {
    fontSize: 16,
    fontWeight: '700',
  },
  statValue: {
    marginBottom: theme.spacing[1],
  },

  // Subscription
  subscriptionBadge: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: 4,
  },

  // Premium
  premiumCard: {
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 2,
  },
  premiumContent: {
    alignItems: 'center',
  },
  premiumIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.semantic.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[4],
  },
  premiumText: {
    flex: 1,
  },

  // Quick Actions
  actionsCard: {
    overflow: 'hidden',
  },
  quickAction: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[5],
  },
  quickActionDanger: {
    backgroundColor: theme.colors.semantic.error + '05',
  },
  quickActionContent: {
    alignItems: 'center',
  },
  quickActionCodeContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[4],
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 2,
    borderColor: theme.colors.border.light,
  },
  quickActionCode: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  quickActionLabel: {
    fontWeight: '600',
  },
  actionDivider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginHorizontal: theme.spacing[5],
  },
});
