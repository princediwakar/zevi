import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';
import { Container, H1, BodyLG, BodyMD, BodySM, LabelSM, PrimaryButton, OutlineButton, GhostButton, EmailInput, PasswordInput, TextInput } from '../components/ui';
import { theme } from '../theme';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export default function AuthScreen() {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (mode === 'signup' && !fullName) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    setLoading(true);
    
    const { error } = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password, fullName);

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // After successful auth, navigate based on onboarding status
      const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
      const destination = onboardingCompleted === 'true' ? 'MainTabs' : 'Onboarding';
      
      // Use replace to prevent going back to Auth screen
      if (mode === 'signup') {
        Alert.alert(
          'Success',
          'Account created! Please check your email to verify your account.',
          [{ text: 'OK', onPress: () => navigation.replace(destination) }]
        );
      } else {
        navigation.replace(destination);
      }
    }
  };
  const handleGoogleAuth = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // After successful auth, navigate based on onboarding status
      // Use replace to prevent going back to Auth screen
      const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
      const destination = onboardingCompleted === 'true' ? 'MainTabs' : 'Onboarding';
      navigation.replace(destination);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Container variant="screen" padding="lg" safeArea scrollable>
        {/* Header */}
        <View style={styles.header}>
          <H1 style={styles.title}>
            {mode === 'signin' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </H1>
          <BodyLG color="secondary" style={styles.subtitle}>
            {mode === 'signin'
              ? 'Sign in to continue your practice'
              : 'Start your PM interview prep journey'}
          </BodyLG>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'signup' && (
            <View style={styles.inputGroup}>
              <LabelSM style={styles.label}>FULL NAME</LabelSM>
              <TextInput
                variant="outline"
                size="lg"
                placeholder="John Doe"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                editable={!loading}
                fullWidth
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <LabelSM style={styles.label}>EMAIL</LabelSM>
            <EmailInput
              variant="outline"
              size="lg"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              fullWidth
            />
          </View>

          <View style={styles.inputGroup}>
            <LabelSM style={styles.label}>PASSWORD</LabelSM>
            <PasswordInput
              variant="outline"
              size="lg"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              fullWidth
            />
          </View>

          <PrimaryButton
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
            onPress={handleEmailAuth}
            style={styles.primaryButton}
          >
            {mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </PrimaryButton>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <BodySM color="secondary" style={styles.dividerText}>OR</BodySM>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Auth */}
          <OutlineButton
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
            onPress={handleGoogleAuth}
            style={styles.googleButton}
          >
            CONTINUE WITH GOOGLE
          </OutlineButton>

          {/* Mode switch */}
          <GhostButton
            size="md"
            fullWidth
            onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            disabled={loading}
            style={styles.switchMode}
          >
            <BodyMD color="secondary">
              {mode === 'signin'
                ? "DON'T HAVE AN ACCOUNT? "
                : 'ALREADY HAVE AN ACCOUNT? '}
              <BodyMD style={styles.switchModeLink}>
                {mode === 'signin' ? 'SIGN UP' : 'SIGN IN'}
              </BodyMD>
            </BodyMD>
          </GhostButton>
        </View>

        {/* Back button */}
        <GhostButton
          size="md"
          fullWidth
          onPress={() => navigation.goBack()}
          disabled={loading}
          style={styles.backButton}
        >
          ← BACK TO WELCOME
        </GhostButton>
      </Container>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing[10], // 56px
    paddingTop: theme.spacing[6], // 24px
  },
  title: {
    marginBottom: theme.spacing[2], // 8px
    letterSpacing: -0.5,
  },
  subtitle: {
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: theme.spacing[6], // 24px
  },
  label: {
    marginBottom: theme.spacing[2], // 8px
    opacity: 0.8,
  },
  primaryButton: {
    marginTop: theme.spacing[2], // 8px
    marginBottom: theme.spacing[6], // 24px
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing[6], // 24px
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.light,
  },
  dividerText: {
    marginHorizontal: theme.spacing[4], // 16px
    opacity: 0.7,
  },
  googleButton: {
    marginBottom: theme.spacing[6], // 24px
  },
  switchMode: {
    marginBottom: theme.spacing[8], // 40px
  },
  switchModeLink: {
    color: theme.colors.primary[500],
    fontWeight: '600',
  },
  backButton: {
    // Ghost button styles already applied
  },
});
