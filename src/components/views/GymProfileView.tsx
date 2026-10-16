// src/components/views/GymProfileView.tsx
// Feature 1: Gym Environment Profiles, Hardware Checklist & Injury Blacklist

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Alert 
} from 'react-native';
import { useBruno } from '../../context/BrunoContext';
import { JointContraindication } from '../../types';

export const GymProfileView: React.FC = () => {
  const { profile, activeGym, switchGymProfile, resetApp } = useBruno();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.kicker}>FEATURE 1 • HARDWARE & CONSTRAINTS</Text>
        <Text style={styles.title}>Gym Environments</Text>
        <Text style={styles.subtitle}>
          Switching your gym immediately adapts all upcoming workout prescriptions to matching equipment.
        </Text>
      </View>

      {/* Active Gym Switcher */}
      <Text style={styles.sectionTitle}>SELECT ACTIVE TRAINING ENVIRONMENT</Text>
      <View style={styles.gymsList}>
        {profile.gymEnvironments.map(gym => {
          const isActive = gym.id === profile.activeGymId;
          return (
            <TouchableOpacity
              key={gym.id}
              activeOpacity={0.8}
              onPress={() => switchGymProfile(gym.id)}
              style={[styles.gymCard, isActive && styles.gymCardActive]}
            >
              <View style={styles.gymCardTop}>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.gymEmoji}>{gym.type === 'commercial' ? '🏢' : gym.type === 'apartment' ? '🏙️' : '🏠'}</Text>
                    <Text style={[styles.gymName, isActive && styles.gymNameActive]}>{gym.name}</Text>
                  </View>
                  <Text style={styles.gymTypeLabel}>
                    Max DB: {gym.maxDumbbellWeightKg} kg • {gym.hasBarbellRack ? 'Full Barbell Rack' : 'No Barbell'}
                  </Text>
                </View>

                {isActive ? (
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>ACTIVE</Text>
                  </View>
                ) : (
                  <Text style={styles.switchLink}>Switch →</Text>
                )}
              </View>

              {/* Hardware Checklist Tags */}
              <View style={styles.tagsRow}>
                <View style={[styles.tag, gym.hasBarbellRack ? styles.tagOn : styles.tagOff]}>
                  <Text style={styles.tagText}>Barbell Rack {gym.hasBarbellRack ? '✓' : '✕'}</Text>
                </View>
                <View style={[styles.tag, gym.hasCableStack ? styles.tagOn : styles.tagOff]}>
                  <Text style={styles.tagText}>Cable Stack {gym.hasCableStack ? '✓' : '✕'}</Text>
                </View>
                <View style={[styles.tag, gym.hasSmithMachine ? styles.tagOn : styles.tagOff]}>
                  <Text style={styles.tagText}>Smith Machine {gym.hasSmithMachine ? '✓' : '✕'}</Text>
                </View>
                <View style={[styles.tag, gym.hasPullUpBar ? styles.tagOn : styles.tagOff]}>
                  <Text style={styles.tagText}>Pull-Up Bar {gym.hasPullUpBar ? '✓' : '✕'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active Injury Blacklist */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>ACTIVE JOINT BLACKLIST</Text>
      <View style={styles.blacklistCard}>
        {profile.injuryBlacklist.length === 0 ? (
          <Text style={styles.noInjuriesText}>No joint restrictions logged. Full exercise library unlocked.</Text>
        ) : (
          profile.injuryBlacklist.map(injury => (
            <View key={injury} style={styles.injuryBadge}>
              <Text style={styles.injuryBadgeText}>🛡️ {injury.replace('_', ' ').toUpperCase()} PROTECTED</Text>
            </View>
          ))
        )}
      </View>

      {/* Schedule Budget Info */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>SCHEDULE BUDGET</Text>
      <View style={styles.scheduleCard}>
        <View style={styles.scheduleRow}>
          <Text style={styles.scheduleLabel}>Frequency:</Text>
          <Text style={styles.scheduleVal}>{profile.daysPerWeek} Days / Week</Text>
        </View>
        <View style={styles.scheduleRow}>
          <Text style={styles.scheduleLabel}>Session Budget:</Text>
          <Text style={styles.scheduleVal}>{profile.sessionDurationMinutes} Minutes</Text>
        </View>
        <View style={styles.scheduleRow}>
          <Text style={styles.scheduleLabel}>Units:</Text>
          <Text style={styles.scheduleVal}>{profile.unit.toUpperCase()}</Text>
        </View>
      </View>

      {/* Reset Flow Button */}
      <TouchableOpacity 
        onPress={() => {
          Alert.alert(
            'Reset Bruno?',
            'This will clear current progress and re-launch onboarding.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: resetApp }
            ]
          );
        }}
        style={styles.resetBtn}
      >
        <Text style={styles.resetBtnText}>Restart Onboarding & Program Setup</Text>
      </TouchableOpacity>

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
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  gymsList: {
    gap: 12,
  },
  gymCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 16,
  },
  gymCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  gymCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gymEmoji: {
    fontSize: 20,
  },
  gymName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  gymNameActive: {
    color: '#60A5FA',
  },
  gymTypeLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 3,
  },
  activePill: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  switchLink: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 10,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagOn: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  tagOff: {
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  blacklistCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    gap: 8,
  },
  noInjuriesText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  injuryBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  injuryBadgeText: {
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: '800',
  },
  scheduleCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    gap: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  scheduleVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  resetBtn: {
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  resetBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
});
