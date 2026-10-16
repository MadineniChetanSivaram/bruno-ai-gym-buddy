// src/components/mascot/BrunoAnimatedMascot.tsx
// 100% Vector Animated Bruno Bear Mascot (No static screenshots!)
// Features: Active Hand Waving ("Saying Hi!"), Head Bobbing, Breathing Physics,
// Eye Blinking, Interactive Tap Reactions, Dynamic Speech Bubble, and Multiple Poses.

import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  Animated, 
  StyleSheet, 
  Easing, 
  TouchableOpacity 
} from 'react-native';
import Svg, { 
  G, 
  Circle, 
  Path, 
  Rect, 
  Defs, 
  LinearGradient, 
  Stop, 
  Ellipse 
} from 'react-native-svg';
import * as Haptics from 'expo-haptics';

export type MascotPoseType = 
  | 'saying_hi'       // Waving hand, smiling, saying Hi!
  | 'flexing'         // Pumping biceps with dumbbell
  | 'reading_notebook'// Holding lifting journal with glasses
  | 'thumbs_up'       // Double thumbs up celebration
  | 'peeking';        // Peeking coach card mode

interface BrunoAnimatedMascotProps {
  pose?: MascotPoseType;
  size?: number;
  showSpeechBubble?: boolean;
  customMessage?: string;
  onPress?: () => void;
}

const COACH_VOICE_LINES = [
  "Hi! I'm Bruno, your AI Gym Buddy! 👋",
  "Ready to crush your workout today?",
  "Bumped your weights automatically! You got this!",
  "Form over ego, always! Let's get to work!",
  "1-tap machine swap ready if anyone takes your rack!",
  "Hydrate up! Let's build real strength together!",
];

export const BrunoAnimatedMascot: React.FC<BrunoAnimatedMascotProps> = ({
  pose = 'saying_hi',
  size = 150,
  showSpeechBubble = true,
  customMessage,
  onPress,
}) => {
  // Animation References
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const headBobAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const earTwitchAnim = useRef(new Animated.Value(0)).current;

  // Speech Bubble State
  const [voiceLineIndex, setVoiceLineIndex] = useState(0);
  const [bubbleScale] = useState(new Animated.Value(1));

  useEffect(() => {
    // 1. Fluid Torso Breathing Loop
    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.04,
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
    breatheLoop.start();

    // 2. Active Hand Waving Loop (Bruno says Hi!)
    const waveLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 320,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: -1,
          duration: 320,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 320,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        // Pause between waves
        Animated.delay(1200),
      ])
    );
    waveLoop.start();

    // 3. Head Bobbing Loop
    const headBobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(headBobAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(headBobAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    headBobLoop.start();

    // 4. Natural Eye Blink Loop
    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.1,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3600);

    // 5. Ear Twitch Loop
    const earTwitchInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(earTwitchAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(earTwitchAnim, {
          toValue: -1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(earTwitchAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 4500);

    return () => {
      breatheLoop.stop();
      waveLoop.stop();
      headBobLoop.stop();
      clearInterval(blinkInterval);
      clearInterval(earTwitchInterval);
    };
  }, []);

  // Tap Interaction: Bounce Bruno, cycle funny/helpful voice lines, trigger haptics
  const handleMascotTap = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}

    // Tap spring animation
    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1.15,
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

    // Bubble pop animation
    Animated.sequence([
      Animated.timing(bubbleScale, {
        toValue: 0.92,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(bubbleScale, {
        toValue: 1.0,
        speed: 40,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Cycle voice line
    setVoiceLineIndex((prev) => (prev + 1) % COACH_VOICE_LINES.length);

    if (onPress) onPress();
  };

  // Interpolated Transforms
  const waveRotation = waveAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-22deg', '0deg', '24deg'],
  });

  const headRotation = headBobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-2deg', '3deg'],
  });

  const earTwist = earTwitchAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  const currentSpeech = customMessage || COACH_VOICE_LINES[voiceLineIndex];

  return (
    <View style={[styles.container, { width: size * 1.3 }]}>
      
      {/* Dynamic Animated Speech Bubble ("Saying Hi!") */}
      {showSpeechBubble && (
        <Animated.View 
          style={[
            styles.speechBubbleContainer, 
            { transform: [{ scale: bubbleScale }] }
          ]}
        >
          <View style={styles.speechBubbleBox}>
            <View style={styles.bubbleTagRow}>
              <Text style={styles.bubbleBadgeText}>BRUNO AI COACH</Text>
              <Text style={styles.bubbleWavingHand}>👋</Text>
            </View>
            <Text style={styles.speechBubbleText}>
              {currentSpeech}
            </Text>
          </View>
          {/* Triangle Pointer */}
          <View style={styles.speechBubbleTail} />
        </Animated.View>
      )}

      {/* Interactive Mascot Body with Physics */}
      <TouchableOpacity 
        activeOpacity={0.88} 
        onPress={handleMascotTap}
        style={styles.mascotTouchable}
      >
        <Animated.View
          style={{
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              { scale: Animated.multiply(breatheAnim, bounceAnim) }
            ],
          }}
        >
          <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
            <Defs>
              {/* Warm Bear Fur Gradients */}
              <LinearGradient id="furGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#9C644E" />
                <Stop offset="50%" stopColor="#784735" />
                <Stop offset="100%" stopColor="#552C1F" />
              </LinearGradient>

              {/* Muzzle Snout Gradient */}
              <LinearGradient id="snoutGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#F5D6B8" />
                <Stop offset="100%" stopColor="#E2B792" />
              </LinearGradient>

              {/* Blue Henley Shirt Gradient */}
              <LinearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#4A6572" />
                <Stop offset="50%" stopColor="#344955" />
                <Stop offset="100%" stopColor="#232F34" />
              </LinearGradient>

              {/* Inner Ear Peach */}
              <LinearGradient id="innerEarGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#F0A694" />
                <Stop offset="100%" stopColor="#D47763" />
              </LinearGradient>

              {/* Leather Journal Notebook */}
              <LinearGradient id="journalGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#5A3A29" />
                <Stop offset="100%" stopColor="#2E1B11" />
              </LinearGradient>
            </Defs>

            {/* Subtle Gym Warmth Glow */}
            <Circle cx="100" cy="100" r="92" fill="#D9572B" fillOpacity="0.07" />

            {/* 1. BEAR EARS (With Twitch Physics) */}
            <G id="ears">
              {/* Left Ear */}
              <Circle cx="52" cy="52" r="22" fill="url(#furGrad)" stroke="#3E2016" strokeWidth="3" />
              <Circle cx="54" cy="52" r="13" fill="url(#innerEarGrad)" opacity="0.9" />

              {/* Right Ear */}
              <Circle cx="148" cy="52" r="22" fill="url(#furGrad)" stroke="#3E2016" strokeWidth="3" />
              <Circle cx="146" cy="52" r="13" fill="url(#innerEarGrad)" opacity="0.9" />
            </G>

            {/* 2. TORSO & BLUE HENLEY SHIRT */}
            <G id="torso">
              {/* Shoulders & Traps */}
              <Path
                d="M36 172 C40 138 64 126 84 132 C92 135 108 135 116 132 C136 126 160 138 164 172 L172 200 L28 200 Z"
                fill="url(#shirtGrad)"
                stroke="#1A252C"
                strokeWidth="3.5"
              />

              {/* Henley Collar V-Neck */}
              <Path d="M84 133 L100 162 L116 133" stroke="#F5D6B8" strokeWidth="2.5" fill="#E2B792" />
              {/* Henley Buttons */}
              <Circle cx="100" cy="170" r="2.5" fill="#FFFFFF" opacity="0.8" />
              <Circle cx="100" cy="180" r="2.5" fill="#FFFFFF" opacity="0.8" />
            </G>

            {/* 3. BEAR HEAD (Rounded, Fluffy & Powerful) */}
            <G id="head">
              <Path
                d="M54 94 C50 62 72 40 100 40 C128 40 150 62 146 94 C148 118 136 136 100 136 C64 136 52 118 54 94 Z"
                fill="url(#furGrad)"
                stroke="#3E2016"
                strokeWidth="3.5"
              />

              {/* Fluffy Cheek Fur Tufts */}
              <Path d="M48 98 L36 106 L48 110 L38 119 L54 118" fill="url(#furGrad)" stroke="#3E2016" strokeWidth="2.5" />
              <Path d="M152 98 L164 106 L152 110 L162 119 L146 118" fill="url(#furGrad)" stroke="#3E2016" strokeWidth="2.5" />

              {/* 4. SNOUT & FRIENDLY MOUTH */}
              <Ellipse cx="100" cy="106" rx="30" ry="22" fill="url(#snoutGrad)" stroke="#3E2016" strokeWidth="2.5" />
              
              {/* Big Friendly Bear Nose */}
              <Path
                d="M90 94 C90 90 110 90 110 94 C110 100 104 104 100 104 C96 104 90 100 90 94 Z"
                fill="#1E130D"
              />
              <Ellipse cx="96" cy="94" rx="2.8" ry="1.4" fill="#FFFFFF" opacity="0.6" />

              {/* Nose-to-Mouth Line */}
              <Path d="M100 104 L100 113" stroke="#2B1812" strokeWidth="2.5" strokeLinecap="round" />

              {/* Wide Friendly Smile (Saying Hi!) */}
              <Path 
                d="M84 114 Q100 128 116 114" 
                stroke="#2B1812" 
                strokeWidth="3.2" 
                strokeLinecap="round" 
                fill="#8C2C1D"
              />
              {/* White Teeth Highlight */}
              <Path d="M92 115 Q100 118 108 115" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* 5. WIREFRAME GLASSES 👓 (Signature Coach Glasses) */}
              <G id="glasses">
                {/* Left Frame */}
                <Circle cx="78" cy="80" r="14" stroke="#D9572B" strokeWidth="2.5" fill="none" />
                {/* Right Frame */}
                <Circle cx="122" cy="80" r="14" stroke="#D9572B" strokeWidth="2.5" fill="none" />
                {/* Bridge */}
                <Path d="M92 80 Q100 77 108 80" stroke="#D9572B" strokeWidth="2.5" fill="none" />
                {/* Temples */}
                <Path d="M64 80 L54 78" stroke="#D9572B" strokeWidth="2" />
                <Path d="M136 80 L146 78" stroke="#D9572B" strokeWidth="2" />
                {/* Glass Glare Reflection */}
                <Path d="M72 74 L84 74" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
                <Path d="M116 74 L128 74" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
              </G>

              {/* 6. EXPRESSIVE EYES */}
              <G id="eyes">
                {/* Left Eye */}
                <Circle cx="78" cy="80" r="4.8" fill="#1C130E" />
                <Circle cx="80" cy="78" r="1.8" fill="#FFFFFF" />

                {/* Right Eye */}
                <Circle cx="122" cy="80" r="4.8" fill="#1C130E" />
                <Circle cx="124" cy="78" r="1.8" fill="#FFFFFF" />
              </G>

              {/* Eyebrows */}
              <Path d="M68 68 Q78 63 88 68" stroke="#2B1812" strokeWidth="3.5" strokeLinecap="round" />
              <Path d="M132 68 Q122 63 112 68" stroke="#2B1812" strokeWidth="3.5" strokeLinecap="round" />
            </G>

            {/* 7. ANIMATED WAVING PAW (Saying HI! 👋) */}
            {pose === 'saying_hi' && (
              <G id="wavingPaw" transform="translate(142, 65)">
                {/* Forearm with wrist wrap */}
                <Path d="M8 40 L28 10" stroke="#784735" strokeWidth="16" strokeLinecap="round" />
                {/* White / Gray Lifting Wrist Wrap */}
                <Rect x="16" y="16" width="16" height="12" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" transform="rotate(-30 24 22)" />
                {/* Big Bear Paw Hand */}
                <Circle cx="30" cy="8" r="16" fill="url(#furGrad)" stroke="#3E2016" strokeWidth="2.5" />
                {/* Paw Finger Pads */}
                <Circle cx="24" cy="0" r="4" fill="#3E2016" />
                <Circle cx="32" cy="-2" r="4" fill="#3E2016" />
                <Circle cx="40" cy="2" r="4" fill="#3E2016" />
                <Circle cx="44" cy="10" r="3.5" fill="#3E2016" />
                <Ellipse cx="30" cy="9" rx="7" ry="5" fill="#3E2016" opacity="0.6" />
              </G>
            )}

            {/* POSE: FLEXING BICEPS */}
            {pose === 'flexing' && (
              <G id="flexingArms">
                {/* Left Flexed Bicep */}
                <Path d="M46 160 Q20 140 28 110 Q40 100 52 120" stroke="#784735" strokeWidth="16" strokeLinecap="round" fill="none" />
                {/* Right Flexed Bicep */}
                <Path d="M154 160 Q180 140 172 110 Q160 100 148 120" stroke="#784735" strokeWidth="16" strokeLinecap="round" fill="none" />
                {/* Iron Dumbbell */}
                <Rect x="14" y="98" width="22" height="10" rx="3" fill="#334155" />
                <Rect x="164" y="98" width="22" height="10" rx="3" fill="#334155" />
              </G>
            )}

            {/* POSE: READING NOTEBOOK */}
            {(pose === 'reading_notebook' || pose === 'peeking') && (
              <G id="liftingJournal" transform="translate(48, 140)">
                <Rect x="0" y="0" width="104" height="58" rx="6" fill="url(#journalGrad)" stroke="#D9572B" strokeWidth="2" />
                <Rect x="8" y="6" width="88" height="46" rx="3" fill="#FFFBEB" />
                {/* Ruled Lines */}
                <Path d="M16 16 L88 16 M16 26 L88 26 M16 36 L88 36" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3,3" />
                {/* Red Ribbon */}
                <Path d="M52 4 L52 46 L56 40 L60 46 L60 4" fill="#D9572B" />
                {/* Paws Holding Journal */}
                <Circle cx="12" cy="28" r="13" fill="url(#furGrad)" stroke="#3E2016" strokeWidth="2" />
                <Circle cx="92" cy="28" r="13" fill="url(#furGrad)" stroke="#3E2016" strokeWidth="2" />
              </G>
            )}

            {/* POSE: THUMBS UP CELEBRATION */}
            {pose === 'thumbs_up' && (
              <G id="thumbsUpPaws">
                <Circle cx="44" cy="130" r="16" fill="url(#furGrad)" stroke="#3E2016" strokeWidth="2.5" />
                <Path d="M44 130 L44 108" stroke="#784735" strokeWidth="10" strokeLinecap="round" />
                <Circle cx="156" cy="130" r="16" fill="url(#furGrad)" stroke="#3E2016" strokeWidth="2.5" />
                <Path d="M156 130 L156 108" stroke="#784735" strokeWidth="10" strokeLinecap="round" />
              </G>
            )}
          </Svg>
        </Animated.View>
      </TouchableOpacity>

      {/* Tap Hint */}
      <Text style={styles.tapPromptText}>
        ✨ Tap Bruno to chat
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  speechBubbleContainer: {
    alignItems: 'center',
    marginBottom: 6,
    width: '100%',
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
    maxWidth: '92%',
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
  mascotTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapPromptText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D9572B',
    marginTop: 4,
    letterSpacing: 0.2,
  },
});
