// src/components/onboarding/OnboardingFlow.tsx
// Immersive 5-Step Onboarding with Hardware Checklist, Injury Blacklist & 3-Second Program Generation

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { UserProfile, GymEnvironment, JointContraindication } from '../../types';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [userName, setUserName] = useState('Lifter');
  
  // Hardware Selection
  const [selectedGymType, setSelectedGymType] = useState<'commercial' | 'apartment' | 'home'>('commercial');
  const [maxDbWeight, setMaxDbWeight] = useState(36);
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

  const toggleInjury = (injury: JointContraindication) => {
    if (selectedInjuries.includes(injury)) {
      setSelectedInjuries(selectedInjuries.filter(i => i !== injury));
    } else {
      setSelectedInjuries([...selectedInjuries, injury]);
    }
  };

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGenMessage('Bruno is examining your gym equipment...');
    
    setTimeout(() => {
      setGenMessage('Blacklisting contraindicated joint movements...');
    }, 900);

    setTimeout(() => {
      setGenMessage('Balancing 12–16 weekly sets per muscle group...');
    }, 1800);

    setTimeout(() => {
      setGenMessage('Locking 6-Week Progressive Overload Schedule...');
    }, 2400);

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
    }, 3200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Top Progress Indicator */}
        <View style={styles.progressRow}>
          {[1, 2, 3, 4, 5].map(s => (
            <View 
              key={s} 
              style={[
                styles.progressBar, 
                s <= step && styles.progressBarActive,
                s === step && styles.progressBarCurrent
              ]} 
            />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.mascotAvatarLarge}>
                <Text style={{ fontSize: 56 }}>🐻📖</Text>
              </View>
              <Text style={styles.stepKicker}>WELCOME TO BRUNO'S DEN</Text>
              <h1 style={styles.stepTitle}>No Spreadsheets. Just Pure Strength.</h1>
              <Text style={styles.stepDesc}>
                Most fitness apps make you stare at your phone mid-workout. Bruno is your wise heavyweight mentor: he builds your 6-week program, handles machine swaps in 1 tap, and progresses your weights automatically.
              </Text>

              <View style={styles.featureHighlights}>
                <View style={styles.highlightCard}>
                  <Text style={styles.highlightEmoji}>🛡️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.highlightTitle}>Hardware & Injury Aware</Text>
                    <Text style={styles.highlightDesc}>Programs strictly around what machines you have and joints you need to protect.</Text>
                  </View>
                </View>

                <View style={styles.highlightCard}>
                  <Text style={styles.highlightEmoji}>⚡</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.highlightTitle}>30-Second Post-Workout Log</Text>
                    <Text style={styles.highlightDesc}>Hit targets, tap once, and leave the gym. Zero timers or active phone checks.</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                activeOpacity={0.85}
                onPress={() => setStep(2)} 
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Configure Gym Gear →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: GYM HARDWARE PROFILES */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepKicker}>STEP 1 OF 3 • HARDWARE PROFILE</Text>
              <h1 style={styles.stepTitle}>Where Do You Train?</h1>
              <Text style={styles.stepDesc}>
                Bruno will never prescribe an exercise you lack equipment for. Select your primary gym environment:
              </Text>

              <View style={styles.optionsGrid}>
                {/* Commercial */}
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedGymType('commercial');
                    setHasBarbell(true);
                    setHasCables(true);
                    setMaxDbWeight(50);
                  }}
                  style={[styles.tierOption, selectedGymType === 'commercial' && styles.tierOptionActive]}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionEmoji}>🏢</Text>
                    <Text style={styles.optionName}>Commercial Gym</Text>
                  </View>
                  <Text style={styles.optionDesc}>Full barbell racks, cable stacks, leg press, dumbbells up to 50+ kg.</Text>
                </TouchableOpacity>

                {/* Apartment */}
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedGymType('apartment');
                    setHasBarbell(false);
                    setHasCables(true);
                    setMaxDbWeight(24);
                  }}
                  style={[styles.tierOption, selectedGymType === 'apartment' && styles.tierOptionActive]}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionEmoji}>🏙️</Text>
                    <Text style={styles.optionName}>Apartment Gym</Text>
                  </View>
                  <Text style={styles.optionDesc}>Cables, benches, pull-up bar, dumbbells up to 24 kg. No heavy barbell racks.</Text>
                </TouchableOpacity>

                {/* Home */}
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedGymType('home');
                    setHasBarbell(false);
                    setHasCables(false);
                    setMaxDbWeight(20);
                  }}
                  style={[styles.tierOption, selectedGymType === 'home' && styles.tierOptionActive]}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionEmoji}>🏠</Text>
                    <Text style={styles.optionName}>Home Dumbbells</Text>
                  </View>
                  <Text style={styles.optionDesc}>Adjustable dumbbells, bodyweight pull-up bar, floor space.</Text>
                </TouchableOpacity>
              </View>

              {/* Hardware Fine-Tuning */}
              <View style={styles.fineTuneCard}>
                <Text style={styles.fineTuneTitle}>Max Dumbbell Available: {maxDbWeight} kg</Text>
                <View style={styles.stepperRow}>
                  <TouchableOpacity onPress={() => setMaxDbWeight(Math.max(10, maxDbWeight - 2))} style={styles.stepperBtn}>
                    <Text style={styles.stepperBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{maxDbWeight} kg</Text>
                  <TouchableOpacity onPress={() => setMaxDbWeight(Math.min(70, maxDbWeight + 2))} style={styles.stepperBtn}>
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.navButtonsRow}>
                <TouchableOpacity onPress={() => setStep(1)} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStep(3)} style={[styles.primaryButton, { flex: 1 }]}>
                  <Text style={styles.primaryButtonText}>Injury Filters →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 3: PHYSICAL CONSTRAINTS & INJURY BLACKLIST */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepKicker}>STEP 2 OF 3 • JOINT SAFETY</Text>
              <h1 style={styles.stepTitle}>Movement Restrictions</h1>
              <Text style={styles.stepDesc}>
                Got cranky knees or lower back tweaks? Bruno automatically swaps high-risk movements for biomechanically safe variations.
              </Text>

              <View style={styles.injuryGrid}>
                {[
                  { id: 'lower_back', title: 'Lower Back Sensitivity', swapNote: 'Swaps Barbell Squat & RDLs for Belt Squats & Chest-Supported Rows.' },
                  { id: 'shoulder', title: 'Shoulder Impingement', swapNote: 'Swaps Overhead Barbell for Neutral DB Press & Landmine Presses.' },
                  { id: 'knee', title: 'Knee Discomfort', swapNote: 'Focuses on vertical shin angles, hip hinge dominant leg work.' },
                  { id: 'wrist', title: 'Wrist Sensitivity', swapNote: 'Replaces straight barbell curls & push-ups with neutral DB & push-up bars.' }
                ].map(item => {
                  const isSelected = selectedInjuries.includes(item.id as JointContraindication);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.8}
                      onPress={() => toggleInjury(item.id as JointContraindication)}
                      style={[styles.injuryCard, isSelected && styles.injuryCardActive]}
                    >
                      <View style={styles.injuryCardHeader}>
                        <View style={[styles.injuryCheckbox, isSelected && styles.injuryCheckboxActive]}>
                          {isSelected && <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>✓</Text>}
                        </View>
                        <Text style={[styles.injuryTitle, isSelected && styles.injuryTitleActive]}>{item.title}</Text>
                      </View>
                      <Text style={styles.injuryDesc}>{item.swapNote}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.navButtonsRow}>
                <TouchableOpacity onPress={() => setStep(2)} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStep(4)} style={[styles.primaryButton, { flex: 1 }]}>
                  <Text style={styles.primaryButtonText}>Schedule & Time →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 4: SCHEDULE & TIME BUDGET */}
          {step === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepKicker}>STEP 3 OF 3 • SCHEDULE BUDGET</Text>
              <h1 style={styles.stepTitle}>Your Weekly Commitment</h1>
              <Text style={styles.stepDesc}>
                Consistency beats intensity. Tell Bruno how many days you can realistically train:
              </Text>

              {/* Days Per Week */}
              <Text style={styles.sectionHeader}>Training Frequency</Text>
              <View style={styles.pillRow}>
                {([3, 4, 5, 6] as const).map(d => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setDaysPerWeek(d)}
                    style={[styles.pillBtn, daysPerWeek === d && styles.pillBtnActive]}
                  >
                    <Text style={[styles.pillText, daysPerWeek === d && styles.pillTextActive]}>
                      {d} Days / Wk
                    </Text>
                    <Text style={[styles.pillSub, daysPerWeek === d && styles.pillSubActive]}>
                      {d === 3 ? 'Full Body' : d === 4 ? 'Upper / Lower' : 'Push / Pull / Legs'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Session Duration */}
              <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Session Time Budget</Text>
              <View style={styles.pillRow}>
                {([30, 45, 60] as const).map(m => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setSessionMinutes(m)}
                    style={[styles.pillBtn, sessionMinutes === m && styles.pillBtnActive]}
                  >
                    <Text style={[styles.pillText, sessionMinutes === m && styles.pillTextActive]}>
                      {m} Mins
                    </Text>
                    <Text style={[styles.pillSub, sessionMinutes === m && styles.pillSubActive]}>
                      {m === 30 ? '3 Key Compounds' : m === 45 ? '4 Solid Moves' : '5–6 Full Volume'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.navButtonsRow}>
                <TouchableOpacity onPress={() => setStep(3)} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setStep(5); handleStartGeneration(); }} style={[styles.primaryButton, { flex: 1 }]}>
                  <Text style={styles.primaryButtonText}>Generate 6-Week Plan ⚡</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 5: AUTONOMOUS 3-SECOND GENERATION */}
          {step === 5 && (
            <View style={[styles.stepContainer, { alignItems: 'center', justifyContent: 'center', minHeight: 440 }]}>
              <View style={styles.mascotAvatarGen}>
                <Text style={{ fontSize: 64 }}>🐻⚡</Text>
              </View>
              
              <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 20 }} />
              
              <Text style={styles.genTitle}>Bruno is Chalking Up</Text>
              <Text style={styles.genStatusText}>{genMessage}</Text>

              <View style={styles.genCardPreview}>
                <View style={styles.genRow}>
                  <Text style={styles.genRowLabel}>Periodization:</Text>
                  <Text style={styles.genRowValue}>{daysPerWeek === 4 ? 'Upper/Lower Split' : daysPerWeek === 3 ? 'Full Body Waves' : 'Push/Pull/Legs'}</Text>
                </View>
                <View style={styles.genRow}>
                  <Text style={styles.genRowLabel}>Target Volume:</Text>
                  <Text style={styles.genRowValue}>12–14 sets / muscle group / week</Text>
                </View>
                <View style={styles.genRow}>
                  <Text style={styles.genRowLabel}>Injuries Filtered:</Text>
                  <Text style={styles.genRowValue}>{selectedInjuries.length > 0 ? selectedInjuries.join(', ') : 'None (Full Arsenal)'}</Text>
                </View>
              </View>
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
    backgroundColor: '#090D16',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E293B',
  },
  progressBarActive: {
    backgroundColor: '#3B82F6',
  },
  progressBarCurrent: {
    backgroundColor: '#60A5FA',
  },
  content: {
    paddingBottom: 40,
  },
  stepContainer: {
    width: '100%',
  },
  mascotAvatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  mascotAvatarGen: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1E293B',
    borderWidth: 2.5,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stepKicker: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#F8FAFC',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  stepDesc: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  featureHighlights: {
    gap: 12,
    marginBottom: 28,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
  },
  highlightEmoji: {
    fontSize: 26,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  highlightDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  optionsGrid: {
    gap: 12,
    marginBottom: 20,
  },
  tierOption: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
  },
  tierOptionActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  optionDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
  },
  fineTuneCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  fineTuneTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 10,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#60A5FA',
  },
  injuryGrid: {
    gap: 10,
    marginBottom: 24,
  },
  injuryCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
  },
  injuryCardActive: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  injuryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  injuryCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  injuryCheckboxActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  injuryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  injuryTitleActive: {
    color: '#FCA5A5',
  },
  injuryDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
    paddingLeft: 30,
    lineHeight: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
  },
  pillBtnActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  pillTextActive: {
    color: '#60A5FA',
  },
  pillSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  pillSubActive: {
    color: '#93C5FD',
  },
  navButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  genTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FAFC',
    marginTop: 8,
  },
  genStatusText: {
    fontSize: 13,
    color: '#60A5FA',
    marginTop: 4,
    fontWeight: '600',
  },
  genCardPreview: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    gap: 10,
  },
  genRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genRowLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  genRowValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
  },
});
