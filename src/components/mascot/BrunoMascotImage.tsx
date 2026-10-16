// src/components/mascot/BrunoMascotImage.tsx
// Exact 3D Photorealistic Mascot from Design Template with Animated Breathing & Spring Reactions

import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, Easing, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

export type MascotPose = 'splash' | 'welcome' | 'flex' | 'thumbs_up' | 'dashboard';

interface BrunoMascotImageProps {
  pose?: MascotPose;
  size?: number;
  animated?: boolean;
  onPress?: () => void;
}

const MASCOT_IMAGES = {
  splash: require('../../assets/mascot/bruno_splash.png'),
  welcome: require('../../assets/mascot/bruno_welcome.png'),
  flex: require('../../assets/mascot/bruno_flex.png'),
  thumbs_up: require('../../assets/mascot/bruno_thumbs_up.png'),
  dashboard: require('../../assets/mascot/bruno_dashboard.png'),
};

export const BrunoMascotImage: React.FC<BrunoMascotImageProps> = ({
  pose = 'welcome',
  size = 140,
  animated = true,
  onPress,
}) => {
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) return;

    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.035,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1.0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    breathLoop.start();

    return () => breathLoop.stop();
  }, [animated]);

  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}

    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1.1,
        speed: 40,
        bounciness: 10,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        speed: 35,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) onPress();
  };

  const imageSource = MASCOT_IMAGES[pose] || MASCOT_IMAGES.welcome;

  // Aspect ratio adjustments based on pose
  let height = size;
  const isDashboardAvatar = pose === 'dashboard';

  if (pose === 'welcome') height = size * 1.35;
  else if (pose === 'splash') height = size * 1.05;
  else if (pose === 'flex') height = size * 0.82;
  else if (pose === 'thumbs_up') height = size * 1.05;
  else if (pose === 'dashboard') height = size;

  const content = (
    <Animated.View
      style={{
        transform: [
          { scale: Animated.multiply(breatheAnim, bounceAnim) }
        ],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={[
          isDashboardAvatar && {
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            borderWidth: 2.5,
            borderColor: '#D9572B',
            backgroundColor: '#FAF6F0',
            shadowColor: '#D9572B',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 3,
          }
        ]}
      >
        <Image
          source={imageSource}
          style={{ width: size, height }}
          resizeMode={isDashboardAvatar ? "cover" : "contain"}
        />
      </View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};
