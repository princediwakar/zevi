/**
 * Swiss Style Container Component
 * Layout wrapper with consistent padding and safe area handling
 */

import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  ScrollView,
  RefreshControlProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';

type ContainerVariant = 'screen' | 'section' | 'full';
type ContainerPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface ContainerProps extends ViewProps {
  variant?: ContainerVariant;
  padding?: ContainerPadding;
  safeArea?: boolean;
  scrollable?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  children: React.ReactNode;
}

/**
 * Swiss Style Container for consistent layout
 */
export const Container: React.FC<ContainerProps> = ({
  variant = 'screen',
  padding = 'lg',
  safeArea = true,
  scrollable = false,
  refreshControl,
  children,
  style,
  ...props
}) => {
  // Padding configurations
  const paddingConfig = {
    none: 0,
    sm: theme.spacing[4], // 16px
    md: theme.spacing[5], // 20px
    lg: theme.spacing[6], // 24px - standard screen padding
    xl: theme.spacing[7], // 32px
  };

  // Variant configurations
  const variantConfig = {
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    section: {
      flex: 0,
      backgroundColor: 'transparent',
    },
    full: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  };

  const config = variantConfig[variant];
  const paddingValue = paddingConfig[padding];

  // Build container styles
  const containerStyles = StyleSheet.create({
    base: {
      ...config,
      padding: paddingValue,
    },
  });

  // Render with SafeAreaView if needed
  const renderContent = () => (
    <View style={[containerStyles.base, style]} {...props}>
      {children}
    </View>
  );

  const renderScrollableContent = () => (
    <ScrollView
      style={[containerStyles.base, style]}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={refreshControl}
      {...props}
    >
      {children}
    </ScrollView>
  );

  if (safeArea) {
    const Content = scrollable ? renderScrollableContent : renderContent;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Content />
      </SafeAreaView>
    );
  }

  return scrollable ? renderScrollableContent() : renderContent();
};

/**
 * Layout helper components
 */
export const Row: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <View
    style={[
      { flexDirection: 'row', alignItems: 'center' },
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

export const Column: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <View
    style={[
      { flexDirection: 'column' },
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

export const Spacer: React.FC<{ size?: number }> = ({
  size = 16,
}) => <View style={{ height: size }} />;

export const HorizontalSpacer: React.FC<{ size?: number }> = ({
  size = 16,
}) => <View style={{ width: size }} />;

/**
 * Grid layout component for Swiss-style grid layouts
 */
interface GridProps extends ViewProps {
  columns?: number;
  gap?: keyof typeof theme.spacing;
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({
  columns = 2,
  gap = 4, // 16px
  children,
  style,
  ...props
}) => {
  const gapValue = typeof theme.spacing[gap] === 'number' ? theme.spacing[gap] as number : 16;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginHorizontal: -gapValue / 2,
        },
        style,
      ]}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <View
          style={{
            width: `${100 / columns}%`,
            paddingHorizontal: gapValue / 2,
            paddingVertical: gapValue / 2,
          }}
          key={index}
        >
          {child}
        </View>
      ))}
    </View>
  );
};