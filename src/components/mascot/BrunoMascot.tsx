// src/components/mascot/BrunoMascot.tsx
// Expressive, Animated Bruno Mascot (Clucky / Amble style)
// Stateful bear with breathing loop, blinking physics, floating chalk particles, and interactive speech bubbles

import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  Easing 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { MascotState } from '../../types';
import { useBruno } from '../../context/BrunoContext';

interface BrunoMascotProps {
  state: MascotState;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const BrunoMascot: React.FC<BrunoMascotProps> = ({ 
  state, 
  message, 
  size = 'md',
  interactive = true 
}) => {
  const { colors } = useBruno();

  // Animations
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const chalkDustAnim = useRef(new Animated.Value(0)).current;
  const earWiggleAnim = useRef(new Animated.Value(0)).current;

  const [tapReactionText, setTapReactionText] = useState<string | null>(null);

  // Breathing loop
  useEffect(() => {
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.04,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1.0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    breathing.start();

    // Subtle chalk dust floating animation
    const chalkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(chalkDustAnim, {
          toValue: 1,
          duration: 3500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(chalkDustAnim, {
          toValue: 0,
          duration: 3500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    chalkLoop.start();

    // Occasional blink timer
    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 4500);

    return () => {
      breathing.stop();
      chalkLoop.stop();
      clearInterval(blinkInterval);
    };
  }, []);

  const handleMascotTap = () => {
    if (!interactive) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}

    // Bounce and ear wiggle
    Animated.parallel([
      Animated.sequence([
        Animated.spring(bounceAnim, {
          toValue: 1.15,
          speed: 50,
          bounciness: 12,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          speed: 40,
          bounciness: 6,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(earWiggleAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(earWiggleAnim, {
          toValue: -1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(earWiggleAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const quips = [
      "Keep that chest up on the eccentric.",
      "Check your grip. Dry hands lift big plates.",
      "Two more reps left in the tank. Push through.",
      "Consistency beats motivation every single time.",
      "Lock it in. I'm taking notes.",
    ];
    const randomQuip = quips[Math.floor(Math.random() * quips.length)];
    setTapReactionText(randomQuip);

    setTimeout(() => {
      setTapReactionText(null);
    }, 4000);
  };

  const getMascotDetails = () => {
    switch (state) {
      case 'approving_nod':
        return {
          faceEmoji: '🐻💪',
          badgeText: 'APPROVED',
          badgeBg: colors.success,
          badgeColor: '#FFFFFF',
          subtext: 'Solid technique. Target locked in notebook.',
        };
      case 'chalking_up':
        return {
          faceEmoji: '🐻☁️',
          badgeText: 'CHALKING UP',
          badgeBg: '#6366F1',
          badgeColor: '#FFFFFF',
          subtext: 'Get focused. Heavy compound work ahead.',
        };
      case 'waiting_watch':
        return {
          faceEmoji: '🐻⏱️',
          badgeText: 'ON DECK',
          badgeBg: colors.amber,
          badgeColor: colors.textInverted,
          subtext: 'Weights are racked. Time to execute.',
        };
      case 'proud_coach':
        return {
          faceEmoji: '🐻🏆',
          badgeText: 'OVERLOAD HIT',
          badgeBg: colors.amber,
          badgeColor: colors.textInverted,
          subtext: '+2.5kg / +5kg applied for next week.',
        };
      case 'studying_journal':
      default:
        return {
          faceEmoji: '🐻📖',
          badgeText: 'JOURNAL READY',
          badgeBg: colors.surfaceElevated,
          badgeColor: colors.textSecondary,
          subtext: 'Optimizing fatigue & recovery metrics.',
        };
    }
  };

  const details = getMascotDetails();
  const avatarSize = size === 'sm' ? 44 : size === 'lg' ? 76 : 58;

  const earRotate = earWiggleAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const dustTranslateY = chalkDustAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const dustOpacity = chalkDustAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.6, 0.2],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
      
      {/* Mascot Avatar Column */}
      <TouchableOpacity 
        activeOpacity={0.85}
        onPress={handleMascotTap}
        style={styles.avatarWrapper}
      >
        <Animated.View 
          style={[
            styles.avatarBadge,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.borderHighlight,
              transform: [
                { scale: Animated.multiply(breatheAnim, bounceAnim) },
                { rotate: earRotate }
              ],
            }
          ]}
        >
          <Text style={{ fontSize: avatarSize * 0.52 }}>
            {details.faceEmoji}
          </Text>

          {/* Animated Chalk Dust Effect */}
          <Animated.View 
            style={[
              styles.chalkPuff,
              {
                opacity: dustOpacity,
                transform: [{ translateY: dustTranslateY }],
              }
            ]}
          >
            <View style={[styles.chalkParticle, { backgroundColor: colors.textSecondary }]} />
            <View style={[styles.chalkParticleSmall, { backgroundColor: colors.textMuted }]} />
          </Animated.View>
        </Animated.View>

        {/* Small Touch Prompt */}
        <Text style={[styles.tapHint, { color: colors.textMuted }]}>
          Tap Bruno
        </Text>
      </TouchableOpacity>

      {/* Speech Bubble / Chalk Note Column */}
      <View style={styles.contentColumn}>
        <View style={styles.headerRow}>
          <View style={styles.nameContainer}>
            <Text style={[styles.mascotName, { color: colors.textPrimary }]}>
              Bruno
            </Text>
            <View style={[styles.statePill, { backgroundColor: details.badgeBg }]}>
              <Text style={[styles.statePillText, { color: details.badgeColor }]}>
                {details.badgeText}
              </Text>
            </View>
          </View>
        </View>

        {/* Speech Note Card with Chalked Edge */}
        <View style={[styles.chalkBubble, { backgroundColor: colors.chalkNoteBg, borderColor: colors.chalkBorder }]}>
          <Text style={[styles.chalkText, { color: colors.textPrimary }]}>
            "{tapReactionText || message || details.subtext}"
          </Text>
          <View style={[styles.speechPointer, { borderRightColor: colors.chalkNoteBg }]} />
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 24,
    borderWidth: 1.2,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    position: 'relative',
  },
  chalkPuff: {
    position: 'absolute',
    top: -4,
    right: -2,
    flexDirection: 'row',
    gap: 3,
  },
  chalkParticle: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.7,
  },
  chalkParticleSmall: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.5,
    marginTop: 2,
  },
  tapHint: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mascotName: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  statePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statePillText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  chalkBubble: {
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    position: 'relative',
  },
  chalkText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    fontStyle: 'italic',
  },
  speechPointer: {
    position: 'absolute',
    left: -7,
    top: 12,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});
