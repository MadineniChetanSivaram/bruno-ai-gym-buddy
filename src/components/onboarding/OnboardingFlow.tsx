// src/components/onboarding/OnboardingFlow.tsx
// Exact 8-Step Onboarding Flow matching the design template photos
// Photorealistic 3D Bruno Bear Mascot, terracotta orange highlights & warm ivory background

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  TextInput,
  Image
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { 
  Dumbbell, 
  RotateCw, 
  TrendingUp, 
  Check, 
  ChevronRight, 
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react-native';
import { UserProfile, GymEnvironment, JointContraindication } from '../../types';
import { useBruno } from '../../context/BrunoContext';
import { BrunoMascotImage } from '../mascot/BrunoMascotImage';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
  onExit?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onExit }) => {
  const { colors } = useBruno();
  // Steps 1 to 8:
  // 1: Splash / Intro
  // 2: Value Proposition
  // 3: Goal Selection
  // 4: Experience Level
  // 5: Training Frequency & Duration
  // 6: Onboarding Complete ("You're all set!")
  // 7: Gym Equipment Setup (2/5)
  // 8: Physical Profile & Movement Restrictions (3/5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [goal, setGoal] = useState<'strength' | 'muscle' | 'fitness' | 'recomp'>('strength');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [daysPerWeek, setDaysPerWeek] = useState<3 | 4 | 5 | 6>(5);
  const [durationMinutes, setDurationMinutes] = useState<30 | 45 | 60>(45);
  
  // Gym Equipment
  const [gymName, setGymName] = useState('My Commercial Gym');
  const [equipment, setEquipment] = useState<{ [key: string]: boolean }>({
    dumbbells: true,
    barbell: true,
    cables: true,
    smith: true,
    pullup: true,
    other: true,
  });
  const [maxDumbbellWeight, setMaxDumbbellWeight] = useState(40);

  // Injuries / Restrictions
  const [injuries, setInjuries] = useState<JointContraindication[]>(['lower_back']);

  const nextStep = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalComplete();
    }
  };

  const prevStep = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleEquipment = (key: string) => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    setEquipment(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleInjury = (joint: JointContraindication) => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    if (injuries.includes(joint)) {
      setInjuries(injuries.filter(j => j !== joint));
    } else {
      setInjuries([...injuries, joint]);
    }
  };

  const handleFinalComplete = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}

    const customGym: GymEnvironment = {
      id: 'gym_' + Date.now(),
      name: gymName || 'My Commercial Gym',
      type: 'commercial',
      maxDumbbellWeightKg: maxDumbbellWeight,
      hasBarbellRack: equipment.barbell,
      hasCableStack: equipment.cables,
      hasSmithMachine: equipment.smith,
      hasPullUpBar: equipment.pullup,
    };

    const finalProfile: UserProfile = {
      id: 'user_alex',
      name: 'Alex',
      unit: 'kg',
      activeGymId: customGym.id,
      gymEnvironments: [customGym],
      injuryBlacklist: injuries,
      daysPerWeek: daysPerWeek,
      sessionDurationMinutes: durationMinutes,
      onboardingCompleted: true,
      currentStreakWeeks: 1,
    };

    onComplete(finalProfile);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      
      {/* Top Header Bar for Steps 2 to 8 */}
      {currentStep > 1 && (
        <View style={styles.topNavigation}>
          <TouchableOpacity onPress={prevStep} style={styles.backButton}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Stepper Dots */}
          <View style={styles.stepIndicatorContainer}>
            {[2, 3, 4, 5, 6, 7, 8].map((s) => (
              <View 
                key={s} 
                style={[
                  styles.stepDot, 
                  { backgroundColor: colors.borderStrong },
                  s <= currentStep && { backgroundColor: colors.amber }
                ]} 
              />
            ))}
          </View>

          <TouchableOpacity onPress={onExit ? onExit : () => setCurrentStep(8)} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: colors.amber }]}>{onExit ? 'Dashboard ✕' : 'Skip'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >

        {/* ============================================================== */}
        {/* SCREEN 1: SPLASH / INTRO                                        */}
        {/* ============================================================== */}
        {currentStep === 1 && (
          <View style={styles.screenWrapper}>
            {onExit && (
              <View style={{ width: '100%', alignItems: 'flex-end', marginBottom: 4 }}>
                <TouchableOpacity 
                  onPress={onExit} 
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceCard }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '800', color: colors.amber }}>View Dashboard →</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Title 3D Graphic */}
            <View style={styles.splashTitleBox}>
              <Text style={styles.splashBrand}>BRUNO</Text>
              <Text style={styles.splashSubBrand}>AI GYM BUDDY</Text>
            </View>

            {/* Animated Waving Mascot Centerpiece */}
            <View style={styles.splashMascotContainer}>
              <BrunoMascotImage 
                pose="splash" 
                size={200} 
                animated={true}
                showSpeechBubble={true}
                customMessage="Hi! I'm Bruno, your AI Gym Buddy! 👋 Tap me anytime!" 
              />
            </View>

            {/* Headlines */}
            <View style={styles.splashTextContainer}>
              <Text style={[styles.mainHeroTitle, { color: colors.textPrimary }]}>
                Smarter Strength Training.{'\n'}Less Hassle.
              </Text>
              <Text style={[styles.mainHeroSubtitle, { color: colors.textSecondary }]}>
                Bruno designs your workouts, adapts to your gym and helps you get stronger without the spreadsheets.
              </Text>
            </View>

            {/* 3 Value Pillars */}
            <View style={styles.pillarsRow}>
              <View style={[styles.pillarItem, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                <Dumbbell size={18} color={colors.amber} />
                <Text style={[styles.pillarLabel, { color: colors.textPrimary }]}>Personalized{'\n'}programs</Text>
              </View>
              <View style={[styles.pillarItem, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                <RotateCw size={18} color={colors.amber} />
                <Text style={[styles.pillarLabel, { color: colors.textPrimary }]}>Smart machine{'\n'}swaps</Text>
              </View>
              <View style={[styles.pillarItem, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                <TrendingUp size={18} color={colors.amber} />
                <Text style={[styles.pillarLabel, { color: colors.textPrimary }]}>Automatic{'\n'}progression</Text>
              </View>
            </View>

            {/* Bottom Get Started CTA */}
            <TouchableOpacity 
              activeOpacity={0.88}
              onPress={nextStep}
              style={[styles.primaryTerracottaBtn, { backgroundColor: colors.amber }]}
            >
              <Text style={styles.btnTextWhite}>Get Started →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================== */}
        {/* SCREEN 2: VALUE PROPOSITION                                    */}
        {/* ============================================================== */}
        {currentStep === 2 && (
          <View style={styles.screenWrapper}>
            <View style={styles.headingBox}>
              <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                Your Personal Gym Coach
              </Text>
              <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Bruno plans, adapts and evolves your training so you can just show up and lift.
              </Text>
            </View>

            {/* Animated Mascot Flexing */}
            <View style={styles.flexMascotBox}>
              <BrunoMascotImage 
                pose="flex" 
                size={165} 
                animated={true}
                showSpeechBubble={true}
                customMessage="I calculate your progressive overload and switch machines when they're taken!" 
              />
            </View>

            {/* 3 Detailed Feature Cards */}
            <View style={styles.featureCardsCol}>
              <View style={[styles.featureRowCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                <View style={[styles.featureIconBadge, { backgroundColor: colors.amberLight }]}>
                  <Dumbbell size={20} color={colors.amber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.featureCardTitle, { color: colors.textPrimary }]}>Personalized programs</Text>
                  <Text style={[styles.featureCardDesc, { color: colors.textSecondary }]}>for your goals and equipment</Text>
                </View>
              </View>

              <View style={[styles.featureRowCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                <View style={[styles.featureIconBadge, { backgroundColor: colors.amberLight }]}>
                  <RotateCw size={20} color={colors.amber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.featureCardTitle, { color: colors.textPrimary }]}>Smart exercise swaps</Text>
                  <Text style={[styles.featureCardDesc, { color: colors.textSecondary }]}>when machines are busy</Text>
                </View>
              </View>

              <View style={[styles.featureRowCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                <View style={[styles.featureIconBadge, { backgroundColor: colors.amberLight }]}>
                  <TrendingUp size={20} color={colors.amber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.featureCardTitle, { color: colors.textPrimary }]}>Automatic progressive</Text>
                  <Text style={[styles.featureCardDesc, { color: colors.textSecondary }]}>overload and deloads</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              activeOpacity={0.88}
              onPress={nextStep}
              style={[styles.primaryTerracottaBtn, { backgroundColor: colors.amber }]}
            >
              <Text style={styles.btnTextWhite}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================== */}
        {/* SCREEN 3: GOAL SELECTION                                       */}
        {/* ============================================================== */}
        {currentStep === 3 && (
          <View style={styles.screenWrapper}>
            <View style={styles.headingBox}>
              <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                What's your main goal?
              </Text>
              <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Bruno will tailor your program accordingly.
              </Text>
            </View>

            <View style={styles.optionsList}>
              {[
                { id: 'strength', title: 'Build Strength', desc: 'Get stronger and lift heavier', icon: '🏋️' },
                { id: 'muscle', title: 'Build Muscle', desc: 'Gain size and improve physique', icon: '💪' },
                { id: 'fitness', title: 'General Fitness', desc: 'Be healthier and more active', icon: '🏃' },
                { id: 'recomp', title: 'Recomposition', desc: 'Lose fat and build muscle', icon: '🔥' },
              ].map(opt => {
                const isSelected = goal === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setGoal(opt.id as any)}
                    style={[
                      styles.selectableRowCard,
                      { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                      isSelected && { borderColor: colors.amber, backgroundColor: colors.amberLight }
                    ]}
                    activeOpacity={0.85}
                  >
                    <Text style={{ fontSize: 26, marginRight: 12 }}>{opt.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionTitleText, { color: colors.textPrimary }]}>{opt.title}</Text>
                      <Text style={[styles.optionDescText, { color: colors.textSecondary }]}>{opt.desc}</Text>
                    </View>
                    <View style={[
                      styles.radioCircle,
                      { borderColor: colors.borderStrong },
                      isSelected && { borderColor: colors.amber, backgroundColor: colors.amber }
                    ]}>
                      {isSelected && <View style={styles.radioInnerWhite} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity 
              activeOpacity={0.88}
              onPress={nextStep}
              style={[styles.primaryTerracottaBtn, { backgroundColor: colors.amber }]}
            >
              <Text style={styles.btnTextWhite}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================== */}
        {/* SCREEN 4: TRAINING EXPERIENCE                                  */}
        {/* ============================================================== */}
        {currentStep === 4 && (
          <View style={styles.screenWrapper}>
            <View style={styles.headingBox}>
              <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                What's your training experience?
              </Text>
              <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                This helps Bruno set the right starting point.
              </Text>
            </View>

            <View style={styles.optionsList}>
              {[
                { id: 'beginner', title: 'Beginner', desc: '< 6 months\nNew to structured training', icon: '🎒' },
                { id: 'intermediate', title: 'Intermediate', desc: '6 months – 3 years\nSome experience, consistent training', icon: '📊' },
                { id: 'advanced', title: 'Advanced', desc: '3+ years\nExperienced with strength training', icon: '🏆' },
              ].map(opt => {
                const isSelected = experience === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setExperience(opt.id as any)}
                    style={[
                      styles.selectableRowCard,
                      { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                      isSelected && { borderColor: colors.amber, backgroundColor: colors.amberLight }
                    ]}
                    activeOpacity={0.85}
                  >
                    <Text style={{ fontSize: 26, marginRight: 14 }}>{opt.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionTitleText, { color: colors.textPrimary }]}>{opt.title}</Text>
                      <Text style={[styles.optionDescText, { color: colors.textSecondary }]}>{opt.desc}</Text>
                    </View>
                    <View style={[
                      styles.radioCircle,
                      { borderColor: colors.borderStrong },
                      isSelected && { borderColor: colors.amber, backgroundColor: colors.amber }
                    ]}>
                      {isSelected && <View style={styles.radioInnerWhite} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity 
              activeOpacity={0.88}
              onPress={nextStep}
              style={[styles.primaryTerracottaBtn, { backgroundColor: colors.amber }]}
            >
              <Text style={styles.btnTextWhite}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================== */}
        {/* SCREEN 5: FREQUENCY & DURATION                                 */}
        {/* ============================================================== */}
        {currentStep === 5 && (
          <View style={styles.screenWrapper}>
            <View style={styles.headingBox}>
              <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                How often do you want to train?
              </Text>
            </View>

            {/* Frequency Options */}
            <View style={styles.optionsList}>
              {[
                { days: 3, label: '3 days per week', sub: 'Full body' },
                { days: 4, label: '4 days per week', sub: 'Upper / Lower' },
                { days: 5, label: '5 days per week', sub: 'Push Pull Legs' },
                { days: 6, label: '6 days per week', sub: 'Push Pull Legs (advanced)' },
              ].map(item => {
                const isSelected = daysPerWeek === item.days;
                return (
                  <TouchableOpacity
                    key={item.days}
                    onPress={() => setDaysPerWeek(item.days as any)}
                    style={[
                      styles.selectableRowCardCompact,
                      { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                      isSelected && { borderColor: colors.amber, backgroundColor: colors.amberLight }
                    ]}
                    activeOpacity={0.85}
                  >
                    <Calendar size={18} color={isSelected ? colors.amber : colors.textMuted} style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionTitleText, { color: colors.textPrimary }]}>{item.label}</Text>
                      <Text style={[styles.optionDescText, { color: colors.textSecondary }]}>{item.sub}</Text>
                    </View>
                    <View style={[
                      styles.radioCircle,
                      { borderColor: colors.borderStrong },
                      isSelected && { borderColor: colors.amber, backgroundColor: colors.amber }
                    ]}>
                      {isSelected && <View style={styles.radioInnerWhite} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Session Duration Selector */}
            <View style={{ marginTop: 18, marginBottom: 20 }}>
              <Text style={[styles.sectionHeadingSmall, { color: colors.textPrimary }]}>
                Preferred session duration
              </Text>
              <View style={styles.durationRow}>
                {[30, 45, 60].map(mins => {
                  const isSelected = durationMinutes === mins;
                  return (
                    <TouchableOpacity
                      key={mins}
                      onPress={() => setDurationMinutes(mins as any)}
                      style={[
                        styles.durationPill,
                        { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                        isSelected && { backgroundColor: colors.amber, borderColor: colors.amberDark }
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.durationPillText,
                        { color: colors.textPrimary },
                        isSelected && { color: colors.textInverted, fontWeight: '900' }
                      ]}>
                        {mins} min
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity 
              activeOpacity={0.88}
              onPress={nextStep}
              style={[styles.primaryTerracottaBtn, { backgroundColor: colors.amber }]}
            >
              <Text style={styles.btnTextWhite}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================== */}
        {/* SCREEN 6: YOU'RE ALL SET!                                      */}
        {/* ============================================================== */}
        {currentStep === 6 && (
          <View style={styles.screenWrapperCenter}>
            <Text style={[styles.stepTitleCenter, { color: colors.textPrimary }]}>
              You're all set!
            </Text>
            <Text style={[styles.stepSubtitleCenter, { color: colors.textSecondary }]}>
              Bruno is ready to build your personalized program.
            </Text>

            {/* Celebratory Bruno with Thumbs Up & Confetti */}
            <View style={styles.centerMascotBox}>
              <BrunoMascotImage 
                pose="thumbs_up" 
                size={175} 
                animated={true}
                showSpeechBubble={true}
                customMessage="You're all set! Let's get stronger together!" 
              />
            </View>

            {/* Coach Speech Card */}
            <View style={[styles.coachSpeechCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
              <Text style={[styles.speechHeader, { color: colors.textPrimary }]}>
                Let's get stronger together!
              </Text>
              <Text style={[styles.speechBody, { color: colors.textSecondary }]}>
                I'll create your program based on your goals, equipment and schedule.
              </Text>
            </View>

            <TouchableOpacity 
              activeOpacity={0.88}
              onPress={nextStep}
              style={[styles.primaryTerracottaBtn, { backgroundColor: colors.amber, width: '100%', marginTop: 20 }]}
            >
              <Text style={styles.btnTextWhite}>Start Setting Up →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================== */}
        {/* SCREEN 7: GYM EQUIPMENT SETUP (Step 2/5)                       */}
        {/* ============================================================== */}
        {currentStep === 7 && (
          <View style={styles.screenWrapper}>
            <View style={styles.stepHeaderRow}>
              <Text style={[styles.stepBreadcrumb, { color: colors.textMuted }]}>2/5</Text>
            </View>

            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              Set up your gym environment
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Tell Bruno what equipment you have access to. You can save multiple gyms later.
            </Text>

            {/* Gym Name Input */}
            <View style={[styles.inputBox, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
              <Building2 size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Gym Name</Text>
                <TextInput
                  value={gymName}
                  onChangeText={setGymName}
                  style={[styles.inputText, { color: colors.textPrimary }]}
                  placeholder="My Commercial Gym"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Available Equipment Grid */}
            <Text style={[styles.sectionHeadingSmall, { color: colors.textPrimary, marginTop: 14 }]}>
              Available Equipment
            </Text>

            <View style={styles.equipmentGrid}>
              {[
                { key: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
                { key: 'barbell', label: 'Barbell & Squat Rack', icon: '⛓️' },
                { key: 'cables', label: 'Cable Machine', icon: '⚙️' },
                { key: 'smith', label: 'Smith Machine', icon: '🏗️' },
                { key: 'pullup', label: 'Pull-up Bar', icon: '🤸' },
                { key: 'other', label: 'Other Machines', icon: '🪑' },
              ].map(item => {
                const isChecked = equipment[item.key];
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => toggleEquipment(item.key)}
                    style={[
                      styles.equipmentCard,
                      { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                      isChecked && { borderColor: colors.amber, backgroundColor: colors.amberLight }
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={styles.equipmentTopRow}>
                      <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                      <View style={[
                        styles.checkboxSmall,
                        { borderColor: colors.borderStrong },
                        isChecked && { backgroundColor: colors.amber, borderColor: colors.amber }
                      ]}>
                        {isChecked && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                    </View>
                    <Text style={[styles.equipmentLabel, { color: colors.textPrimary }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Max Dumbbell Weight Input */}
            <View style={[styles.maxDbCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.maxDbTitle, { color: colors.textPrimary }]}>Max Dumbbell Weight</Text>
                <Text style={[styles.maxDbSub, { color: colors.textSecondary }]}>What's the heaviest dumbbell available at this gym?</Text>
              </View>
              <View style={[styles.dbValueBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
                <TextInput
                  value={String(maxDumbbellWeight)}
                  onChangeText={(val) => setMaxDumbbellWeight(Number(val) || 0)}
                  keyboardType="numeric"
                  style={[styles.dbInput, { color: colors.textPrimary }]}
                />
                <Text style={[styles.dbUnit, { color: colors.textSecondary }]}>kg</Text>
              </View>
            </View>

            <TouchableOpacity 
              activeOpacity={0.88}
              onPress={nextStep}
              style={[styles.primaryTerracottaBtn, { backgroundColor: colors.amber }]}
            >
              <Text style={styles.btnTextWhite}>Continue →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================== */}
        {/* SCREEN 8: PHYSICAL PROFILE & RESTRICTIONS (Step 3/5)          */}
        {/* ============================================================== */}
        {currentStep === 8 && (
          <View style={styles.screenWrapper}>
            <View style={styles.stepHeaderRow}>
              <Text style={[styles.stepBreadcrumb, { color: colors.textMuted }]}>3/5</Text>
            </View>

            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              Your profile & training preferences
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Help Bruno tailor your program to your body, schedule and any movement restrictions.
            </Text>

            {/* Summary Preferences */}
            <View style={[styles.prefSummaryCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
              {/* Training Experience */}
              <View style={styles.prefSection}>
                <Text style={[styles.prefLabel, { color: colors.textPrimary }]}>Training Experience</Text>
                <View style={styles.segmentedRow}>
                  {['beginner', 'intermediate', 'advanced'].map(lvl => (
                    <TouchableOpacity
                      key={lvl}
                      onPress={() => setExperience(lvl as any)}
                      style={[
                        styles.segmentBtn,
                        { borderColor: colors.border, backgroundColor: colors.surfaceSubtle },
                        experience === lvl && { borderColor: colors.amber, backgroundColor: colors.amberLight }
                      ]}
                    >
                      <Text style={[
                        styles.segmentText,
                        { color: colors.textSecondary },
                        experience === lvl && { color: colors.amberDark, fontWeight: '800' }
                      ]}>
                        {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Movement Restrictions / Injuries */}
              <View style={{ marginTop: 14 }}>
                <Text style={[styles.prefLabel, { color: colors.textPrimary }]}>Movement Restrictions / Injuries</Text>
                <Text style={[styles.prefSub, { color: colors.textSecondary }]}>
                  Select any areas you want to avoid or modify. Bruno will choose safer alternatives.
                </Text>

                <View style={styles.injuryChipsRow}>
                  {[
                    { id: 'lower_back' as JointContraindication, label: 'Lower back sensitivity' },
                    { id: 'shoulder' as JointContraindication, label: 'Shoulder impingement' },
                    { id: 'knee' as JointContraindication, label: 'Knee pain' },
                    { id: 'elbow' as JointContraindication, label: 'Elbow pain' },
                  ].map(item => {
                    const isChecked = injuries.includes(item.id);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => toggleInjury(item.id)}
                        style={[
                          styles.injuryChip,
                          { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
                          isChecked && { backgroundColor: colors.amberLight, borderColor: colors.amber }
                        ]}
                      >
                        <View style={[
                          styles.chipCheckbox,
                          { borderColor: colors.borderStrong },
                          isChecked && { backgroundColor: colors.amber, borderColor: colors.amber }
                        ]}>
                          {isChecked && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
                        </View>
                        <Text style={[
                          styles.injuryChipText,
                          { color: colors.textPrimary },
                          isChecked && { color: colors.amberDark, fontWeight: '800' }
                        ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            <TouchableOpacity 
              activeOpacity={0.88}
              onPress={handleFinalComplete}
              style={[styles.primaryTerracottaBtn, { backgroundColor: colors.amber, marginTop: 14 }]}
            >
              <Text style={styles.btnTextWhite}>Continue →</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepDot: {
    width: 22,
    height: 4,
    borderRadius: 2,
  },
  skipButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  screenWrapper: {
    flex: 1,
  },
  screenWrapperCenter: {
    flex: 1,
    alignItems: 'center',
  },
  splashTitleBox: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  splashBrand: {
    fontSize: 38,
    fontWeight: '900',
    color: '#D9572B',
    letterSpacing: 2,
  },
  splashSubBrand: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6B6055',
    letterSpacing: 2,
    marginTop: -2,
  },
  splashMascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  splashTextContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  mainHeroTitle: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  mainHeroSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
    paddingHorizontal: 12,
  },
  pillarsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  pillarItem: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pillarLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
  },
  primaryTerracottaBtn: {
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D9572B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  btnTextWhite: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  headingBox: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  stepSubtitle: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
  },
  stepTitleCenter: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  stepSubtitleCenter: {
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  flexMascotBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  centerMascotBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
  },
  featureCardsCol: {
    gap: 10,
    marginBottom: 24,
  },
  featureRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  featureIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCardTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  featureCardDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  optionsList: {
    gap: 10,
    marginBottom: 24,
  },
  selectableRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  selectableRowCardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  optionTitleText: {
    fontSize: 14,
    fontWeight: '800',
  },
  optionDescText: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerWhite: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  sectionHeadingSmall: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 10,
  },
  durationPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  coachSpeechCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  speechHeader: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  speechBody: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  stepBreadcrumb: {
    fontSize: 11,
    fontWeight: '800',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  inputText: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  equipmentCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
  },
  equipmentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxSmall: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipmentLabel: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  maxDbCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 14,
  },
  maxDbTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  maxDbSub: {
    fontSize: 10,
    marginTop: 2,
    maxWidth: 200,
  },
  dbValueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  dbInput: {
    fontSize: 15,
    fontWeight: '900',
    marginRight: 4,
  },
  dbUnit: {
    fontSize: 12,
    fontWeight: '700',
  },
  prefSummaryCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
  },
  prefSection: {
    marginBottom: 12,
  },
  prefLabel: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  prefSub: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 8,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 6,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '700',
  },
  injuryChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  injuryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipCheckbox: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  injuryChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
