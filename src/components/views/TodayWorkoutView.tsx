// src/components/views/TodayWorkoutView.tsx
// Today's Workout View with Bruno's Pre-Session Briefing & 1-Tap Machine Swaps

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { useBruno } from '../../context/BrunoContext';
import { BrunoMascot } from '../mascot/BrunoMascot';
import { BrunoEngine } from '../../services/brunoEngine';
import { PostWorkoutLogModal } from '../modals/PostWorkoutLogModal';
import { MachineSwapModal } from '../modals/MachineSwapModal';

export const TodayWorkoutView: React.FC = () => {
  const { 
    profile, 
    activeGym, 
    todaySession, 
    mascotState, 
    openSwapModal,
    setActiveTab 
  } = useBruno();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  if (!todaySession) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No workout scheduled. Rest and recover, lifter.</Text>
      </View>
    );
  }

  const preSessionNote = BrunoEngine.getPreSessionBriefing(todaySession, profile);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Top Mascot Briefing Box */}
        <BrunoMascot 
          state={mascotState} 
          message={preSessionNote}
          size="md"
        />

        {/* Workout Info Bar */}
        <View style={styles.sessionHeaderCard}>
          <View style={styles.sessionMetaRow}>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>WEEK {todaySession.weekNumber} • DAY {todaySession.dayNumber}</Text>
            </View>
            <TouchableOpacity onPress={() => setActiveTab('profile')} style={styles.gymTag}>
              <Text style={styles.gymTagText}>📍 {activeGym.name} ▾</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sessionTitle}>{todaySession.splitName}</Text>
          <View style={styles.sessionDetailsRow}>
            <Text style={styles.sessionDetailItem}>⏱️ ~{todaySession.estimatedDurationMin} Mins</Text>
            <Text style={styles.sessionDetailDot}>•</Text>
            <Text style={styles.sessionDetailItem}>🏋️ {todaySession.exercises.length} Exercises</Text>
            <Text style={styles.sessionDetailDot}>•</Text>
            <Text style={styles.sessionDetailItem}>🎯 RPE 8 Target</Text>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>PRESCRIBED EXERCISE TARGETS</Text>
          <Text style={styles.sectionSubtitle}>No mid-session logging needed</Text>
        </View>

        {/* Prescribed Exercises Cards */}
        <View style={styles.exerciseList}>
          {todaySession.exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              
              {/* Exercise Header */}
              <View style={styles.exerciseCardHeader}>
                <View style={styles.indexCircle}>
                  <Text style={styles.indexNumber}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseMuscle}>
                    {exercise.primaryMuscle.toUpperCase()} • {exercise.movementPattern.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>

                {/* 1-Tap Machine Busy Swap Button */}
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => openSwapModal(exercise)}
                  style={styles.machineBusyBtn}
                >
                  <Text style={styles.machineBusyText}>Busy? ⚡</Text>
                </TouchableOpacity>
              </View>

              {/* Targets Pill Bar */}
              <View style={styles.targetsRow}>
                <View style={styles.targetPill}>
                  <Text style={styles.targetPillLabel}>SETS</Text>
                  <Text style={styles.targetPillValue}>{exercise.targetSets}</Text>
                </View>
                <View style={styles.targetPill}>
                  <Text style={styles.targetPillLabel}>REPS</Text>
                  <Text style={styles.targetPillValue}>{exercise.targetReps}</Text>
                </View>
                <View style={[styles.targetPill, styles.targetPillWeight]}>
                  <Text style={styles.targetPillLabel}>LOAD</Text>
                  <Text style={styles.targetPillValueWeight}>
                    {exercise.targetWeightKg} {profile.unit}
                  </Text>
                </View>
                <View style={styles.targetPill}>
                  <Text style={styles.targetPillLabel}>INTENSITY</Text>
                  <Text style={styles.targetPillValue}>RPE {exercise.targetRpe}</Text>
                </View>
              </View>

              {/* Biomechanical Cue / Form Note */}
              <View style={styles.cueBox}>
                <Text style={styles.cueText}>💡 {exercise.cueNote}</Text>
              </View>

            </View>
          ))}
        </View>

        {/* Post-Workout Log CTA */}
        <TouchableOpacity 
          activeOpacity={0.85}
          onPress={() => setIsLogModalOpen(true)}
          style={styles.completeSessionBtn}
        >
          <View style={styles.completeBtnContent}>
            <Text style={styles.completeBtnEmoji}>⚡</Text>
            <View>
              <Text style={styles.completeBtnTitle}>Complete Workout (30s Log)</Text>
              <Text style={styles.completeBtnSub}>Lock reps & trigger automated weight overload</Text>
            </View>
          </View>
          <Text style={styles.completeBtnArrow}>→</Text>
        </TouchableOpacity>

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
    backgroundColor: '#090D16',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },
  sessionHeaderCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  sessionMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  weekBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  weekBadgeText: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gymTag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gymTagText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.4,
  },
  sessionDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  sessionDetailItem: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  sessionDetailDot: {
    color: '#475569',
    fontSize: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    fontSize: 10,
    color: '#475569',
  },
  exerciseList: {
    gap: 14,
    marginBottom: 24,
  },
  exerciseCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  indexCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexNumber: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '800',
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  exerciseMuscle: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '700',
  },
  machineBusyBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  machineBusyText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '800',
  },
  targetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  targetPill: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  targetPillWeight: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  targetPillLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  targetPillValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E2E8F0',
    marginTop: 1,
  },
  targetPillValueWeight: {
    fontSize: 13,
    fontWeight: '900',
    color: '#60A5FA',
    marginTop: 1,
  },
  cueBox: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 10,
  },
  cueText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  completeSessionBtn: {
    backgroundColor: '#059669',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  completeBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completeBtnEmoji: {
    fontSize: 26,
  },
  completeBtnTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  completeBtnSub: {
    fontSize: 11,
    color: '#D1FAE5',
    marginTop: 2,
  },
  completeBtnArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
