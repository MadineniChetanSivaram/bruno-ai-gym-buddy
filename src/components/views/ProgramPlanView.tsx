// src/components/views/ProgramPlanView.tsx
// 6-Week Periodization Mesocycle Plan with Volume Balance & Auto-Deload Schedule

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CalendarRange, ShieldCheck, Zap, Activity } from 'lucide-react-native';
import { useBruno } from '../../context/BrunoContext';

export const ProgramPlanView: React.FC = () => {
  const { program, profile, colors } = useBruno();
  const [selectedWeek, setSelectedWeek] = useState(program?.currentWeek || 1);

  if (!program) return null;

  const muscleVolumes = [
    { muscle: 'Chest (Horizontal Push)', sets: 12, target: '10-16 sets', pct: 75 },
    { muscle: 'Back & Lats (Vertical/Horizontal Pull)', sets: 14, target: '12-16 sets', pct: 88 },
    { muscle: 'Quads & Squat Patterns', sets: 12, target: '10-14 sets', pct: 80 },
    { muscle: 'Hamstrings & Posterior Hinge', sets: 10, target: '10-14 sets', pct: 70 },
    { muscle: 'Shoulders (Vertical Push & Lateral)', sets: 12, target: '10-14 sets', pct: 75 },
    { muscle: 'Arms (Biceps & Triceps)', sets: 10, target: '8-12 sets', pct: 65 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Periodization Block Header */}
        <View 
          style={[
            styles.heroCard, 
            { 
              backgroundColor: colors.surfaceCard, 
              borderColor: colors.border,
              shadowColor: colors.cardShadow,
            }
          ]}
        >
          <View style={styles.heroPreHeader}>
            <View style={[styles.blockBadge, { backgroundColor: colors.infoBg }]}>
              <CalendarRange size={13} color={colors.info} />
              <Text style={[styles.blockBadgeText, { color: colors.info }]}>
                BLOCK {program.id.slice(-1) || '1'} • MESOCYCLE
              </Text>
            </View>
            <Text style={[styles.mesoSplitTag, { color: colors.amber }]}>
              {program.splitType}
            </Text>
          </View>

          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            {program.name}
          </Text>
          <Text style={[styles.heroDesc, { color: colors.textSecondary }]}>
            Targeting 10–16 direct sets per muscle group per week. Deload protocol programmed for Week 6 to shed systemic fatigue.
          </Text>
        </View>

        {/* 6-Week Interactive Timeline Navigator */}
        <View style={styles.timelineSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Mesocycle Timeline
          </Text>
          <View style={styles.timelineRow}>
            {[1, 2, 3, 4, 5, 6].map((wk) => {
              const isSelected = selectedWeek === wk;
              const isDeload = wk === 6;
              const isCurrent = program.currentWeek === wk;

              return (
                <TouchableOpacity
                  key={wk}
                  onPress={() => {
                    try {
                      Haptics.selectionAsync();
                    } catch (_) {}
                    setSelectedWeek(wk);
                  }}
                  style={[
                    styles.timelinePill,
                    { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                    isSelected && { backgroundColor: colors.amber, borderColor: colors.amberDark },
                    isDeload && !isSelected && { borderColor: colors.info, backgroundColor: colors.infoBg },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text 
                    style={[
                      styles.timelinePillLabel, 
                      { color: colors.textMuted },
                      isSelected && { color: colors.textInverted, fontWeight: '900' },
                      isDeload && !isSelected && { color: colors.info }
                    ]}
                  >
                    {isDeload ? 'DELOAD' : `W${wk}`}
                  </Text>
                  {isCurrent && !isSelected && (
                    <View style={[styles.currentDot, { backgroundColor: colors.amber }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Week Routine Preview */}
        <View style={[styles.weekDetailCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
          <View style={styles.weekDetailHeader}>
            <View>
              <Text style={[styles.weekDetailTitle, { color: colors.textPrimary }]}>
                {selectedWeek === 6 ? 'Week 6: Deload & Supercompensation' : `Week ${selectedWeek}: Progressive Loading`}
              </Text>
              <Text style={[styles.weekDetailSubtitle, { color: colors.textSecondary }]}>
                {selectedWeek === 6
                  ? 'Total volume reduced by 40%. Loads maintained to preserve neurological adaptations.'
                  : `${profile.daysPerWeek} training sessions planned • Progressive overload active`}
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Muscle Volume Balance (PRD Spec 10-16 sets/muscle/week) */}
        <View style={[styles.volumeCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
          <View style={styles.volumeCardHeader}>
            <View style={styles.volumeHeaderLeft}>
              <Activity size={16} color={colors.amber} />
              <Text style={[styles.volumeTitle, { color: colors.textPrimary }]}>
                Weekly Volume Distribution
              </Text>
            </View>
            <View style={[styles.optimalBadge, { backgroundColor: colors.successBg }]}>
              <ShieldCheck size={12} color={colors.success} />
              <Text style={[styles.optimalBadgeText, { color: colors.success }]}>OPTIMAL</Text>
            </View>
          </View>

          <View style={styles.volumeList}>
            {muscleVolumes.map((item, idx) => (
              <View key={idx} style={styles.volumeRow}>
                <View style={styles.volumeLabelRow}>
                  <Text style={[styles.volumeMuscleName, { color: colors.textPrimary }]}>
                    {item.muscle}
                  </Text>
                  <Text style={[styles.volumeSetsText, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '900', color: colors.amber }}>{item.sets} Sets</Text> / wk
                  </Text>
                </View>

                {/* Animated Progress Bar */}
                <View style={[styles.progressBarTrack, { backgroundColor: colors.surfaceSubtle }]}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${item.pct}%`,
                        backgroundColor: colors.amber,
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

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
    paddingBottom: 110,
    gap: 16,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1.2,
    padding: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  heroPreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  blockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  blockBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  mesoSplitTag: {
    fontSize: 11,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  timelineSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
    paddingHorizontal: 2,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timelinePill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timelinePillLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  currentDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  weekDetailCard: {
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 16,
  },
  weekDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekDetailTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  weekDetailSubtitle: {
    fontSize: 11,
    lineHeight: 16,
  },
  volumeCard: {
    borderRadius: 22,
    borderWidth: 1.2,
    padding: 18,
  },
  volumeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  volumeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  volumeTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  optimalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  optimalBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  volumeList: {
    gap: 14,
  },
  volumeRow: {
    gap: 6,
  },
  volumeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  volumeMuscleName: {
    fontSize: 12,
    fontWeight: '700',
  },
  volumeSetsText: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressBarTrack: {
    width: '100%',
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
