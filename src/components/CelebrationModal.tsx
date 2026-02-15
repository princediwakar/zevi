import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Modal, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '../theme';

// SWISS STYLE: No gradients, no emojis, sharp edges, high contrast
// Using solid colors and bold typography instead

interface CelebrationModalProps {
  visible: boolean;
  type: 'milestone' | 'level_up' | 'streak' | 'readiness';
  title: string;
  message: string;
  code?: string;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export function CelebrationModal({
  visible,
  type,
  title,
  message,
  code,
  onClose,
}: CelebrationModalProps) {
  const scaleAnim = useSharedValue(0);
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scaleAnim.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
      fadeAnim.value = withTiming(1, {
        duration: 300,
      });
    } else {
      scaleAnim.value = 0;
      fadeAnim.value = 0;
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  // SWISS STYLE: Solid colors instead of gradients
  const getBackgroundColor = (): string => {
    switch (type) {
      case 'milestone':
        return theme.colors.primary[500];
      case 'level_up':
        return theme.colors.text.primary;
      case 'streak':
        return theme.colors.streak.orange;
      case 'readiness':
        return theme.colors.semantic.success;
      default:
        return theme.colors.primary[500];
    }
  };

  // SWISS STYLE: Letter codes instead of emojis
  const getDefaultCode = () => {
    switch (type) {
      case 'milestone':
        return 'MS';
      case 'level_up':
        return 'LV';
      case 'streak':
        return 'SK';
      case 'readiness':
        return 'RD';
      default:
        return 'AW';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          styles.overlay,
          overlayStyle
        ]}
      >
        <Animated.View 
          style={[
            styles.container,
            containerStyle,
            { backgroundColor: getBackgroundColor() }
          ]}
        >
          <View style={styles.content}>
            {/* SWISS STYLE: Bold letter code instead of emoji */}
            <View style={styles.iconContainer}>
              <Text style={styles.code}>
                {code || getDefaultCode()}
              </Text>
            </View>

            <Text style={styles.title}>{title.toUpperCase()}</Text>
            
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity
              onPress={onClose}
              style={styles.button}
            >
              <Text style={styles.buttonText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

interface MilestoneModalProps {
  visible: boolean;
  type: 'streak' | 'level_up' | 'readiness';
  title: string;
  value: number;
  onClose: () => void;
}

export function MilestoneModal({ visible, type, title, value, onClose }: MilestoneModalProps) {
  const getMessage = () => {
    switch (type) {
      case 'streak':
        return `You've maintained a ${value}-day streak. Keep it going!`;
      case 'level_up':
        return `You've reached level ${value}!`;
      case 'readiness':
        return `You're now ${value}% ready for interviews!`;
      default:
        return 'Great job! Keep up the momentum!';
    }
  };

  const getCode = () => {
    switch (type) {
      case 'streak':
        return 'SK';
      case 'level_up':
        return 'LV';
      case 'readiness':
        return 'RD';
      default:
        return 'AW';
    }
  };

  return (
    <CelebrationModal
      visible={visible}
      type={type}
      title={title}
      message={getMessage()}
      code={getCode()}
      onClose={onClose}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    maxWidth: 400,
    // SWISS STYLE: Sharp edges
    borderRadius: theme.spacing.borderRadius.none,
    borderWidth: theme.spacing.borderWidth.thick,
    borderColor: theme.colors.text.primary,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    padding: theme.spacing[8],
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.text.inverse,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
    // SWISS STYLE: Sharp edges
    borderRadius: theme.spacing.borderRadius.none,
    borderWidth: theme.spacing.borderWidth.medium,
    borderColor: theme.colors.text.primary,
  },
  code: {
    // SWISS STYLE: Bold typography
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.text.primary,
    letterSpacing: -1,
  },
  title: {
    // SWISS STYLE: Massive typography, uppercase
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text.inverse,
    textAlign: 'center',
    marginBottom: theme.spacing[3],
    letterSpacing: 1,
  },
  message: {
    fontSize: 16,
    color: theme.colors.text.inverse,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    lineHeight: 24,
    opacity: 0.9,
  },
  button: {
    backgroundColor: theme.colors.text.inverse,
    paddingHorizontal: theme.spacing[8],
    paddingVertical: theme.spacing[3],
    // SWISS STYLE: Sharp edges
    borderRadius: theme.spacing.borderRadius.none,
    borderWidth: theme.spacing.borderWidth.medium,
    borderColor: theme.colors.text.primary,
  },
  buttonText: {
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
