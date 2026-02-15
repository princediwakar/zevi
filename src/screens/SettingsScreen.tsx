import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Container, H1, BodyLG, BodyMD, LabelSM, GhostButton, Row, Spacer } from '../components/ui';
import { theme } from '../theme';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <Container variant="screen" padding="lg" safeArea>
      <View style={styles.header}>
        <H1>SETTINGS</H1>
        <BodyMD color="secondary">Customize your app experience</BodyMD>
      </View>

      <View style={styles.content}>
        {/* Appearance */}
        <View style={styles.section}>
          <LabelSM color="secondary" uppercase>Appearance</LabelSM>
          <Spacer size={theme.spacing[2]} />
          <Row style={styles.settingRow}>
            <BodyLG>Dark Mode</BodyLG>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: theme.colors.neutral[300], true: theme.colors.primary[500] }}
            />
          </Row>
          <BodyMD color="secondary" style={styles.settingDescription}>
            Switch between light and dark theme (coming soon)
          </BodyMD>
        </View>

        <Spacer size={theme.spacing[6]} />

        {/* Notifications */}
        <View style={styles.section}>
          <LabelSM color="secondary" uppercase>Notifications</LabelSM>
          <Spacer size={theme.spacing[2]} />
          <Row style={styles.settingRow}>
            <BodyLG>Practice Reminders</BodyLG>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.colors.neutral[300], true: theme.colors.primary[500] }}
            />
          </Row>
          <BodyMD color="secondary" style={styles.settingDescription}>
            Receive daily reminders to keep your streak
          </BodyMD>
        </View>

        <Spacer size={theme.spacing[6]} />

        {/* Account */}
        <View style={styles.section}>
          <LabelSM color="secondary" uppercase>Account</LabelSM>
          <Spacer size={theme.spacing[4]} />
          <GhostButton size="md" fullWidth onPress={() => navigation.navigate('Profile')}>
            VIEW PROFILE
          </GhostButton>
          <Spacer size={theme.spacing[3]} />
          <GhostButton size="md" fullWidth onPress={() => {}}>
            CHANGE PASSWORD
          </GhostButton>
          <Spacer size={theme.spacing[3]} />
          <GhostButton size="md" fullWidth onPress={() => {}}>
            DATA & PRIVACY
          </GhostButton>
        </View>

        <Spacer size={theme.spacing[8]} />

        {/* App Info */}
        <View style={styles.section}>
          <LabelSM color="secondary" uppercase>About</LabelSM>
          <Spacer size={theme.spacing[4]} />
          <BodyMD color="secondary">Version 1.0.0</BodyMD>
          <Spacer size={theme.spacing[2]} />
          <BodyMD color="secondary">PM Interview Prep App</BodyMD>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing[8],
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  settingRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
  },
  settingDescription: {
    marginTop: theme.spacing[2],
    opacity: 0.7,
  },
});