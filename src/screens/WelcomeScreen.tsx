import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Container, H1, BodyLG, BodyMD, LabelSM, PrimaryButton, OutlineButton, GhostButton } from '../components/ui';
import { theme } from '../theme';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <Container variant="screen" padding="lg" safeArea>
      {/* Top-aligned massive typography - asymmetric layout */}
      <View style={styles.header}>
        <H1 style={styles.masterText}>MASTER</H1>
        <H1 style={styles.interviewsText}>PM INTERVIEWS</H1>
        <BodyLG color="secondary" style={styles.tagline}>
          Swiss precision for product leadership
        </BodyLG>
      </View>

      {/* Bottom-aligned actions */}
      <View style={styles.actions}>
        <PrimaryButton
          size="lg"
          fullWidth
          onPress={() => navigation.navigate('Auth', { mode: 'signup' })}
          style={styles.primaryButton}
        >
          GET STARTED
        </PrimaryButton>

        <LabelSM color="secondary" align="center" style={styles.buttonSubtext}>
          Master PM interview questions with AI-powered feedback
        </LabelSM>

        <View style={styles.secondaryActions}>
          <OutlineButton
            size="md"
            fullWidth
            onPress={() => navigation.navigate('Auth', { mode: 'signin' })}
            style={styles.secondaryButton}
          >
            ALREADY HAVE AN ACCOUNT? SIGN IN
          </OutlineButton>
        </View>

        <View style={styles.footer}>
          <BodyMD color="secondary" align="center">
            By continuing, you agree to our Terms of Service
          </BodyMD>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: theme.spacing[14], // 96px from top for massive typography
    paddingLeft: theme.spacing[6], // 24px left padding for asymmetric layout
  },
  masterText: {
    marginBottom: theme.spacing[2], // 8px
    letterSpacing: -1.5, // Extra tight tracking for impact
  },
  interviewsText: {
    marginBottom: theme.spacing[4], // 16px
    letterSpacing: -1, // Tight tracking
  },
  tagline: {
    marginTop: theme.spacing[4], // 16px
  },
  actions: {
    paddingBottom: theme.spacing[8], // 40px from bottom
  },
  primaryButton: {
    marginBottom: theme.spacing[3], // 12px
  },
  buttonSubtext: {
    marginBottom: theme.spacing[6], // 24px
    opacity: 0.8,
  },
  secondaryActions: {
    gap: theme.spacing[3], // 12px gap between buttons
    marginBottom: theme.spacing[6], // 24px
  },
  secondaryButton: {
    // Outline button with heavy border already defined in component
  },
  signInButton: {
    // Ghost button style
  },
  footer: {
    opacity: 0.7,
  },
});
