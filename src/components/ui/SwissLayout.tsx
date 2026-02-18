/**
 * Swiss Style Layout Components
 * Reusable components to enforce Swiss design consistency
 * 
 * DESIGN PRINCIPLES:
 * - Sharp edges (no border-radius)
 * - High contrast (black & white only)
 * - Bold typography (800-900 weights)
 * - Heavy borders and separators
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleSheet,
  Modal,
} from 'react-native';
import { theme } from '../../theme';

// ============================================
// SwissHeader Component
// ============================================
interface SwissHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}

export const SwissHeader: React.FC<SwissHeaderProps> = ({
  title,
  rightElement,
  onBack,
  showBack = false,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {showBack && onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>
        )}
        {!showBack && (
          <Text style={styles.headerTitle}>{title}</Text>
        )}
      </View>
      <View style={styles.headerRight}>
        {rightElement}
      </View>
    </View>
  );
};

// ============================================
// SwissStreakBox Component
// ============================================
interface SwissStreakBoxProps {
  streak: number;
}

export const SwissStreakBox: React.FC<SwissStreakBoxProps> = ({ streak }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Always render (preserve layout space), but hide border when streak = 0
  return (
    <>
      <TouchableOpacity
        onPress={() => streak > 0 && setModalVisible(true)}
        style={[styles.streakBox, streak === 0 && styles.streakBoxHidden]}
        activeOpacity={0.7}
        disabled={streak <= 0}
      >
        <Text style={styles.streakText}>{streak > 0 ? streak : ''}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={streakModalStyles.overlay}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={streakModalStyles.container}>
            {/* Modal header */}
            <View style={streakModalStyles.header}>
              <Text style={streakModalStyles.title}>DAY STREAK</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={streakModalStyles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Heavy divider */}
            <View style={streakModalStyles.divider} />

            {/* Big streak number */}
            <View style={streakModalStyles.streakRow}>
              <Text style={streakModalStyles.streakNumber}>{streak}</Text>
              <Text style={streakModalStyles.streakUnit}>
                {streak === 1 ? 'DAY' : 'DAYS'}
              </Text>
            </View>

            {/* Description */}
            <Text style={streakModalStyles.description}>
              Practice at least once every day to keep your streak alive.
              Complete any lesson or question to count toward your streak.
            </Text>

            {/* Light divider */}
            <View style={streakModalStyles.dividerLight} />

            {/* Warning note */}
            <Text style={streakModalStyles.warning}>
              Missing a day resets your streak to 0.
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// ============================================
// SwissSeparator Component
// ============================================
interface SwissSeparatorProps {
  variant?: 'heavy' | 'standard' | 'light';
  spacing?: number;
}

export const SwissSeparator: React.FC<SwissSeparatorProps> = ({
  variant = 'heavy',
  spacing: spacingValue = 6,
}) => {
  const heightMap = {
    heavy: theme.swiss.border.heavy,
    standard: theme.swiss.border.standard,
    light: theme.swiss.border.light,
  };

  return (
    <View
      style={[
        styles.separator,
        {
          height: heightMap[variant],
          marginVertical: spacingValue * 4,
        },
      ]}
    />
  );
};

// ============================================
// SwissMetaBox Component
// ============================================
interface SwissMetaBoxProps {
  label: string;
}

export const SwissMetaBox: React.FC<SwissMetaBoxProps> = ({ label }) => {
  return (
    <View style={styles.metaBox}>
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
};

// ============================================
// SwissMetaRow Component
// ============================================
interface SwissMetaRowProps {
  items: string[];
}

export const SwissMetaRow: React.FC<SwissMetaRowProps> = ({ items }) => {
  return (
    <View style={styles.metaRow}>
      {items.map((item, index) => (
        <SwissMetaBox key={index} label={item} />
      ))}
    </View>
  );
};

// ============================================
// SwissSectionLabel Component
// ============================================
interface SwissSectionLabelProps {
  label: string;
}

export const SwissSectionLabel: React.FC<SwissSectionLabelProps> = ({ label }) => {
  return (
    <Text style={styles.sectionLabel}>{label}</Text>
  );
};

// ============================================
// SwissButton Component
// ============================================
interface SwissButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const SwissButton: React.FC<SwissButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = true,
}) => {
  const buttonStyles = [
    styles.button,
    variant === 'primary' && styles.buttonPrimary,
    variant === 'outline' && styles.buttonOutline,
    variant === 'ghost' && styles.buttonGhost,
    fullWidth && styles.buttonFullWidth,
    disabled && styles.buttonDisabled,
  ];

  const textStyles = [
    styles.buttonText,
    variant === 'primary' && styles.buttonTextPrimary,
    variant === 'outline' && styles.buttonTextOutline,
    variant === 'ghost' && styles.buttonTextGhost,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyles}>{label}</Text>
    </TouchableOpacity>
  );
};

// ============================================
// SwissLink Component
// ============================================
interface SwissLinkProps {
  label: string;
  onPress: () => void;
  align?: 'flex-start' | 'center' | 'flex-end';
}

export const SwissLink: React.FC<SwissLinkProps> = ({
  label,
  onPress,
  align = 'center',
}) => {
  return (
    <TouchableOpacity
      style={[styles.link, { alignItems: align === 'flex-start' ? 'flex-start' : align === 'flex-end' ? 'flex-end' : 'center' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.linkText}>{label}</Text>
    </TouchableOpacity>
  );
};

// ============================================
// SwissCard Component
// ============================================
interface SwissCardProps {
  children: React.ReactNode;
  variant?: 'outline' | 'filled';
  padding?: number;
  style?: ViewStyle;
}

export const SwissCard: React.FC<SwissCardProps> = ({
  children,
  variant = 'outline',
  padding = 6,
  style,
}) => {
  return (
    <View
      style={[
        styles.card,
        variant === 'outline' && styles.cardOutline,
        variant === 'filled' && styles.cardFilled,
        { padding: padding * 4 },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ============================================
// SwissLabel Component
// ============================================
interface SwissLabelProps {
  children: React.ReactNode;
  color?: string;
}

export const SwissLabel: React.FC<SwissLabelProps> = ({
  children,
  color = theme.colors.text.secondary,
}) => {
  return (
    <Text style={[styles.label, { color }]}>{children}</Text>
  );
};

// ============================================
// SwissHeading Component
// ============================================
interface SwissHeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
}

export const SwissHeading: React.FC<SwissHeadingProps> = ({
  children,
  level = 1,
}) => {
  const headingStyles: Record<number, TextStyle> = {
    1: styles.heading1,
    2: styles.heading2,
    3: styles.heading3,
    4: styles.heading4,
  };

  return (
    <Text style={headingStyles[level]}>{children}</Text>
  );
};

// ============================================
// SwissBody Component
// ============================================
interface SwissBodyProps {
  children: React.ReactNode;
  size?: 'lg' | 'md' | 'sm';
  color?: string;
}

export const SwissBody: React.FC<SwissBodyProps> = ({
  children,
  size = 'md',
  color = theme.colors.text.primary,
}) => {
  const bodyStyles: Record<string, TextStyle> = {
    lg: styles.bodyLg,
    md: styles.bodyMd,
    sm: styles.bodySm,
  };

  return (
    <Text style={[bodyStyles[size], { color }]}>{children}</Text>
  );
};

// ============================================
// StyleSheet
// ============================================
const styles = StyleSheet.create({
  // Header styles
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
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.black,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.primary,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    letterSpacing: theme.swiss.letterSpacing.normal,
    color: theme.colors.text.primary,
  },

  // Streak box
  streakBox: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  streakText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  streakBoxHidden: {
    borderColor: 'transparent',
  },

  // Separator
  separator: {
    backgroundColor: theme.colors.text.primary,
  },

  // Meta box
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  metaBox: {
    borderWidth: theme.swiss.border.light,
    borderColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  metaText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    textTransform: 'uppercase' as const,
    letterSpacing: theme.swiss.letterSpacing.normal,
    color: theme.colors.text.primary,
  },

  // Section label
  sectionLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase' as const,
    marginBottom: theme.spacing[4],
  },

  // Button
  button: {
    paddingVertical: theme.spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: theme.colors.text.primary,
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.text.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
  },
  buttonTextPrimary: {
    color: theme.colors.text.inverse,
  },
  buttonTextOutline: {
    color: theme.colors.text.primary,
  },
  buttonTextGhost: {
    color: theme.colors.text.primary,
  },

  // Link
  link: {
    paddingVertical: theme.spacing[4],
  },
  linkText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    letterSpacing: theme.swiss.letterSpacing.wide,
    color: theme.colors.text.secondary,
  },

  // Card
  card: {
    backgroundColor: theme.colors.background,
  },
  cardOutline: {
    borderWidth: theme.swiss.border.standard,
    borderColor: theme.colors.border.light,
  },
  cardFilled: {
    backgroundColor: theme.colors.surface.secondary,
  },

  // Label
  label: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    textTransform: 'uppercase' as const,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },

  // Headings
  heading1: {
    fontSize: theme.typography.heading.h1.fontSize,
    fontWeight: theme.typography.heading.h1.fontWeight,
    letterSpacing: theme.typography.heading.h1.letterSpacing,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.heading.h1.lineHeight,
  },
  heading2: {
    fontSize: theme.typography.heading.h2.fontSize,
    fontWeight: theme.typography.heading.h2.fontWeight,
    letterSpacing: theme.typography.heading.h2.letterSpacing,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.heading.h2.lineHeight,
  },
  heading3: {
    fontSize: theme.typography.heading.h3.fontSize,
    fontWeight: theme.typography.heading.h3.fontWeight,
    letterSpacing: theme.typography.heading.h3.letterSpacing,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.heading.h3.lineHeight,
  },
  heading4: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: theme.typography.heading.h4.fontWeight,
    letterSpacing: theme.typography.heading.h4.letterSpacing,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.heading.h4.lineHeight,
  },

  // Body
  bodyLg: {
    fontSize: theme.typography.body.lg.fontSize,
    fontWeight: theme.typography.body.lg.fontWeight,
    lineHeight: theme.typography.body.lg.lineHeight,
    color: theme.colors.text.primary,
  },
  bodyMd: {
    fontSize: theme.typography.body.md.fontSize,
    fontWeight: theme.typography.body.md.fontWeight,
    lineHeight: theme.typography.body.md.lineHeight,
    color: theme.colors.text.primary,
  },
  bodySm: {
    fontSize: theme.typography.body.sm.fontSize,
    fontWeight: theme.typography.body.sm.fontWeight,
    lineHeight: theme.typography.body.sm.lineHeight,
    color: theme.colors.text.primary,
  },
});

// ============================================
// Streak Modal Styles (separate to keep main StyleSheet clean)
// ============================================
const streakModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopWidth: theme.swiss.border.heavy,
    borderTopColor: theme.colors.text.primary,
    paddingHorizontal: theme.swiss.layout.screenPadding,
    paddingTop: theme.swiss.layout.sectionGap,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  title: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.semibold,
    letterSpacing: theme.swiss.letterSpacing.xwide3,
    color: theme.colors.text.secondary,
  },
  closeText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[2],
  },
  divider: {
    height: theme.swiss.border.heavy,
    backgroundColor: theme.colors.text.primary,
    marginBottom: theme.swiss.layout.elementGap,
  },
  dividerLight: {
    height: theme.swiss.border.light,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.swiss.layout.elementGap,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing[3],
    marginBottom: theme.swiss.layout.elementGap,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: theme.swiss.fontWeight.black,
    color: theme.colors.text.primary,
    lineHeight: 72,
  },
  streakUnit: {
    fontSize: theme.swiss.fontSize.title,
    fontWeight: theme.swiss.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.swiss.letterSpacing.wide,
  },
  description: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.primary,
    lineHeight: 24,
  },
  warning: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.medium,
    color: theme.colors.text.secondary,
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
});
