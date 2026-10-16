// src/components/views/TodayWorkoutView.tsx
// Screen 10: Push Day Workout Plan View with Segmented Tabs [Workout | Program | Notes],
// Numbered Exercise Rows, Tactile Set Tracking, and "Machine Busy? Get Alternatives"

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Image,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Clock, 
  Layers, 
  Zap, 
  Check, 
  Info,
  CalendarRange,
  ArrowRight,
  ShieldCheck
} from 'lucide-react-native';
import { useBruno } from '../../context/BrunoContext';
import { BrunoEngine } from '../../services/brunoEngine';
import { PostWorkoutLogModal } from '../modals/PostWorkoutLogModal';
import { PrescribedExercise } from '../../types';

type SegmentTab = 'workout' | 'program' | 'notes';

export const TodayWorkoutView: React.FC = () => {
  const { 
    profile, 
    activeGym, 
    todaySession, 
    openSwapModal,
    colors,
  } = useBruno();

  const [activeSegment, setActiveSegment] = useState<SegmentTab>('workout');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [completedSets, setCompletedSets] = useState<{ [exerciseId: string]: number[] }>({
    'ex_db_bench': [1, 2], // sample completed sets
  });

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

  const toggleSetCheck = (exerciseId: string, setIndex: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}

    const existingSets = completedSets[exerciseId] || [];
    const updatedSets = existingSets.includes(setIndex)
      ? existingSets.filter(s => s !== setIndex)
      : [...existingSets, setIndex];

    setCompletedSets({
      ...completedSets,
      [exerciseId]: updatedSets,
    });
  };

  const handleSegmentChange = (tab: SegmentTab) => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    setActiveSegment(tab);
  };

  // Sample machine busy swap trigger
  const handleOpenGeneralSwap = () => {
    if (todaySession.exercises.length > 0) {
      openSwapModal(todaySession.exercises[0]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header Breadcrumb */}
      <View style={[styles.headerContainer, { backgroundColor: colors.surfaceCard, borderBottomColor: colors.border }]}>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>
            {todaySession.splitName || 'Push Day'}
          </Text>
          <View style={[styles.dayBadge, { backgroundColor: colors.amberGlow }]}>
            <Text style={[styles.dayBadgeText, { color: colors.amber }]}>
              Week {todaySession.weekNumber} • Day 1
            </Text>
          </View>
        </View>

        {/* Segmented Control [Workout | Program | Notes] */}
        <View style={[styles.segmentContainer, { backgroundColor: colors.surfaceSubtle }]}>
          {(['workout', 'program', 'notes'] as SegmentTab[]).map((tab) => {
            const isActive = activeSegment === tab;
            const labels: Record<SegmentTab, string> = {
              workout: 'Workout',
              program: 'Program',
              notes: 'Notes',
            };

            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.segmentButton,
                  isActive && [styles.activeSegmentButton, { backgroundColor: colors.amber }]
                ]}
                onPress={() => handleSegmentChange(tab)}
                activeOpacity={0.8}
              >
                <Text 
                  style={[
                    styles.segmentText, 
                    { color: colors.textSecondary },
                    isActive && styles.activeSegmentText
                  ]}
                >
                  {labels[tab]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* TAB 1: WORKOUT EXECUTION */}
        {activeSegment === 'workout' && (
          <View>
            {/* Session Summary Pill Row */}
            <View style={styles.metaRow}>
              <View style={[styles.metaChip, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                <Clock size={12} color={colors.amber} />
                <Text style={[styles.metaChipText, { color: colors.textSecondary }]}>
                  {todaySession.estimatedDurationMin || 45} mins
                </Text>
              </View>

              <View style={[styles.metaChip, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                <Layers size={12} color={colors.amber} />
                <Text style={[styles.metaChipText, { color: colors.textSecondary }]}>
                  {todaySession.exercises.length} exercises
                </Text>
              </View>

              <View style={[styles.metaChip, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                <Flame size={12} color={colors.amber} />
                <Text style={[styles.metaChipText, { color: colors.textSecondary }]}>
                  RPE 8.0 Target
                </Text>
              </View>
            </View>

            {/* Exercise List */}
            <View style={styles.exerciseList}>
              {todaySession.exercises.map((exercise, index) => {
                const isChecked = completedExerciseIds.includes(exercise.id);
                const currentCompletedSets = completedSets[exercise.id] || [];
                const allSetsCompleted = currentCompletedSets.length >= exercise.targetSets;

                return (
                  <View 
                    key={exercise.id} 
                    style={[
                      styles.exerciseCard,
                      { 
                        backgroundColor: colors.surfaceCard, 
                        borderColor: isChecked || allSetsCompleted ? '#10B981' : colors.border,
                        shadowColor: colors.cardShadow,
                      },
                      (isChecked || allSetsCompleted) && { borderColor: '#10B981' }
                    ]}
                  >
                    {/* Top Row: Number Badge, Name, Swap Button */}
                    <View style={styles.exerciseTopRow}>
                      <View style={[styles.indexBadge, { backgroundColor: colors.amber }]}>
                        <Text style={styles.indexBadgeText}>{index + 1}</Text>
                      </View>

                      <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <Text style={[styles.exerciseName, { color: colors.textPrimary }]}>
                          {exercise.name}
                        </Text>
                        <Text style={[styles.equipmentTag, { color: colors.textSecondary }]}>
                          {exercise.primaryMuscle.toUpperCase()} • {exercise.targetReps} REPS
                        </Text>
                      </View>

                      {/* 1-Tap Alternative Swap Trigger */}
                      <TouchableOpacity
                        style={[styles.swapBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
                        onPress={() => openSwapModal(exercise)}
                        activeOpacity={0.7}
                      >
                        <RefreshCw size={13} color={colors.amber} />
                        <Text style={[styles.swapBtnText, { color: colors.amber }]}>Swap</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Target & Last Session Row */}
                    <View style={[styles.targetInfoBox, { backgroundColor: colors.surfaceSubtle }]}>
                      <View style={styles.targetCol}>
                        <Text style={[styles.targetLabel, { color: colors.textMuted }]}>TARGET</Text>
                        <Text style={[styles.targetVal, { color: colors.textPrimary }]}>
                          {exercise.targetSets} sets × {exercise.targetReps} @ {exercise.targetWeightKg} kg
                        </Text>
                      </View>

                      <View style={styles.targetColRight}>
                        <Text style={[styles.targetLabel, { color: colors.textMuted }]}>PROGRESSION</Text>
                        <View style={styles.bumpTag}>
                          <Sparkles size={11} color="#059669" />
                          <Text style={[styles.bumpText, { color: '#059669' }]}>+1.5 kg bump</Text>
                        </View>
                      </View>
                    </View>

                    {/* Interactive Sets Tracker */}
                    <View style={styles.setsContainer}>
                      <Text style={[styles.setsHeader, { color: colors.textMuted }]}>SETS</Text>
                      <View style={styles.setButtonsRow}>
                        {Array.from({ length: exercise.targetSets }).map((_, setIdx) => {
                          const isSetDone = currentCompletedSets.includes(setIdx);
                          return (
                            <TouchableOpacity
                              key={setIdx}
                              style={[
                                styles.setChip,
                                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
                                isSetDone && { backgroundColor: '#10B981', borderColor: '#10B981' }
                              ]}
                              onPress={() => toggleSetCheck(exercise.id, setIdx)}
                              activeOpacity={0.7}
                            >
                              <Text 
                                style={[
                                  styles.setChipText,
                                  { color: colors.textPrimary },
                                  isSetDone && { color: '#FFFFFF', fontWeight: '800' }
                                ]}
                              >
                                {isSetDone ? '✓ Set ' + (setIdx + 1) : 'Set ' + (setIdx + 1)}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* TAB 2: PROGRAM MESOCYCLE */}
        {activeSegment === 'program' && (
          <View style={styles.programTabContent}>
            <View 
              style={[
                styles.blockOverviewCard, 
                { backgroundColor: colors.surfaceCard, borderColor: colors.border, shadowColor: colors.cardShadow }
              ]}
            >
              <View style={styles.blockBadgeRow}>
                <CalendarRange size={14} color={colors.amber} />
                <Text style={[styles.blockBadgeTitle, { color: colors.amber }]}>6-WEEK MESOCYCLE</Text>
              </View>
              <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>
                Push / Pull / Legs Hypertrophy
              </Text>
              <Text style={[styles.blockDesc, { color: colors.textSecondary }]}>
                Systematic progressive overload across 4 training days per week. Week 6 features an auto-deload to shed connective tissue fatigue.
              </Text>

              <View style={styles.weekProgressContainer}>
                {[1, 2, 3, 4, 5, 6].map((wk) => (
                  <View 
                    key={wk}
                    style={[
                      styles.weekStep,
                      { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
                      wk === todaySession.weekNumber && { backgroundColor: colors.amber, borderColor: colors.amber },
                      wk < todaySession.weekNumber && { backgroundColor: '#10B981', borderColor: '#10B981' }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.weekStepText,
                        { color: colors.textSecondary },
                        (wk === todaySession.weekNumber || wk < todaySession.weekNumber) && { color: '#FFFFFF', fontWeight: '800' }
                      ]}
                    >
                      W{wk}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.volumeCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
              <Text style={[styles.volumeTitle, { color: colors.textPrimary }]}>Weekly Volume Allocation</Text>
              <Text style={[styles.volumeSubtitle, { color: colors.textSecondary }]}>Direct working sets per muscle group</Text>
              
              <View style={styles.volumeRow}>
                <Text style={[styles.volumeMuscle, { color: colors.textPrimary }]}>Chest (Pecs)</Text>
                <Text style={[styles.volumeVal, { color: colors.amber }]}>12 sets / week</Text>
              </View>
              <View style={styles.volumeRow}>
                <Text style={[styles.volumeMuscle, { color: colors.textPrimary }]}>Front & Lateral Delts</Text>
                <Text style={[styles.volumeVal, { color: colors.amber }]}>14 sets / week</Text>
              </View>
              <View style={styles.volumeRow}>
                <Text style={[styles.volumeMuscle, { color: colors.textPrimary }]}>Triceps</Text>
                <Text style={[styles.volumeVal, { color: colors.amber }]}>10 sets / week</Text>
              </View>
            </View>
          </View>
        )}

        {/* TAB 3: BRUNO'S COACHING NOTES */}
        {activeSegment === 'notes' && (
          <View style={styles.notesTabContent}>
            <View 
              style={[
                styles.noteCard, 
                { backgroundColor: colors.surfaceCard, borderColor: colors.border, shadowColor: colors.cardShadow }
              ]}
            >
              <View style={styles.noteHeader}>
                <Sparkles size={16} color={colors.amber} />
                <Text style={[styles.noteTitle, { color: colors.amber }]}>Chest Drive Form Cue</Text>
              </View>
              <Text style={[styles.noteBody, { color: colors.textPrimary }]}>
                Retract your scapulae and keep your feet planted firmly on the floor. Take 2 full seconds on the eccentric (lowering) phase to maximize mechanical tension on the chest fibers.
              </Text>
            </View>

            <View 
              style={[
                styles.noteCard, 
                { backgroundColor: colors.surfaceCard, borderColor: colors.border, shadowColor: colors.cardShadow }
              ]}
            >
              <View style={styles.noteHeader}>
                <ShieldCheck size={16} color="#059669" />
                <Text style={[styles.noteTitle, { color: '#059669' }]}>Joint Safety Angle</Text>
              </View>
              <Text style={[styles.noteBody, { color: colors.textPrimary }]}>
                Keep your elbows flared at roughly 45 to 60 degrees relative to your torso. Avoid 90-degree flare to eliminate subacromial shoulder impingement.
              </Text>
            </View>

            <View 
              style={[
                styles.noteCard, 
                { backgroundColor: colors.surfaceCard, borderColor: colors.border, shadowColor: colors.cardShadow }
              ]}
            >
              <View style={styles.noteHeader}>
                <Flame size={16} color={colors.amber} />
                <Text style={[styles.noteTitle, { color: colors.amber }]}>Double Progression Rule</Text>
              </View>
              <Text style={[styles.noteBody, { color: colors.textPrimary }]}>
                Hit the top of your prescribed rep range (10 reps) on all 3 working sets before increasing dumbbell weight by 1.5 to 2.5 kg. Quality reps over ego lifting!
              </Text>
            </View>
          </View>
        )}

        {/* Bottom Floating Machine Busy Bar & Log CTA */}
        <View style={styles.stickyActionsContainer}>
          {/* Machine Busy? Get Alternatives Button (Terracotta Pill) */}
          <TouchableOpacity
            style={[styles.busyMachineBtn, { backgroundColor: colors.amber }]}
            onPress={handleOpenGeneralSwap}
            activeOpacity={0.88}
          >
            <Zap size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.busyMachineBtnText}>Machine Busy? Get Alternatives</Text>
          </TouchableOpacity>

          {/* Quick 30s Log CTA */}
          <TouchableOpacity
            style={[styles.quickLogBtn, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}
            onPress={() => setIsLogModalOpen(true)}
            activeOpacity={0.85}
          >
            <Text style={[styles.quickLogBtnText, { color: colors.textPrimary }]}>
              Log Workout (30s)
            </Text>
            <ArrowRight size={16} color={colors.amber} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* 30-Second Post-Workout Logging Modal */}
      <PostWorkoutLogModal 
        visible={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
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
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1.2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  dayBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  activeSegmentButton: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  activeSegmentText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  exerciseList: {
    gap: 12,
    marginBottom: 16,
  },
  exerciseCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  indexBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  equipmentTag: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  swapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  swapBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  targetInfoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  targetCol: {
    flex: 1,
  },
  targetColRight: {
    alignItems: 'flex-end',
  },
  targetLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  targetVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  bumpTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  bumpText: {
    fontSize: 11,
    fontWeight: '800',
  },
  setsContainer: {
    marginTop: 2,
  },
  setsHeader: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  setButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  setChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  programTabContent: {
    gap: 14,
    marginBottom: 16,
  },
  blockOverviewCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 16,
  },
  blockBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  blockBadgeTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  blockTitle: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 6,
  },
  blockDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  weekProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekStep: {
    width: 44,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekStepText: {
    fontSize: 12,
    fontWeight: '700',
  },
  volumeCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 16,
  },
  volumeTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 2,
  },
  volumeSubtitle: {
    fontSize: 11,
    marginBottom: 12,
  },
  volumeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  volumeMuscle: {
    fontSize: 13,
    fontWeight: '600',
  },
  volumeVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  notesTabContent: {
    gap: 12,
    marginBottom: 16,
  },
  noteCard: {
    borderRadius: 16,
    borderWidth: 1.2,
    padding: 14,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  noteBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  stickyActionsContainer: {
    gap: 10,
    marginTop: 4,
  },
  busyMachineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#D9572B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  busyMachineBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  quickLogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.2,
    gap: 6,
  },
  quickLogBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
