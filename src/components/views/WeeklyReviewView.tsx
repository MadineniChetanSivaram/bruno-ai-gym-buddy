// src/components/views/WeeklyReviewView.tsx
// Bruno's Official Weekly Verdict, Tonnage Analytics & Deload Monitor

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Trophy, TrendingUp, ShieldCheck, Flame, Dumbbell } from 'lucide-react-native';
import { useBruno } from '../../context/BrunoContext';

export const WeeklyReviewView: React.FC = () => {
  const { weeklyReview, profile, colors } = useBruno();

  if (!weeklyReview) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Complete your first workout to generate Bruno's weekly verdict review.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Bruno's Official Chalked Verdict Card */}
        <View 
          style={[
            styles.verdictCard, 
            { 
              backgroundColor: colors.surfaceCard, 
              borderColor: colors.amber,
              shadowColor: colors.amberGlow,
            }
          ]}
        >
          <View style={styles.verdictHeader}>
            <View style={styles.verdictHeaderLeft}>
              <View style={[styles.bearIconCircle, { backgroundColor: colors.amberGlow }]}>
                <Text style={{ fontSize: 24 }}>🐻📜</Text>
              </View>
              <View>
                <Text style={[styles.verdictKicker, { color: colors.amber }]}>
                  OFFICIAL NOTEBOOK VERDICT
                </Text>
                <Text style={[styles.verdictTitle, { color: colors.textPrimary }]}>
                  Week {weeklyReview.weekNumber} Report Card
                </Text>
              </View>
            </View>

            <View style={[styles.adherenceBadge, { backgroundColor: colors.successBg, borderColor: colors.success }]}>
              <Text style={[styles.adherenceBadgeText, { color: colors.success }]}>
                {weeklyReview.consistencyScore}% HIT
              </Text>
            </View>
          </View>

          {/* Bruno's Direct Tone Coach Review */}
          <View style={[styles.quoteContainer, { backgroundColor: colors.chalkNoteBg, borderColor: colors.chalkBorder }]}>
            <Text style={[styles.quoteText, { color: colors.textPrimary }]}>
              "{weeklyReview.brunoVerdict}"
            </Text>
          </View>
        </View>

        {/* Tonnage & Consistency Bento Grid */}
        <View style={styles.bentoGrid}>
          
          {/* Total Tonnage Lifted */}
          <View style={[styles.bentoCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
            <View style={styles.bentoCardHeader}>
              <Text style={[styles.bentoLabel, { color: colors.textMuted }]}>TOTAL TONNAGE</Text>
              <Dumbbell size={14} color={colors.amber} />
            </View>
            <Text style={[styles.tonnageValue, { color: colors.textPrimary }]}>
              {weeklyReview.totalTonnageMovedKg.toLocaleString()}{' '}
              <Text style={[styles.tonnageUnit, { color: colors.amber }]}>{profile.unit}</Text>
            </Text>
            <View style={styles.tonnageMeta}>
              <TrendingUp size={12} color={colors.success} />
              <Text style={[styles.tonnageTrend, { color: colors.success }]}>
                Progression on target
              </Text>
            </View>
          </View>

          {/* Adherence Streak */}
          <View style={[styles.bentoCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
            <View style={styles.bentoCardHeader}>
              <Text style={[styles.bentoLabel, { color: colors.textMuted }]}>STREAK</Text>
              <Flame size={14} color="#EF4444" />
            </View>
            <Text style={[styles.tonnageValue, { color: colors.textPrimary }]}>
              {profile.currentStreakWeeks}{' '}
              <Text style={[styles.tonnageUnit, { color: colors.textSecondary }]}>Weeks</Text>
            </Text>
            <View style={styles.tonnageMeta}>
              <Text style={[styles.tonnageTrend, { color: colors.textSecondary }]}>
                Zero missed sessions
              </Text>
            </View>
          </View>

        </View>

        {/* Auto-Deload Detection & Recovery Card */}
        <View 
          style={[
            styles.deloadCard, 
            { 
              backgroundColor: colors.surfaceCard, 
              borderColor: weeklyReview.isDeloadTriggered ? colors.info : colors.border,
            }
          ]}
        >
          <View style={styles.deloadHeader}>
            <View style={styles.deloadLeft}>
              <View style={[styles.deloadIcon, { backgroundColor: colors.infoBg }]}>
                <ShieldCheck size={18} color={colors.info} />
              </View>
              <View>
                <Text style={[styles.deloadTitle, { color: colors.textPrimary }]}>
                  Auto-Deload Detection
                </Text>
                <Text style={[styles.deloadSubtitle, { color: colors.textSecondary }]}>
                  {weeklyReview.isDeloadTriggered 
                    ? 'Deload recommended due to joint soreness signals or mesocycle completion.' 
                    : 'Systemic fatigue is within baseline. Overload greenlit for next week.'}
                </Text>
              </View>
            </View>
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
    gap: 16,
  },
  verdictCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  verdictHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  verdictHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bearIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verdictKicker: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  verdictTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  adherenceBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  adherenceBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  quoteContainer: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  quoteText: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 16,
  },
  bentoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bentoLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  tonnageValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  tonnageUnit: {
    fontSize: 12,
    fontWeight: '700',
  },
  tonnageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  tonnageTrend: {
    fontSize: 10,
    fontWeight: '700',
  },
  deloadCard: {
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 16,
  },
  deloadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deloadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  deloadIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deloadTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  deloadSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
});
