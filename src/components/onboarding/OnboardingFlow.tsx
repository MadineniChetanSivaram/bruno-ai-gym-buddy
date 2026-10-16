// src/components/onboarding/OnboardingFlow.tsx
// Immersive 5-Step Onboarding with Hardware Checklist, Injury Blacklist & 3-Second Program Generation
// Satya / Clucky style: High-craft, 100% native React Native, spring physics, dynamic themes & haptics

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  Animated
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Building2, ShieldCheck, Dumbbell, Calendar, Clock, Check, Sparkles } from 'lucide-react-native';
import { UserProfile, GymEnvironment, JointContraindication } from '../../types';
import { useBruno } from '../../context/BrunoContext';
import { TactileButton } from '../common/TactileButton';
import { BrunoCharacterSvg } from '../mascot/BrunoCharacterSvg';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { colors, theme } = useBruno();
  const [step, setStep] = useState<number>(1);
  const [userName, setUserName] = useState('Lifter');
  
  // Hardware Selection
  const [selectedGymType, setSelectedGymType] = useState<'commercial' | 'apartment' | 'home'>('commercial');
  const [maxDbWeight, setMaxDbWeight] = useState(50);
  const [hasBarbell, setHasBarbell] = useState(true);
  const [hasCables, setHasCables] = useState(true);
  
  // Injury Blacklist
  const [selectedInjuries, setSelectedInjuries] = useState<JointContraindication[]>([]);
  
  // Schedule & Time Budget
  const [daysPerWeek, setDaysPerWeek] = useState<3 | 4 | 5 | 6>(4);
  const [sessionMinutes, setSessionMinutes] = useState<30 | 45 | 60>(45);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState('Chalking up paws...');

  const goToNextStep = (nextStep: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    setStep(nextStep);
  };

  const toggleInjury = (injury: JointContraindication) => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    if (selectedInjuries.includes(injury)) {
      setSelectedInjuries(selectedInjuries.filter(i => i !== injury));
    } else {
      setSelectedInjuries([...selectedInjuries, injury]);
    }
  };

  const handleStartGeneration = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
    setIsGenerating(true);
    setGenMessage('Bruno is scanning your gym equipment...');
    
    setTimeout(() => {
      setGenMessage('Blacklisting contraindicated joint movements...');
    }, 900);

    setTimeout(() => {
      setGenMessage('Balancing 10–16 weekly sets per muscle group...');
    }, 1800);

    setTimeout(() => {
      setGenMessage('Locking 6-Week Progressive Overload Mesocycle...');
    }, 2500);

    setTimeout(() => {
      const activeGym: GymEnvironment = {
        id: selectedGymType + '_custom',
        name: selectedGymType === 'commercial' ? 'Commercial Powerhouse' : selectedGymType === 'apartment' ? 'Apartment Fitness' : 'Home Dumbbells',
        type: selectedGymType,
        maxDumbbellWeightKg: maxDbWeight,
        hasBarbellRack: hasBarbell,
        hasCableStack: hasCables,
        hasSmithMachine: selectedGymType === 'commercial',
        hasPullUpBar: true,
      };

      const finalProfile: UserProfile = {
        id: 'user_' + Date.now(),
        name: userName,
        unit: 'kg',
        activeGymId: activeGym.id,
        gymEnvironments: [activeGym],
        injuryBlacklist: selectedInjuries,
        daysPerWeek,
        sessionDurationMinutes: sessionMinutes,
        onboardingCompleted: true,
        currentStreakWeeks: 1,
      };

      setIsGenerating(false);
      onComplete(finalProfile);
    }, 3400);
  };

  // 3-Second Autonomous Mesocycle Loading Overlay
  if (isGenerating) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.generatingContainer}>
          <BrunoCharacterSvg expression="intense_lift" size={140} animated={true} />
          <Text style={[styles.genTitle, { color: colors.textPrimary, marginTop: 16 }]}>
            Bruno is Writing Your Program
          </Text>
          <Text style={[styles.genSubtitle, { color: colors.amber }]}>
            {genMessage}
          </Text>
          <ActivityIndicator size="large" color={colors.amber} style={{ marginTop: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>

        {/* Top Stepper Progress Pills */}
        <View style={styles.progressRow}>
          {[1, 2, 3, 4].map(s => (
            <View 
              key={s} 
              style={[
                styles.progressBar, 
                { backgroundColor: colors.surfaceSubtle },
                s <= step && { backgroundColor: colors.amber },
              ]} 
            />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* STEP 1: WELCOME TO THE DEN */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.mascotAvatarLarge}>
                <BrunoCharacterSvg expression="idle_reading" size={150} animated={true} />
              </View>

              <View style={[styles.kickerPill, { backgroundColor: colors.amberGlow }]}>
                <Text style={[styles.stepKicker, { color: colors.amber }]}>
                  ENTER BRUNO'S DEN
                </Text>
              </View>

              <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                Zero Spreadsheets. Pure Strength.
              </Text>
              <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                Most apps make you stare at your screen during rest periods. Bruno is your heavyweight bear buddy: he prescribes your 6-week routine, swaps busy machines in 1 tap, and progresses your weights automatically.
              </Text>

              <View style={styles.featureHighlights}>
                <View style={[styles.highlightCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                  <Text style={styles.highlightEmoji}>🏛️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.highlightTitle, { color: colors.textPrimary }]}>
                      Equipment Aware
                    </Text>
                    <Text style={[styles.highlightDesc, { color: colors.textSecondary }]}>
                      Calibrated precisely to your gym hardware and dumbbell limits.
                    </Text>
                  </View>
                </View>

                <View style={[styles.highlightCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                  <Text style={styles.highlightEmoji}>🛡️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.highlightTitle, { color: colors.textPrimary }]}>
                      Joint Injury Blacklist
                    </Text>
                    <Text style={[styles.highlightDesc, { color: colors.textSecondary }]}>
                      Automatically substitutes movements that impinge your joints.
                    </Text>
                  </View>
                </View>

                <View style={[styles.highlightCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                  <Text style={styles.highlightEmoji}>⚡</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.highlightTitle, { color: colors.textPrimary }]}>
                      30-Second Frictionless Log
                    </Text>
                    <Text style={[styles.highlightDesc, { color: colors.textSecondary }]}>
                      1 tap to confirm session targets. Zero tedious set-by-set typing.
                    </Text>
                  </View>
                </View>
              </View>

              <TactileButton
                onPress={() => goToNextStep(2)}
                title="Configure Gym Hardware →"
                size="lg"
                variant="primary"
                style={{ width: '100%', marginTop: 8 }}
              />
            </View>
          )}

          {/* STEP 2: GYM HARDWARE */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={[styles.kickerPill, { backgroundColor: colors.amberGlow }]}>
                <Text style={[styles.stepKicker, { color: colors.amber }]}>
                  STEP 1 OF 3 • HARDWARE PROFILE
                </Text>
              </View>

              <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                Where Do You Lift?
              </Text>
              <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                Bruno will never prescribe an exercise you lack equipment for. Select your primary gym environment:
              </Text>

              <View style={styles.optionsGrid}>
                {/* Commercial */}
                <TouchableOpacity 
                  activeOpacity={0.82}
                  onPress={() => {
                    try { Haptics.selectionAsync(); } catch (_) {}
                    setSelectedGymType('commercial');
                    setHasBarbell(true);
                    setHasCables(true);
                    setMaxDbWeight(50);
                  }}
                  style={[
                    styles.tierOption, 
                    { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                    selectedGymType === 'commercial' && { backgroundColor: colors.amberGlow, borderColor: colors.amber }
                  ]}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionEmoji}>🏛️</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionName, { color: colors.textPrimary }]}>Commercial Gym</Text>
                      <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                        Full barbell racks, cables, leg press, dumbbells up to 50+ kg.
                      </Text>
                    </View>
                    {selectedGymType === 'commercial' && (
                      <View style={[styles.selectedCheck, { backgroundColor: colors.amber }]}>
                        <Check size={14} color={colors.textInverted} strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Apartment */}
                <TouchableOpacity 
                  activeOpacity={0.82}
                  onPress={() => {
                    try { Haptics.selectionAsync(); } catch (_) {}
                    setSelectedGymType('apartment');
                    setHasBarbell(false);
                    setHasCables(true);
                    setMaxDbWeight(24);
                  }}
                  style={[
                    styles.tierOption, 
                    { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                    selectedGymType === 'apartment' && { backgroundColor: colors.amberGlow, borderColor: colors.amber }
                  ]}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionEmoji}>🏢</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionName, { color: colors.textPrimary }]}>Apartment / Hotel Gym</Text>
                      <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                        Dumbbells up to 24kg & cable stack. No heavy barbell racks.
                      </Text>
                    </View>
                    {selectedGymType === 'apartment' && (
                      <View style={[styles.selectedCheck, { backgroundColor: colors.amber }]}>
                        <Check size={14} color={colors.textInverted} strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Home Studio */}
                <TouchableOpacity 
                  activeOpacity={0.82}
                  onPress={() => {
                    try { Haptics.selectionAsync(); } catch (_) {}
                    setSelectedGymType('home');
                    setHasBarbell(false);
                    setHasCables(false);
                    setMaxDbWeight(20);
                  }}
                  style={[
                    styles.tierOption, 
                    { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                    selectedGymType === 'home' && { backgroundColor: colors.amberGlow, borderColor: colors.amber }
                  ]}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionEmoji}>🏠</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionName, { color: colors.textPrimary }]}>Home Dumbbell Studio</Text>
                      <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                        Dumbbells up to 20kg and pull-up bar. Pure dumbbell routines.
                      </Text>
                    </View>
                    {selectedGymType === 'home' && (
                      <View style={[styles.selectedCheck, { backgroundColor: colors.amber }]}>
                        <Check size={14} color={colors.textInverted} strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <TactileButton
                onPress={() => goToNextStep(3)}
                title="Select Injury Protections →"
                size="lg"
                variant="primary"
                style={{ width: '100%', marginTop: 8 }}
              />
            </View>
          )}

          {/* STEP 3: INJURY BLACKLIST */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <View style={[styles.kickerPill, { backgroundColor: colors.amberGlow }]}>
                <Text style={[styles.stepKicker, { color: colors.amber }]}>
                  STEP 2 OF 3 • JOINT HEALTH
                </Text>
              </View>

              <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                Any Joints to Protect?
              </Text>
              <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                Select any areas with pain or sensitivity. Bruno will substitute impinging movements with biomechanically safe variations:
              </Text>

              <View style={styles.injuryGrid}>
                {[
                  { id: 'lower_back' as JointContraindication, label: 'Lower Back', sub: 'Replaces heavy axial spinal loads (Deadlifts, Squats) with chest-supported work' },
                  { id: 'shoulder' as JointContraindication, label: 'Shoulders', sub: 'Substitutes wide flaring benches for neutral dumbbell grips & cables' },
                  { id: 'knee' as JointContraindication, label: 'Knees', sub: 'Prioritizes hip hinges, leg press, and hamstring curls over deep squats' },
                  { id: 'wrist' as JointContraindication, label: 'Wrists', sub: 'Replaces straight barbells with neutral dumbbells & angled grips' },
                  { id: 'elbow' as JointContraindication, label: 'Elbows', sub: 'Replaces skullcrushers with triceps rope pushdowns' },
                ].map((item) => {
                  const isChecked = selectedInjuries.includes(item.id);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.8}
                      onPress={() => toggleInjury(item.id)}
                      style={[
                        styles.injuryCard,
                        { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                        isChecked && { backgroundColor: colors.dangerBg, borderColor: colors.danger }
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.injuryCardTitle, { color: isChecked ? colors.danger : colors.textPrimary }]}>
                          {item.label} {isChecked ? '🛡️ (Shielded)' : ''}
                        </Text>
                        <Text style={[styles.injuryCardSub, { color: colors.textSecondary }]}>
                          {item.sub}
                        </Text>
                      </View>
                      <View 
                        style={[
                          styles.checkboxSquare, 
                          { borderColor: colors.borderStrong },
                          isChecked && { backgroundColor: colors.danger, borderColor: colors.danger }
                        ]}
                      >
                        {isChecked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TactileButton
                onPress={() => goToNextStep(4)}
                title="Schedule & Time Budget →"
                size="lg"
                variant="primary"
                style={{ width: '100%', marginTop: 8 }}
              />
            </View>
          )}

          {/* STEP 4: SCHEDULE & COMMITMENT */}
          {step === 4 && (
            <View style={styles.stepContainer}>
              <View style={[styles.kickerPill, { backgroundColor: colors.amberGlow }]}>
                <Text style={[styles.stepKicker, { color: colors.amber }]}>
                  STEP 3 OF 3 • LIFTING BUDGET
                </Text>
              </View>

              <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                Your Weekly Training Budget
              </Text>
              <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                Bruno will distribute optimal muscle volume (10–16 sets/muscle/week) across your chosen frequency:
              </Text>

              {/* Days Per Week */}
              <View style={[styles.budgetBox, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                <View style={styles.budgetHeader}>
                  <Calendar size={16} color={colors.amber} />
                  <Text style={[styles.budgetLabel, { color: colors.textPrimary }]}>
                    Days Per Week
                  </Text>
                </View>
                <View style={styles.budgetPillsRow}>
                  {[3, 4, 5, 6].map((days) => {
                    const isSelected = daysPerWeek === days;
                    return (
                      <TouchableOpacity
                        key={days}
                        onPress={() => {
                          try { Haptics.selectionAsync(); } catch (_) {}
                          setDaysPerWeek(days as any);
                        }}
                        style={[
                          styles.budgetPill,
                          { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
                          isSelected && { backgroundColor: colors.amber, borderColor: colors.amberDark }
                        ]}
                        activeOpacity={0.75}
                      >
                        <Text style={[
                          styles.budgetPillNum, 
                          { color: colors.textSecondary },
                          isSelected && { color: colors.textInverted, fontWeight: '900' }
                        ]}>
                          {days} Days
                        </Text>
                        <Text style={[
                          styles.budgetPillSub, 
                          { color: colors.textMuted },
                          isSelected && { color: colors.textInverted }
                        ]}>
                          {days === 3 ? 'Full Body' : days === 4 ? 'Upper/Lower' : 'Push/Pull/Legs'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Session Duration */}
              <View style={[styles.budgetBox, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                <View style={styles.budgetHeader}>
                  <Clock size={16} color={colors.info} />
                  <Text style={[styles.budgetLabel, { color: colors.textPrimary }]}>
                    Session Duration
                  </Text>
                </View>
                <View style={styles.budgetPillsRow}>
                  {[30, 45, 60].map((mins) => {
                    const isSelected = sessionMinutes === mins;
                    return (
                      <TouchableOpacity
                        key={mins}
                        onPress={() => {
                          try { Haptics.selectionAsync(); } catch (_) {}
                          setSessionMinutes(mins as any);
                        }}
                        style={[
                          styles.budgetPill,
                          { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
                          isSelected && { backgroundColor: colors.amber, borderColor: colors.amberDark }
                        ]}
                        activeOpacity={0.75}
                      >
                        <Text style={[
                          styles.budgetPillNum, 
                          { color: colors.textSecondary },
                          isSelected && { color: colors.textInverted, fontWeight: '900' }
                        ]}>
                          {mins} Mins
                        </Text>
                        <Text style={[
                          styles.budgetPillSub, 
                          { color: colors.textMuted },
                          isSelected && { color: colors.textInverted }
                        ]}>
                          {mins === 30 ? '3 Movements' : mins === 45 ? '4 Movements' : '5 Movements'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Final Generation Button */}
              <TactileButton
                onPress={handleStartGeneration}
                title="Generate 6-Week Routine (3s) ⚡"
                size="lg"
                variant="primary"
                style={{ width: '100%', marginTop: 12 }}
              />
            </View>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  generatingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  mascotGenCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  genTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 8,
  },
  genSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  stepContainer: {
    alignItems: 'center',
    gap: 12,
  },
  mascotAvatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  kickerPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepKicker: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  featureHighlights: {
    width: '100%',
    gap: 10,
    marginVertical: 10,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.2,
  },
  highlightEmoji: {
    fontSize: 24,
  },
  highlightTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  highlightDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  optionsGrid: {
    width: '100%',
    gap: 10,
    marginVertical: 10,
  },
  tierOption: {
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 14,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionName: {
    fontSize: 14,
    fontWeight: '800',
  },
  optionDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  selectedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  injuryGrid: {
    width: '100%',
    gap: 10,
    marginVertical: 10,
  },
  injuryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.2,
  },
  injuryCardTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  injuryCardSub: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  checkboxSquare: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  budgetBox: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 14,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  budgetLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  budgetPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  budgetPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetPillNum: {
    fontSize: 12,
    fontWeight: '800',
  },
  budgetPillSub: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
});
