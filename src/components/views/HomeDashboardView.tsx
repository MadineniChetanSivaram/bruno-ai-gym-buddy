// src/components/views/HomeDashboardView.tsx
// Screen 9: Home Dashboard with Bruno Peeking Mascot, Today's Workout Card, This Week Pills, and Bento Stats

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { 
  ArrowRight, 
  Clock, 
  Dumbbell, 
  Flame, 
  Check, 
  TrendingUp, 
  Award, 
  Calendar 
} from 'lucide-react-native';
import { useBruno } from '../../context/BrunoContext';
import { BrunoMascotImage } from '../mascot/BrunoMascotImage';

interface HomeDashboardViewProps {
  onStartWorkout?: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({ onStartWorkout }) => {
  const { profile, todaySession, colors, setActiveTab } = useBruno();

  const handleStartWorkout = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
    if (onStartWorkout) {
      onStartWorkout();
    } else {
      setActiveTab('program');
    }
  };

  const weekDays = [
    { day: 'Mon', date: '20', label: 'Push', status: 'completed' },
    { day: 'Tue', date: '21', label: 'Pull', status: 'active' },
    { day: 'Wed', date: '22', label: 'Rest', status: 'rest' },
    { day: 'Thu', date: '23', label: 'Legs', status: 'upcoming' },
    { day: 'Fri', date: '24', label: 'Upper', status: 'upcoming' },
    { day: 'Sat', date: '25', label: 'Rest', status: 'rest' },
    { day: 'Sun', date: '26', label: 'Rest', status: 'rest' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Top Greeting Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greetingTitle, { color: colors.textPrimary }]}>
              Good morning, {profile.name ? profile.name.split(' ')[0] : 'Alex'}!
            </Text>
            <Text style={[styles.greetingSubtitle, { color: colors.textSecondary }]}>
              Let's crush today's workout
            </Text>
          </View>
        </View>

        {/* Animated 3D Bruno Coach Card ("Saying Hi!" & Moving) */}
        <View 
          style={[
            styles.mascotCard, 
            { 
              backgroundColor: colors.surfaceCard, 
              borderColor: colors.border,
              shadowColor: colors.cardShadow,
            }
          ]}
        >
          <View style={styles.mascotImageWrapper}>
            <BrunoMascotImage 
              pose="dashboard" 
              size={74} 
              animated={true} 
            />
          </View>

          <View style={styles.speechBubbleWrapper}>
            <View style={[styles.speechBubble, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
              <View style={styles.speechBubbleHeader}>
                <Text style={[styles.coachTag, { color: colors.amber }]}>BRUNO'S NOTE 👋</Text>
              </View>
              <Text style={[styles.speechBubbleText, { color: colors.textPrimary }]}>
                Hi Alex! Bumped you to 25 kg on dumbbell bench today! You got this, champion!
              </Text>
            </View>
          </View>
        </View>

        {/* Today's Workout Hero Card */}
        <View 
          style={[
            styles.workoutCard, 
            { 
              backgroundColor: colors.surfaceCard, 
              borderColor: colors.border,
              shadowColor: colors.cardShadow,
            }
          ]}
        >
          <View style={styles.workoutCardHeader}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={[styles.workoutTag, { backgroundColor: colors.amberGlow }]}>
                <Text style={[styles.workoutTagText, { color: colors.amber }]}>TODAY'S WORKOUT</Text>
              </View>
              <Text style={[styles.workoutTitle, { color: colors.textPrimary }]}>
                {todaySession?.splitCategory ? `${todaySession.splitCategory} Day` : (todaySession?.splitName || 'Push Day')}
              </Text>
              <Text style={[styles.workoutSubtitle, { color: colors.textSecondary }]}>
                Week {todaySession?.weekNumber || 2} • Day {todaySession?.dayNumber || 1}
              </Text>
            </View>

            {/* Muscle Diagram Asset */}
            <View style={[styles.diagramWrapper, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
              <Image 
                source={require('../../assets/mascot/muscle_diagram.png')} 
                style={styles.muscleDiagramImage} 
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Workout Metadata Pills */}
          <View style={styles.metaPillsRow}>
            <View style={[styles.metaPill, { backgroundColor: colors.surfaceSubtle }]}>
              <Clock size={13} color={colors.amber} />
              <Text style={[styles.metaPillText, { color: colors.textPrimary }]}>
                {todaySession?.estimatedDurationMin || 45} min
              </Text>
            </View>

            <View style={[styles.metaPill, { backgroundColor: colors.surfaceSubtle }]}>
              <Dumbbell size={13} color={colors.amber} />
              <Text style={[styles.metaPillText, { color: colors.textPrimary }]}>
                {todaySession?.exercises?.length || 6} exercises
              </Text>
            </View>

            <View style={[styles.metaPill, { backgroundColor: colors.surfaceSubtle }]}>
              <Flame size={13} color={colors.amber} />
              <Text style={[styles.metaPillText, { color: colors.textPrimary }]}>
                3 sets each
              </Text>
            </View>
          </View>

          {/* Terracotta Action Button */}
          <TouchableOpacity
            style={[styles.startWorkoutButton, { backgroundColor: colors.amber }]}
            onPress={handleStartWorkout}
            activeOpacity={0.88}
          >
            <Text style={styles.startWorkoutButtonText}>Start Workout</Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* This Week Calendar Row */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>This Week</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>April 2026</Text>
          </View>

          <View style={styles.weekCalendarRow}>
            {weekDays.map((item, index) => {
              const isCompleted = item.status === 'completed';
              const isActive = item.status === 'active';

              return (
                <View
                  key={index}
                  style={[
                    styles.dayPill,
                    { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                    isActive && { backgroundColor: colors.amber, borderColor: colors.amber },
                    isCompleted && { borderColor: '#10B981' }
                  ]}
                >
                  <Text 
                    style={[
                      styles.dayName, 
                      { color: colors.textSecondary },
                      isActive && { color: '#FFFFFF', fontWeight: '800' }
                    ]}
                  >
                    {item.day}
                  </Text>

                  <Text 
                    style={[
                      styles.dayDate, 
                      { color: colors.textPrimary },
                      isActive && { color: '#FFFFFF', fontWeight: '900' }
                    ]}
                  >
                    {item.date}
                  </Text>

                  {isCompleted ? (
                    <View style={styles.completedBadge}>
                      <Check size={10} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  ) : (
                    <Text 
                      style={[
                        styles.daySplitLabel, 
                        { color: colors.textMuted },
                        isActive && { color: '#FFFFFF' }
                      ]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Progress Highlights Bento Cards */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 12 }]}>
            Progress Highlights
          </Text>

          <View style={styles.bentoGrid}>
            {/* Stat Card 1: Volume */}
            <View 
              style={[
                styles.bentoCard, 
                { 
                  backgroundColor: colors.surfaceCard, 
                  borderColor: colors.border,
                  shadowColor: colors.cardShadow,
                }
              ]}
            >
              <View style={styles.bentoCardTop}>
                <TrendingUp size={16} color={colors.amber} />
                <View style={[styles.badgePill, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.badgeText, { color: '#059669' }]}>+8%</Text>
                </View>
              </View>
              <Text style={[styles.bentoValue, { color: colors.textPrimary }]}>12,450 kg</Text>
              <Text style={[styles.bentoLabel, { color: colors.textSecondary }]}>Volume this week</Text>
            </View>

            {/* Stat Card 2: Workouts Completed */}
            <View 
              style={[
                styles.bentoCard, 
                { 
                  backgroundColor: colors.surfaceCard, 
                  borderColor: colors.border,
                  shadowColor: colors.cardShadow,
                }
              ]}
            >
              <View style={styles.bentoCardTop}>
                <Award size={16} color={colors.amber} />
                <View style={[styles.badgePill, { backgroundColor: colors.amberGlow }]}>
                  <Text style={[styles.badgeText, { color: colors.amber }]}>100%</Text>
                </View>
              </View>
              <Text style={[styles.bentoValue, { color: colors.textPrimary }]}>4 / 4</Text>
              <Text style={[styles.bentoLabel, { color: colors.textSecondary }]}>Workouts completed</Text>
            </View>

            {/* Stat Card 3: Squat Progression */}
            <View 
              style={[
                styles.bentoCard, 
                { 
                  backgroundColor: colors.surfaceCard, 
                  borderColor: colors.border,
                  shadowColor: colors.cardShadow,
                }
              ]}
            >
              <View style={styles.bentoCardTop}>
                <Flame size={16} color={colors.amber} />
                <View style={[styles.badgePill, { backgroundColor: '#EFF6FF' }]}>
                  <Text style={[styles.badgeText, { color: '#2563EB' }]}>New PR</Text>
                </View>
              </View>
              <Text style={[styles.bentoValue, { color: colors.textPrimary }]}>+12.5 kg</Text>
              <Text style={[styles.bentoLabel, { color: colors.textSecondary }]}>Squat progression</Text>
            </View>

            {/* Stat Card 4: Streak */}
            <View 
              style={[
                styles.bentoCard, 
                { 
                  backgroundColor: colors.surfaceCard, 
                  borderColor: colors.border,
                  shadowColor: colors.cardShadow,
                }
              ]}
            >
              <View style={styles.bentoCardTop}>
                <Calendar size={16} color={colors.amber} />
                <View style={[styles.badgePill, { backgroundColor: colors.amberGlow }]}>
                  <Text style={[styles.badgeText, { color: colors.amber }]}>Consistent</Text>
                </View>
              </View>
              <Text style={[styles.bentoValue, { color: colors.textPrimary }]}>14 Days</Text>
              <Text style={[styles.bentoLabel, { color: colors.textSecondary }]}>Training streak</Text>
            </View>
          </View>
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    marginBottom: 14,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  greetingSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  mascotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 12,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  mascotImageWrapper: {
    width: 85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubbleWrapper: {
    flex: 1,
    paddingLeft: 8,
  },
  speechBubble: {
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
  },
  speechBubbleHeader: {
    marginBottom: 4,
  },
  coachTag: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  speechBubbleText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  workoutCard: {
    borderRadius: 22,
    borderWidth: 1.2,
    padding: 16,
    marginBottom: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  workoutCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  workoutTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  workoutTagText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  workoutSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  diagramWrapper: {
    width: 68,
    height: 68,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  muscleDiagramImage: {
    width: 58,
    height: 58,
  },
  metaPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 5,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#D9572B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  startWorkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  sectionContainer: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  weekCalendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayPill: {
    width: 44,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  daySplitLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  completedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bentoCard: {
    width: '48.2%',
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bentoCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  bentoValue: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  bentoLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
