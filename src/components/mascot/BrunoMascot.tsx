// src/components/mascot/BrunoMascot.tsx
// Bruno: The Wise Heavyweight Bear with the Leather Lifting Journal

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MascotState } from '../../types';

interface BrunoMascotProps {
  state: MascotState;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrunoMascot: React.FC<BrunoMascotProps> = ({ 
  state, 
  message, 
  size = 'md' 
}) => {
  const getMascotDetails = () => {
    switch (state) {
      case 'approving_nod':
        return {
          emoji: '🐻💪',
          badgeText: 'Bruno Approves',
          badgeBg: '#10B981',
          subtext: 'Solid technique logged. Overload locked.',
        };
      case 'chalking_up':
        return {
          emoji: '🐻☁️',
          badgeText: 'Chalking Up',
          badgeBg: '#6366F1',
          subtext: 'Get your mind right. Heavy sets ahead.',
        };
      case 'waiting_watch':
        return {
          emoji: '🐻⏱️',
          badgeText: 'Bruno is Waiting',
          badgeBg: '#F59E0B',
          subtext: 'The barbell does not lift itself.',
        };
      case 'proud_coach':
        return {
          emoji: '🐻🏆',
          badgeText: 'Target Smashed!',
          badgeBg: '#3B82F6',
          subtext: '+2.5kg / +5kg applied for next week.',
        };
      case 'studying_journal':
      default:
        return {
          emoji: '🐻📖',
          badgeText: 'Studying Journal',
          badgeBg: '#8B5CF6',
          subtext: 'Recalibrating periodization from recovery metrics.',
        };
    }
  };

  const details = getMascotDetails();
  const avatarSize = size === 'sm' ? 44 : size === 'lg' ? 72 : 56;
  const fontSize = size === 'sm' ? 24 : size === 'lg' ? 38 : 30;

  return (
    <View style={styles.container}>
      <View style={styles.mascotRow}>
        
        {/* Mascot Avatar Frame with Leather & Chalk Accents */}
        <View style={[styles.avatarBox, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
          <Text style={{ fontSize }}>{details.emoji}</Text>
          <View style={[styles.stateBadge, { backgroundColor: details.badgeBg }]}>
            <View style={styles.stateDot} />
          </View>
        </View>

        {/* Mascot Header Information */}
        <View style={styles.infoCol}>
          <View style={styles.titleRow}>
            <Text style={styles.mascotName}>Bruno</Text>
            <View style={[styles.badgePill, { backgroundColor: details.badgeBg + '22', borderColor: details.badgeBg + '55' }]}>
              <Text style={[styles.badgeLabel, { color: details.badgeBg }]}>
                {details.badgeText}
              </Text>
            </View>
          </View>
          <Text style={styles.subtext}>{details.subtext}</Text>
        </View>

      </View>

      {/* Bruno's Old-School Notebook Speech Bubble */}
      {message && (
        <View style={styles.speechBubble}>
          <View style={styles.speechPointer} />
          <View style={styles.notebookHeader}>
            <Text style={styles.notebookTitle}>📓 BRUNO'S LIFTING JOURNAL</Text>
            <Text style={styles.notebookChalk}>CHALKED PAWS • NO FLUFF</Text>
          </View>
          <Text style={styles.speechText}>"{message}"</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  stateBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  infoCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mascotName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.3,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtext: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  speechBubble: {
    marginTop: 12,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 14,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  speechPointer: {
    position: 'absolute',
    top: -7,
    left: 24,
    width: 12,
    height: 12,
    backgroundColor: '#1E293B',
    borderLeftWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: '#334155',
    transform: [{ rotate: '45deg' }],
  },
  notebookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 6,
    marginBottom: 8,
  },
  notebookTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#60A5FA',
    letterSpacing: 0.8,
  },
  notebookChalk: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  speechText: {
    fontSize: 13,
    color: '#E2E8F0',
    lineHeight: 20,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});
