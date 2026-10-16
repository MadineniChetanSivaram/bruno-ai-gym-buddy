// src/components/common/TactileButton.tsx
// High-craft tactile pressable with spring bounce & haptic feedback (Satya / Clucky style)

import React, { useRef } from 'react';
import { 
  Animated, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  View 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useBruno } from '../../context/BrunoContext';

interface TactileButtonProps {
  onPress: () => void;
  title?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  onPress,
  title,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  style,
  textStyle,
  disabled = false,
}) => {
  const { colors } = useBruno();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  const getVariantStyles = (): { bg: string; border: string; text: string } => {
    switch (variant) {
      case 'primary':
        return {
          bg: colors.amber,
          border: colors.amberDark,
          text: colors.textInverted,
        };
      case 'accent':
        return {
          bg: colors.amberGlow,
          border: colors.amber,
          text: colors.amber,
        };
      case 'secondary':
        return {
          bg: colors.surfaceSubtle,
          border: colors.border,
          text: colors.textPrimary,
        };
      case 'danger':
        return {
          bg: colors.dangerBg,
          border: colors.danger,
          text: colors.danger,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          border: 'transparent',
          text: colors.textSecondary,
        };
    }
  };

  const getSizeStyles = (): { paddingV: number; paddingH: number; fontSize: number; radius: number } => {
    switch (size) {
      case 'sm':
        return { paddingV: 7, paddingH: 12, fontSize: 12, radius: 10 };
      case 'lg':
        return { paddingV: 15, paddingH: 20, fontSize: 16, radius: 18 };
      case 'md':
      default:
        return { paddingV: 11, paddingH: 16, fontSize: 14, radius: 14 };
    }
  };

  const v = getVariantStyles();
  const s = getSizeStyles();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, disabled && { opacity: 0.5 }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.base,
          {
            backgroundColor: v.bg,
            borderColor: v.border,
            borderWidth: variant === 'ghost' ? 0 : 1.2,
            paddingVertical: s.paddingV,
            paddingHorizontal: s.paddingH,
            borderRadius: s.radius,
          },
          style,
        ]}
      >
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          {title ? (
            <Text
              style={[
                styles.text,
                {
                  color: v.text,
                  fontSize: s.fontSize,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          ) : (
            children
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 2,
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
