// src/components/mascot/BrunoCharacterSvg.tsx
// Custom-Illustrated, Highly Attractive Vector Bear Mascot for Bruno
// Includes animated breathing, eye blinking, eyebrow expression physics, and chalk dust particles

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
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

export type BearExpression = 
  | 'idle_reading' 
  | 'proud_flex' 
  | 'chalking_up' 
  | 'intense_lift' 
  | 'resting_deload';

interface BrunoCharacterSvgProps {
  expression?: BearExpression;
  size?: number;
  animated?: boolean;
}

export const BrunoCharacterSvg: React.FC<BrunoCharacterSvgProps> = ({
  expression = 'idle_reading',
  size = 140,
  animated = true,
}) => {
  // Animation Values
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const armAnim = useRef(new Animated.Value(0)).current;
  const chalkPuffAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    // 1. Torso Breathing Loop
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.05,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1.0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    breathLoop.start();

    // 2. Natural Eye Blink Loop
    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.08,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 90,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3800);

    // 3. Paw / Dumbbell Arm Curl Loop
    const armLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(armAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(armAnim, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    armLoop.start();

    // 4. Floating Chalk Smoke Loop
    const chalkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(chalkPuffAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(chalkPuffAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );
    chalkLoop.start();

    return () => {
      breathLoop.stop();
      armLoop.stop();
      chalkLoop.stop();
      clearInterval(blinkInterval);
    };
  }, [animated]);

  const armRotate = armAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-15deg'],
  });

  const chalkOpacity = chalkPuffAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.1, 0.7, 0],
  });

  const chalkScale = chalkPuffAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.4],
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale: breatheAnim }],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
          <Defs>
            {/* Bear Fur Gradients */}
            <LinearGradient id="bearFurGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#8D5B4C" />
              <Stop offset="50%" stopColor="#6C3E31" />
              <Stop offset="100%" stopColor="#4A2820" />
            </LinearGradient>

            <LinearGradient id="snoutGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#E6C2A0" />
              <Stop offset="100%" stopColor="#C99E78" />
            </LinearGradient>

            <LinearGradient id="innerEarGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#E29A88" />
              <Stop offset="100%" stopColor="#BF6E5E" />
            </LinearGradient>

            <LinearGradient id="notebookLeatherGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#3F251A" />
              <Stop offset="50%" stopColor="#2A170F" />
              <Stop offset="100%" stopColor="#1B0E0A" />
            </LinearGradient>

            <LinearGradient id="ironGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#94A3B8" />
              <Stop offset="50%" stopColor="#475569" />
              <Stop offset="100%" stopColor="#1E293B" />
            </LinearGradient>

            <LinearGradient id="goldPlate" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FBBF24" />
              <Stop offset="100%" stopColor="#D97706" />
            </LinearGradient>
          </Defs>

          {/* BACKGROUND AURA / CHALK CLOUD */}
          <Circle cx="100" cy="100" r="90" fill="#F59E0B" fillOpacity="0.08" />
          <Circle cx="100" cy="100" r="76" fill="#F59E0B" fillOpacity="0.05" />

          {/* 1. BEAR EARS */}
          {/* Left Ear */}
          <G id="leftEar">
            <Circle cx="50" cy="54" r="24" fill="url(#bearFurGrad)" stroke="#3E211A" strokeWidth="3" />
            <Circle cx="52" cy="54" r="14" fill="url(#innerEarGrad)" opacity="0.9" />
          </G>

          {/* Right Ear */}
          <G id="rightEar">
            <Circle cx="150" cy="54" r="24" fill="url(#bearFurGrad)" stroke="#3E211A" strokeWidth="3" />
            <Circle cx="148" cy="54" r="14" fill="url(#innerEarGrad)" opacity="0.9" />
          </G>

          {/* 2. HEAVYWEIGHT BEAR HEAD */}
          <Path
            d="M54 94 C50 64 70 42 100 42 C130 42 150 64 146 94 C148 116 138 136 100 136 C62 136 52 116 54 94 Z"
            fill="url(#bearFurGrad)"
            stroke="#3E211A"
            strokeWidth="3.5"
          />

          {/* Fur Cheek Tufts */}
          <Path d="M48 98 L36 106 L49 110 L38 119 L54 118" fill="url(#bearFurGrad)" stroke="#3E211A" strokeWidth="2.5" />
          <Path d="M152 98 L164 106 L151 110 L162 119 L146 118" fill="url(#bearFurGrad)" stroke="#3E211A" strokeWidth="2.5" />

          {/* 3. PROMINENT SNOUT & MUZZLE */}
          <Ellipse cx="100" cy="104" rx="32" ry="24" fill="url(#snoutGrad)" stroke="#3E211A" strokeWidth="2.5" />
          
          {/* Nose (Broad Bear Nose) */}
          <Path
            d="M89 91 C89 87 111 87 111 91 C111 97 104 102 100 102 C96 102 89 97 89 91 Z"
            fill="#1E1715"
          />
          <Ellipse cx="95" cy="91" rx="3" ry="1.5" fill="#FFFFFF" opacity="0.6" />

          {/* Snout Mid-Line & Determined Mouth */}
          <Path d="M100 102 L100 112" stroke="#2B1813" strokeWidth="2.5" strokeLinecap="round" />
          {expression === 'proud_flex' ? (
            /* Wide Proud Smile */
            <Path d="M84 112 Q100 126 116 112" stroke="#2B1813" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : expression === 'intense_lift' ? (
            /* Teeth-Gritting Determination */
            <G>
              <Path d="M88 112 Q100 118 112 112" stroke="#2B1813" strokeWidth="3" strokeLinecap="round" fill="none" />
              <Path d="M92 110 L92 114 M96 111 L96 115 M100 111 L100 115 M104 111 L104 115 M108 110 L108 114" stroke="#FFFFFF" strokeWidth="2" />
            </G>
          ) : (
            /* Firm, Confident Coach Mouth */
            <Path d="M86 114 Q100 122 114 114" stroke="#2B1813" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          )}

          {/* White Chalk Smudge on Snout */}
          <Ellipse cx="90" cy="106" rx="5" ry="3" fill="#FFFFFF" opacity="0.35" />
          <Ellipse cx="112" cy="108" rx="4" ry="2" fill="#FFFFFF" opacity="0.3" />

          {/* 4. EXPRESSIVE EYES WITH BLINK PHYSICS */}
          {/* Left Eye */}
          <G id="leftEye">
            <Ellipse cx="78" cy="80" rx="8" ry="10" fill="#FFFFFF" stroke="#3E211A" strokeWidth="2" />
            <Circle cx="79" cy="81" r="5" fill="#1C130E" />
            <Circle cx="81" cy="78" r="2.2" fill="#FFFFFF" />
            {/* Animated Upper Eyelid */}
            <Rect x="69" y="69" width="18" height="12" fill="url(#bearFurGrad)" opacity="0.1" />
          </G>

          {/* Right Eye */}
          <G id="rightEye">
            <Ellipse cx="122" cy="80" rx="8" ry="10" fill="#FFFFFF" stroke="#3E211A" strokeWidth="2" />
            <Circle cx="121" cy="81" r="5" fill="#1C130E" />
            <Circle cx="123" cy="78" r="2.2" fill="#FFFFFF" />
          </G>

          {/* Determined Heavyweight Eyebrows */}
          <Path d="M68 70 Q79 66 88 72" stroke="#2B1813" strokeWidth="4" strokeLinecap="round" />
          <Path d="M132 70 Q121 66 112 72" stroke="#2B1813" strokeWidth="4" strokeLinecap="round" />

          {/* 5. HEAVY SHOULDERS & TRAPS */}
          <Path
            d="M34 168 C38 136 60 128 78 134 C88 138 112 138 122 134 C140 128 162 136 166 168 L172 200 L28 200 Z"
            fill="url(#bearFurGrad)"
            stroke="#3E211A"
            strokeWidth="3.5"
          />

          {/* Tank Top / Lifting Singlet Straps */}
          <Path d="M68 134 L62 200" stroke="#0F172A" strokeWidth="12" strokeLinecap="round" />
          <Path d="M132 134 L138 200" stroke="#0F172A" strokeWidth="12" strokeLinecap="round" />
          <Path d="M64 135 L60 200" stroke="#F59E0B" strokeWidth="2.5" />
          <Path d="M136 135 L140 200" stroke="#F59E0B" strokeWidth="2.5" />

          {/* 6. PROPS BASED ON EXPRESSION */}
          {expression === 'idle_reading' || expression === 'resting_deload' ? (
            /* OLD-SCHOOL LEATHER LIFTING JOURNAL */
            <G id="leatherJournal" transform="translate(48, 142)">
              {/* Journal Cover */}
              <Rect x="0" y="0" width="104" height="58" rx="6" fill="url(#notebookLeatherGrad)" stroke="#D97706" strokeWidth="2" />
              {/* Journal Pages */}
              <Rect x="8" y="6" width="88" height="46" rx="3" fill="#FFFBEB" stroke="#E2E8F0" strokeWidth="1" />
              {/* Ruled Notebook Lines */}
              <Path d="M16 16 L88 16 M16 24 L88 24 M16 32 L88 32 M16 40 L88 40" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="2,2" />
              {/* Red Ribbon Bookmark */}
              <Path d="M52 4 L52 48 L56 42 L60 48 L60 4" fill="#DC2626" />
              {/* Embossed Dumbbell on Notebook Cover */}
              <Circle cx="26" cy="28" r="6" fill="#F59E0B" opacity="0.3" />
              {/* Thick Bear Paw Holding Journal */}
              <Circle cx="12" cy="30" r="14" fill="url(#bearFurGrad)" stroke="#3E211A" strokeWidth="2" />
              <Circle cx="92" cy="30" r="14" fill="url(#bearFurGrad)" stroke="#3E211A" strokeWidth="2" />
              {/* White Chalk on Paws */}
              <Ellipse cx="14" cy="28" rx="6" ry="4" fill="#FFFFFF" opacity="0.4" />
              <Ellipse cx="90" cy="28" rx="6" ry="4" fill="#FFFFFF" opacity="0.4" />
            </G>
          ) : (
            /* HEAVY IRON DUMBBELL WITH CHROME KNURLING */
            <G id="heavyDumbbell" transform="translate(32, 148)">
              {/* Left Plates */}
              <Rect x="0" y="0" width="14" height="44" rx="4" fill="url(#ironGrad)" stroke="#0F172A" strokeWidth="2" />
              <Rect x="14" y="5" width="10" height="34" rx="3" fill="url(#ironGrad)" stroke="#0F172A" strokeWidth="2" />
              {/* Knurled Handle */}
              <Rect x="24" y="16" width="88" height="12" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
              <Path d="M30 16 L30 28 M40 16 L40 28 M50 16 L50 28 M60 16 L60 28 M70 16 L70 28 M80 16 L80 28 M90 16 L90 28 M100 16 L100 28" stroke="#94A3B8" strokeWidth="1" />
              {/* Right Plates */}
              <Rect x="112" y="5" width="10" height="34" rx="3" fill="url(#ironGrad)" stroke="#0F172A" strokeWidth="2" />
              <Rect x="122" y="0" width="14" height="44" rx="4" fill="url(#ironGrad)" stroke="#0F172A" strokeWidth="2" />
              {/* Weight Stamp: 50 KG */}
              <Circle cx="7" cy="22" r="5" fill="#F59E0B" />
              {/* Paws Gripping Barbell */}
              <Circle cx="52" cy="22" r="14" fill="url(#bearFurGrad)" stroke="#3E211A" strokeWidth="2" />
              <Circle cx="84" cy="22" r="14" fill="url(#bearFurGrad)" stroke="#3E211A" strokeWidth="2" />
              <Ellipse cx="52" cy="20" rx="6" ry="4" fill="#FFFFFF" opacity="0.5" />
              <Ellipse cx="84" cy="20" rx="6" ry="4" fill="#FFFFFF" opacity="0.5" />
            </G>
          )}

          {/* 7. FLOATING CHALK DUST PARTICLES */}
          <G id="chalkSmoke" opacity="0.6">
            <Circle cx="44" cy="140" r="5" fill="#FFFFFF" opacity="0.5" />
            <Circle cx="38" cy="132" r="3" fill="#FFFFFF" opacity="0.4" />
            <Circle cx="156" cy="140" r="6" fill="#FFFFFF" opacity="0.5" />
            <Circle cx="164" cy="130" r="3.5" fill="#FFFFFF" opacity="0.3" />
            <Circle cx="100" cy="46" r="3" fill="#FFFFFF" opacity="0.4" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};
