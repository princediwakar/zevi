import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Modal, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

interface CelebrationModalProps {
  visible: boolean;
  type: 'milestone' | 'level_up' | 'streak' | 'readiness';
  title: string;
  message: string;
  icon?: string;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export function CelebrationModal({
  visible,
  type,
  title,
  message,
  icon,
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

  const getGradientColors = (): readonly [string, string, ...string[]] => {
    switch (type) {
      case 'milestone':
        return theme.colors.celebration.milestone as readonly [string, string];
      case 'level_up':
        return theme.colors.celebration.level_up as readonly [string, string];
      case 'streak':
        return theme.colors.celebration.streak as readonly [string, string];
      case 'readiness':
        return theme.colors.celebration.readiness as readonly [string, string];
      default:
        return theme.colors.celebration.default as readonly [string, string];
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case 'milestone':
        return '🎯';
      case 'level_up':
        return '⬆️';
      case 'streak':
        return '🔥';
      case 'readiness':
        return '🎉';
      default:
        return '⭐';
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
            containerStyle
          ]}
        >
          <LinearGradient
            colors={getGradientColors()}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>
                  {icon || getDefaultIcon()}
                </Text>
              </View>

              <Text style={styles.title}>{title}</Text>
              
              <Text style={styles.message}>{message}</Text>

              <TouchableOpacity
                onPress={onClose}
                style={styles.button}
              >
                <Text style={styles.buttonText}>AWESOME!</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
        return `Amazing! You've maintained a ${value}-day streak! Keep it going!`;
      case 'level_up':
        return `Congratulations! You've reached level ${value}!`;
      case 'readiness':
        return `You're now ${value}% ready for your interviews!`;
      default:
        return 'Great job! Keep up the momentum!';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'streak':
        return '🔥';
      case 'level_up':
        return '⬆️';
      case 'readiness':
        return '🎯';
      default:
        return '⭐';
    }
  };

  return (
    <CelebrationModal
      visible={visible}
      type={type}
      title={title}
      message={getMessage()}
      icon={getIcon()}
      onClose={onClose}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  gradient: {
    padding: 32,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '700',
  },
});
