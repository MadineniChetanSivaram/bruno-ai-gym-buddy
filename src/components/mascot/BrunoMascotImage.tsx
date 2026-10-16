// src/components/mascot/BrunoMascotImage.tsx
// Exact 3D Photorealistic Mascot from Design Template with Fluid Motion,
// Waving/Swaying Physics, Breathing Expansion, Interactive Speech Bubble & Spring Bounces

import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  Animated, 
  StyleSheet, 
  Easing, 
  TouchableOpacity 
} from 'react-native';
import * as Haptics from 'expo-haptics';

export type MascotPose = 'splash' | 'welcome' | 'flex' | 'thumbs_up' | 'dashboard';

interface BrunoMascotImageProps {
  pose?: MascotPose;
  size?: number;
  animated?: boolean;
  showSpeechBubble?: boolean;
  customMessage?: string;
  onPress?: () => void;
}

const MASCOT_IMAGES = {
  splash: require('../../assets/mascot/bruno_splash.png'),
  welcome: require('../../assets/mascot/bruno_welcome.png'),
  flex: require('../../assets/mascot/bruno_flex.png'),
  thumbs_up: require('../../assets/mascot/bruno_thumbs_up.png'),
  dashboard: require('../../assets/mascot/bruno_dashboard.png'),
};

const COACH_QUOTES = [
  "Hi! I'm Bruno, your AI Gym Buddy! 👋",
  "Ready to crush your workout today? Let's get it!",
  "Bumped your dumbbell bench by 2.5 kg! You got this!",
  "Form over ego, always! Let's build real strength!",
  "1-tap machine swaps ready if anyone is hogging your rack!",
  "Hydrate up! Let's get stronger together!",
];

export const BrunoMascotImage: React.FC<BrunoMascotImageProps> = ({
  pose = 'welcome',
  size = 140,
  animated = true,
  showSpeechBubble = false,
  customMessage,
  onPress,
}) => {
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const bubblePopAnim = useRef(new Animated.Value(1)).current;

  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (!animated) return;

    // 1. Torso Breathing Loop
    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.045,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1.0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 2. Vertical Floating Bob Loop
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Gentle Swaying Tilt Loop (Lifelike Mascot Movement)
    const swayLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    breatheLoop.start();
    floatLoop.start();
    swayLoop.start();

    return () => {
      breatheLoop.stop();
      floatLoop.stop();
      swayLoop.stop();
    };
  }, [animated]);

  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}

    // Spring Bounce
    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1.14,
        speed: 45,
        bounciness: 12,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1.0,
        speed: 35,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Bubble Pop
    Animated.sequence([
      Animated.timing(bubblePopAnim, {
        toValue: 0.92,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(bubblePopAnim, {
        toValue: 1.0,
        speed: 40,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();

    setQuoteIndex((prev) => (prev + 1) % COACH_QUOTES.length);

    if (onPress) onPress();
  };

  const imageSource = MASCOT_IMAGES[pose] || MASCOT_IMAGES.welcome;

  // Aspect ratio adjustments based on 3D pose
  let height = size;
  const isDashboardAvatar = pose === 'dashboard';

  if (pose === 'welcome') height = size * 1.35;
  else if (pose === 'splash') height = size * 1.35;
  else if (pose === 'flex') height = size * 0.95;
  else if (pose === 'thumbs_up') height = size * 1.05;
  else if (pose === 'dashboard') height = size;

  const swayRotate = swayAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-2.5deg', '2.5deg'],
  });

  const activeMessage = customMessage || COACH_QUOTES[quoteIndex];

  return (
    <View style={styles.outerContainer}>
      {/* Dynamic Animated Speech Bubble ("Saying Hi!") */}
      {showSpeechBubble && (
        <Animated.View 
          style={[
            styles.speechBubbleContainer, 
            { transform: [{ scale: bubblePopAnim }] }
          ]}
        >
          <View style={styles.speechBubbleBox}>
            <View style={styles.bubbleTagRow}>
              <Text style={styles.bubbleBadgeText}>BRUNO AI COACH</Text>
              <Text style={styles.bubbleWavingHand}>👋</Text>
            </View>
            <Text style={styles.speechBubbleText}>
              {activeMessage}
            </Text>
          </View>
          <View style={styles.speechBubbleTail} />
        </Animated.View>
      )}

      {/* Moving 3D Mascot Character */}
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={handlePress}
        style={styles.touchableWrapper}
      >
        <Animated.View
          style={{
            transform: [
              { translateY: floatAnim },
              { rotate: swayRotate },
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
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.28,
                shadowRadius: 8,
                elevation: 4,
              },
              !isDashboardAvatar && {
                borderRadius: 24,
                overflow: 'hidden',
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

        {showSpeechBubble && (
          <Text style={styles.tapPromptText}>
            ✨ Tap Bruno to chat
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  speechBubbleContainer: {
    alignItems: 'center',
    marginBottom: 8,
    maxWidth: 260,
  },
  speechBubbleBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#D9572B',
    shadowColor: '#D9572B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  bubbleTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  bubbleBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#D9572B',
    letterSpacing: 0.8,
  },
  bubbleWavingHand: {
    fontSize: 12,
  },
  speechBubbleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E1915',
    lineHeight: 18,
  },
  speechBubbleTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#D9572B',
    alignSelf: 'center',
    marginTop: -1,
  },
  touchableWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapPromptText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D9572B',
    marginTop: 6,
    letterSpacing: 0.2,
  },
});
