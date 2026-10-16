// src/components/views/ProgramPlanView.tsx
// Feature 2 & 4: 6-Week Periodization Block Explorer & Progressive Overload Schedule

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { useBruno } from '../../context/BrunoContext';

export const ProgramPlanView: React.FC = () => {
  const { program, profile } = useBruno();
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  if (!program) return null;

  const weekSessions = program.sessions.filter(s => s.weekNumber === selectedWeek);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.kicker}>FEATURE 2 • PERIODIZATION ARCHITECTURE</Text>
        <Text style={styles.title}>{program.name}</Text>
        <Text style={styles.subtitle}>
          6-Week progressive overload block engineered for your {profile.daysPerWeek}-day schedule.
        </Text>
      </View>

      {/* 6-Week Selector Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekTabsRow}>
        {[1, 2, 3, 4, 5, 6].map(w => {
          const isSelected = selectedWeek === w;
          const isDeload = w === 6;
          return (
            <TouchableOpacity
              key={w}
              activeOpacity={0.8}
              onPress={() => setSelectedWeek(w)}
              style={[
                styles.weekTab, 
                isSelected && styles.weekTabActive,
                isDeload && styles.weekTabDeload
              ]}
            >
              <Text style={[styles.weekTabNumber, isSelected && styles.weekTabNumberActive]}>
                WEEK {w}
              </Text>
              <Text style={styles.weekTabSub}>
                {isDeload ? 'Recovery Deload' : w === 1 ? 'Baseline Set' : `+${(w-1)*2.5}kg Target`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Week Overview Card */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>
            {selectedWeek === 6 ? '⚠️ Week 6: Strategic Recovery Deload' : `Week ${selectedWeek}: Progressive Loading Phase`}
          </Text>
        </View>
        <Text style={styles.overviewText}>
          {selectedWeek === 6
            ? 'Volume reduced by 40% and loads lightened by 30%. This allows central nervous system recovery and connective tissue repair before the next block.'
            : `All compound working loads reflect automated +2.5 kg (upper body) and +5 kg (lower body) overload increments.`}
        </Text>
      </View>

      {/* Scheduled Sessions for Selected Week */}
      <Text style={styles.sectionTitle}>WORKOUT SCHEDULE (WEEK {selectedWeek})</Text>
      <View style={styles.sessionsList}>
        {weekSessions.map(session => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionCardTop}>
              <View>
                <Text style={styles.sessionDayLabel}>DAY {session.dayNumber} • {session.splitCategory.toUpperCase()}</Text>
                <Text style={styles.sessionName}>{session.splitName}</Text>
              </View>
              <View style={[styles.statusBadge, session.isCompleted ? styles.statusDone : styles.statusPending]}>
                <Text style={styles.statusBadgeText}>{session.isCompleted ? 'COMPLETED ✓' : 'SCHEDULED'}</Text>
              </View>
            </View>

            {/* Exercise Breakdown */}
            <View style={styles.exBreakdown}>
              {session.exercises.map(ex => (
                <View key={ex.id} style={styles.exRow}>
                  <Text style={styles.exBullet}>•</Text>
                  <Text style={styles.exName}>{ex.name}</Text>
                  <Text style={styles.exWeight}>{ex.targetWeightKg} kg ({ex.targetSets}×{ex.targetReps})</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  header: {
    marginBottom: 16,
  },
  kicker: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginTop: 4,
  },
  weekTabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  weekTab: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    minWidth: 110,
  },
  weekTabActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  weekTabDeload: {
    borderColor: '#F59E0B',
  },
  weekTabNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  weekTabNumberActive: {
    color: '#60A5FA',
  },
  weekTabSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  overviewCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 16,
    marginBottom: 20,
  },
  overviewHeader: {
    marginBottom: 6,
  },
  overviewTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  overviewText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  sessionsList: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 16,
  },
  sessionCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionDayLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  sessionName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusPending: {
    backgroundColor: '#1E293B',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },
  exBreakdown: {
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 10,
    gap: 6,
  },
  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exBullet: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: 'bold',
  },
  exName: {
    flex: 1,
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  exWeight: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
  },
});
