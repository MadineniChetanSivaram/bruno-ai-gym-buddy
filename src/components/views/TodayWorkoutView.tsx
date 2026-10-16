// src/components/views/TodayWorkoutView.tsx
// Today's Workout View with Impeccable Bento UI, Micro-interactions & 1-Tap Machine Swaps

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Animated 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Sparkles, RefreshCw, CheckCircle2, Circle, Flame, Clock, Layers } from 'lucide-react-native';
import { useBruno } from '../../context/BrunoContext';
import { BrunoMascot } from '../mascot/BrunoMascot';
import { BrunoEngine } from '../../services/brunoEngine';
import { PostWorkoutLogModal } from '../modals/PostWorkoutLogModal';
import { MachineSwapModal } from '../modals/MachineSwapModal';
import { TactileButton } from '../common/TactileButton';

export const TodayWorkoutView: React.FC = () => {
  const { 
    profile, 
    activeGym, 
    todaySession, 
    mascotState, 
    openSwapModal,
    setActiveTab,
    colors,
  } = useBruno();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);

  if (!todaySession) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={{ fontSize: 44, marginBottom: 12 }}>🐻💤</Text>
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Rest & Recovery Day</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Bruno says: "Muscle fibers rebuild outside the gym. Drink your water, hit your protein goals, and let connective tissues recover."
        </Text>
      </View>
    );
  }

  const toggleExerciseCheck = (exerciseId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}

    if (completedExerciseIds.includes(exerciseId)) {
      setCompletedExerciseIds(completedExerciseIds.filter(id => id !== exerciseId));
    } else {
      setCompletedExerciseIds([...completedExerciseIds, exerciseId]);
    }
  };

  const preSessionNote = BrunoEngine.getPreSessionBriefing(todaySession, profile);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >

        {/* Animated Bruno Chalk Briefing */}
        <BrunoMascot 
          state={mascotState} 
          message={preSessionNote}
          size="md"
        />

        {/* Bento Session Header Card */}
        <View 
          style={[
            styles.sessionHeaderCard, 
            { 
              backgroundColor: colors.surfaceCard, 
              borderColor: colors.border,
              shadowColor: colors.cardShadow,
            }
          ]}
        >
          <View style={styles.sessionMetaRow}>
            <View style={[styles.weekBadge, { backgroundColor: colors.infoBg, borderColor: colors.info }]}>
              <Text style={[styles.weekBadgeText, { color: colors.info }]}>
                BLOCK 1 • WEEK {todaySession.weekNumber}
              </Text>
            </View>

            <TouchableOpacity 
              onPress={() => setActiveTab('profile')} 
              style={[styles.gymTag, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.gymTagText, { color: colors.amber }]}>
                🏛️ {activeGym.name} ▾
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sessionTitle, { color: colors.textPrimary }]}>
            {todaySession.splitName}
          </Text>

          {/* Quick Stats Bento Row */}
          <View style={styles.statsRow}>
            <View style={[styles.statChip, { backgroundColor: colors.surfaceSubtle }]}>
              <Clock size={13} color={colors.amber} />
              <Text style={[styles.statChipText, { color: colors.textSecondary }]}>
                {todaySession.estimatedDurationMin} Mins
              </Text>
            </View>

            <View style={[styles.statChip, { backgroundColor: colors.surfaceSubtle }]}>
              <Layers size={13} color={colors.info} />
              <Text style={[styles.statChipText, { color: colors.textSecondary }]}>
                {todaySession.exercises.length} Exercises
              </Text>
            </View>

            <View style={[styles.statChip, { backgroundColor: colors.surfaceSubtle }]}>
              <Flame size={13} color={colors.success} />
              <Text style={[styles.statChipText, { color: colors.textSecondary }]}>
                RPE 8.0 Target
              </Text>
            </View>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionTitleRow}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Prescribed Targets
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
              Pre-calculated weights & sets • 1-tap machine swap if busy
            </Text>
          </View>
        </View>

        {/* Prescribed Exercises Cards */}
        <View style={styles.exerciseList}>
          {todaySession.exercises.map((exercise, index) => {
            const isChecked = completedExerciseIds.includes(exercise.id);

            return (
              <View 
                key={exercise.id} 
                style={[
                  styles.exerciseCard,
                  { 
                    backgroundColor: colors.surfaceCard, 
                    borderColor: isChecked ? colors.success : colors.border,
                    shadowColor: colors.cardShadow,
                  },
                  isChecked && { backgroundColor: colors.successBg }
                ]}
              >
                
                {/* Exercise Header Row */}
                <View style={styles.exerciseCardHeader}>
                  <TouchableOpacity 
                    onPress={() => toggleExerciseCheck(exercise.id)}
                    style={styles.checkCircleBtn}
                    activeOpacity={0.7}
                  >
                    {isChecked ? (
                      <CheckCircle2 size={24} color={colors.success} fill={colors.successBg} />
                    ) : (
                      <Circle size={24} color={colors.borderStrong} />
                    )}
                  </TouchableOpacity>

                  <View style={{ flex: 1, paddingRight: 6 }}>
                    <Text 
                      style={[
                        styles.exerciseName, 
                        { color: colors.textPrimary },
                        isChecked && styles.strikethroughText
                      ]}
                      numberOfLines={1}
                    >
                      {exercise.name}
                    </Text>
                    <Text style={[styles.exerciseMuscle, { color: colors.textMuted }]}>
                      {exercise.primaryMuscle.toUpperCase()} • {exercise.movementPattern.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>

                  {/* 1-Tap Machine Busy Swap Button */}
                  <TouchableOpacity 
                    activeOpacity={0.75}
                    onPress={() => openSwapModal(exercise)}
                    style={[styles.machineBusyBtn, { backgroundColor: colors.amberGlow, borderColor: colors.amber }]}
                  >
                    <RefreshCw size={12} color={colors.amber} />
                    <Text style={[styles.machineBusyText, { color: colors.amber }]}>Busy?</Text>
                  </TouchableOpacity>
                </View>

                {/* Targets Bento Row */}
                <View style={[styles.targetsRow, { backgroundColor: colors.surfaceSubtle }]}>
                  <View style={styles.targetPill}>
                    <Text style={[styles.targetPillLabel, { color: colors.textMuted }]}>SETS</Text>
                    <Text style={[styles.targetPillValue, { color: colors.textPrimary }]}>
                      {exercise.targetSets}
                    </Text>
                  </View>

                  <View style={styles.targetDivider} />

                  <View style={styles.targetPill}>
                    <Text style={[styles.targetPillLabel, { color: colors.textMuted }]}>REPS</Text>
                    <Text style={[styles.targetPillValue, { color: colors.textPrimary }]}>
                      {exercise.targetReps}
                    </Text>
                  </View>

                  <View style={styles.targetDivider} />

                  <View style={styles.targetPill}>
                    <Text style={[styles.targetPillLabel, { color: colors.textMuted }]}>LOAD</Text>
                    <Text style={[styles.targetPillValueWeight, { color: colors.amber }]}>
                      {exercise.targetWeightKg} {profile.unit}
                    </Text>
                  </View>

                  <View style={styles.targetDivider} />

                  <View style={styles.targetPill}>
                    <Text style={[styles.targetPillLabel, { color: colors.textMuted }]}>TARGET RPE</Text>
                    <Text style={[styles.targetPillValue, { color: colors.textPrimary }]}>
                      @{exercise.targetRpe}
                    </Text>
                  </View>
                </View>

                {/* Overload Rule & Biomechanical Cue */}
                <View style={styles.bottomMetaRow}>
                  <View style={[styles.cueBox, { backgroundColor: colors.chalkNoteBg, borderColor: colors.chalkBorder }]}>
                    <Text style={[styles.cueText, { color: colors.textSecondary }]}>
                      💡 {exercise.cueNote}
                    </Text>
                  </View>

                  <View style={styles.overloadTag}>
                    <Sparkles size={11} color={colors.success} />
                    <Text style={[styles.overloadTagText, { color: colors.success }]}>
                      +2.5 kg next block if reps hit
                    </Text>
                  </View>
                </View>

              </View>
            );
          })}
        </View>

        {/* 30-Second Fast Log CTA */}
        <View style={styles.ctaWrapper}>
          <TactileButton
            onPress={() => setIsLogModalOpen(true)}
            size="lg"
            variant="primary"
            style={styles.logButton}
          >
            <View style={styles.ctaContent}>
              <View style={styles.ctaLeft}>
                <Text style={[styles.ctaEmoji]}>⚡</Text>
                <View>
                  <Text style={[styles.ctaTitle, { color: colors.textInverted }]}>
                    Log Workout (30s Frictionless)
                  </Text>
                  <Text style={[styles.ctaSub, { color: colors.textInverted }]}>
                    1-click target confirmation & auto-overload calculation
                  </Text>
                </View>
              </View>
              <Text style={[styles.ctaArrow, { color: colors.textInverted }]}>→</Text>
            </View>
          </TactileButton>
        </View>

      </ScrollView>

      {/* 30-Second Post-Workout Logging Modal */}
      <PostWorkoutLogModal 
        visible={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />

      {/* 1-Tap Machine Busy Swap Modal */}
      <MachineSwapModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120, // ample space for floating tab bar
  },
  sessionHeaderCard: {
    borderRadius: 24,
    borderWidth: 1.2,
    padding: 18,
    marginTop: 8,
    marginBottom: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  sessionMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weekBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  weekBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  gymTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  gymTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sessionTitle: {
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitleRow: {
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  exerciseList: {
    gap: 12,
  },
  exerciseCard: {
    borderRadius: 22,
    borderWidth: 1.2,
    padding: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkCircleBtn: {
    marginRight: 10,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  strikethroughText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  exerciseMuscle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginTop: 2,
  },
  machineBusyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  machineBusyText: {
    fontSize: 11,
    fontWeight: '800',
  },
  targetsRow: {
    flexDirection: 'row',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  targetPill: {
    alignItems: 'center',
    flex: 1,
  },
  targetPillLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  targetPillValue: {
    fontSize: 13,
    fontWeight: '900',
  },
  targetPillValueWeight: {
    fontSize: 14,
    fontWeight: '900',
  },
  targetDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
  },
  bottomMetaRow: {
    gap: 6,
  },
  cueBox: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  cueText: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15,
  },
  overloadTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingLeft: 2,
    marginTop: 2,
  },
  overloadTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  ctaWrapper: {
    marginTop: 18,
  },
  logButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 22,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  ctaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  ctaEmoji: {
    fontSize: 24,
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  ctaSub: {
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.85,
    marginTop: 1,
  },
  ctaArrow: {
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 8,
  },
});
