// src/components/mascot/BrunoMascot.tsx
// High-Craft Animated Bruno Mascot (Satya / Clucky style)
// Powered by custom-illustrated BrunoCharacterSvg, dynamic speech bubble, and interactive reactions

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { MascotState } from '../../types';
import { useBruno } from '../../context/BrunoContext';
import { BrunoCharacterSvg, BearExpression } from './BrunoCharacterSvg';

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
  const bounceAnim = useState(new Animated.Value(1))[0];
  const [tapReactionText, setTapReactionText] = useState<string | null>(null);

  const getMascotExpression = (): BearExpression => {
    switch (state) {
      case 'proud_coach':
      case 'approving_nod':
        return 'proud_flex';
      case 'chalking_up':
        return 'chalking_up';
      case 'waiting_watch':
        return 'intense_lift';
      case 'studying_journal':
      default:
        return 'idle_reading';
    }
  };

  const getMascotBadge = () => {
    switch (state) {
      case 'approving_nod':
        return { text: 'APPROVED', bg: colors.success, color: '#FFFFFF' };
      case 'chalking_up':
        return { text: 'CHALKING UP', bg: '#6366F1', color: '#FFFFFF' };
      case 'waiting_watch':
        return { text: 'ON DECK', bg: colors.amber, color: colors.textInverted };
      case 'proud_coach':
        return { text: 'OVERLOAD HIT', bg: colors.amber, color: colors.textInverted };
      case 'studying_journal':
      default:
        return { text: 'JOURNAL READY', bg: colors.surfaceElevated, color: colors.textSecondary };
    }
  };

  const handleMascotTap = () => {
    if (!interactive) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}

    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1.12,
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
    ]).start();

    const coachAdvice = [
      "Keep that chest up on the eccentric. Controlled descent builds muscle.",
      "Check your grip. Dry hands lift heavy plates.",
      "Two more reps left in reserve. Don't rush into technical failure.",
      "Consistency beats motivation every single day of the week.",
      "Lock it in. I am taking notes in the journal.",
    ];
    setTapReactionText(coachAdvice[Math.floor(Math.random() * coachAdvice.length)]);

    setTimeout(() => {
      setTapReactionText(null);
    }, 4500);
  };

  const badge = getMascotBadge();
  const expression = getMascotExpression();
  const svgSize = size === 'sm' ? 72 : size === 'lg' ? 120 : 96;

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.surfaceCard, 
          borderColor: colors.border,
          shadowColor: colors.cardShadow,
        }
      ]}
    >
      
      {/* Animated Bear Mascot Vector Avatar */}
      <TouchableOpacity 
        activeOpacity={0.88}
        onPress={handleMascotTap}
        style={styles.avatarTouchable}
      >
        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <BrunoCharacterSvg expression={expression} size={svgSize} animated={true} />
        </Animated.View>
        <Text style={[styles.tapHint, { color: colors.textMuted }]}>
          Tap Bruno
        </Text>
      </TouchableOpacity>

      {/* Speech Note Column */}
      <View style={styles.speechColumn}>
        <View style={styles.headerRow}>
          <Text style={[styles.nameText, { color: colors.textPrimary }]}>
            Bruno
          </Text>
          <View style={[styles.badgePill, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.color }]}>
              {badge.text}
            </Text>
          </View>
        </View>

        {/* Vintage Chalk/Leather Speech Note */}
        <View 
          style={[
            styles.speechBubble, 
            { 
              backgroundColor: colors.chalkNoteBg, 
              borderColor: colors.chalkBorder,
            }
          ]}
        >
          <Text style={[styles.speechText, { color: colors.textPrimary }]}>
            "{tapReactionText || message || "Routines are calibrated to your hardware. Execute with discipline."}"
          </Text>
          <View style={[styles.pointer, { borderRightColor: colors.chalkNoteBg }]} />
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
    borderRadius: 26,
    borderWidth: 1.2,
    marginVertical: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tapHint: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  speechColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  speechBubble: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    position: 'relative',
  },
  speechText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    fontStyle: 'italic',
  },
  pointer: {
    position: 'absolute',
    left: -7,
    top: 14,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});
