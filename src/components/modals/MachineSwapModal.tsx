// src/components/modals/MachineSwapModal.tsx
// 1-Tap "Machine Busy" Instant Biomechanical Swap Modal (Satya / Clucky style)

import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { RefreshCw, Check, X, ShieldCheck } from 'lucide-react-native';
import { useBruno } from '../../context/BrunoContext';
import { BrunoEngine } from '../../services/brunoEngine';
import { apiService } from '../../services/apiService';
import { ExerciseDefinition } from '../../types';

export const MachineSwapModal: React.FC = () => {
  const { 
    selectedExerciseForSwap, 
    activeGym, 
    profile, 
    closeSwapModal, 
    executeExerciseSwap,
    colors,
    backendConnected,
  } = useBruno();

  const [remoteSwaps, setRemoteSwaps] = React.useState<ExerciseDefinition[]>([]);

  React.useEffect(() => {
    if (!selectedExerciseForSwap) return;
    let isMounted = true;
    apiService.getExercises({
      movementPattern: selectedExerciseForSwap.movementPattern,
    }).then(res => {
      if (isMounted && res.exercises.length > 0) {
        const filtered = res.exercises.filter(
          e => e.id !== selectedExerciseForSwap.exerciseId && e.name !== selectedExerciseForSwap.name
        );
        if (filtered.length > 0) {
          setRemoteSwaps(filtered.slice(0, 3));
        }
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, [selectedExerciseForSwap]);

  if (!selectedExerciseForSwap) return null;

  const candidateSwaps: ExerciseDefinition[] = remoteSwaps.length > 0
    ? remoteSwaps
    : BrunoEngine.getMachineSwaps(
        selectedExerciseForSwap.exerciseId,
        activeGym,
        profile.injuryBlacklist
      );

  return (
    <Modal
      visible={!!selectedExerciseForSwap}
      animationType="slide"
      transparent={true}
      onRequestClose={closeSwapModal}
    >
      <View style={styles.modalOverlay}>
        <View 
          style={[
            styles.modalSheet, 
            { 
              backgroundColor: colors.surfaceCard, 
              borderColor: colors.border,
              shadowColor: colors.cardShadow,
            }
          ]}
        >

          {/* Drag Handle */}
          <View style={[styles.dragHandle, { backgroundColor: colors.borderStrong }]} />

          {/* Header */}
          <View style={[styles.headerRow, { borderBottomColor: colors.border }]}>
            <View>
              <View style={styles.badgeRow}>
                <View style={[styles.kickerBadge, { backgroundColor: colors.amberGlow }]}>
                  <Text style={[styles.kickerBadgeText, { color: colors.amber }]}>
                    1-TAP BIOMECHANICAL SWAP
                  </Text>
                </View>
                <Text style={[styles.gymNameBadge, { color: colors.textMuted }]}>
                  📍 {activeGym.name}
                </Text>
              </View>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Machine Busy or Taken?
              </Text>
            </View>

            <TouchableOpacity 
              onPress={closeSwapModal} 
              style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
              activeOpacity={0.7}
            >
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Currently Prescribed Exercise Card */}
          <View style={[styles.currentCard, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
            <Text style={[styles.currentLabel, { color: colors.textMuted }]}>
              CURRENT PRESCRIBED MOVEMENT:
            </Text>
            <Text style={[styles.currentName, { color: colors.textPrimary }]}>
              {selectedExerciseForSwap.name}
            </Text>
            <Text style={[styles.currentSub, { color: colors.amber }]}>
              {selectedExerciseForSwap.targetSets} sets × {selectedExerciseForSwap.targetReps} reps • {selectedExerciseForSwap.targetWeightKg} kg
            </Text>
          </View>

          <Text style={[styles.candidatesHeader, { color: colors.textSecondary }]}>
            BRUNO'S 3 BIOMECHANICALLY IDENTICAL ALTERNATIVES:
          </Text>

          {/* Candidates List */}
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.candidatesList}
          >
            {candidateSwaps.length === 0 ? (
              <View style={styles.emptySwapContainer}>
                <Text style={[styles.emptySwapText, { color: colors.textSecondary }]}>
                  No other safe movements found in this gym's equipment profile for your injury filters.
                </Text>
              </View>
            ) : (
              candidateSwaps.map((candidate, idx) => (
                <TouchableOpacity
                  key={candidate.id}
                  style={[
                    styles.candidateCard, 
                    { 
                      backgroundColor: colors.surfaceSubtle, 
                      borderColor: colors.border,
                      shadowColor: colors.cardShadow,
                    }
                  ]}
                  activeOpacity={0.82}
                  onPress={() => executeExerciseSwap(candidate)}
                >
                  <View style={styles.candidateHeader}>
                    <View style={styles.candidateLeft}>
                      <View style={[styles.indexCircle, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
                        <Text style={[styles.indexText, { color: colors.amber }]}>{idx + 1}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.candidateName, { color: colors.textPrimary }]} numberOfLines={1}>
                          {candidate.name}
                        </Text>
                        <Text style={[styles.candidateMeta, { color: colors.textMuted }]}>
                          Requires: {candidate.requiredEquipment.replace('_', ' ').toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.swapInBtn, { backgroundColor: colors.amber }]}>
                      <RefreshCw size={12} color={colors.textInverted} />
                      <Text style={[styles.swapInText, { color: colors.textInverted }]}>Swap In</Text>
                    </View>
                  </View>

                  <View style={[styles.matchIndicatorRow, { borderTopColor: colors.border }]}>
                    <View style={styles.matchTag}>
                      <Check size={11} color={colors.success} />
                      <Text style={[styles.matchTagText, { color: colors.success }]}>
                        100% {candidate.movementPattern.replace('_', ' ')} Match
                      </Text>
                    </View>

                    <View style={styles.matchTag}>
                      <ShieldCheck size={11} color={colors.info} />
                      <Text style={[styles.matchTagText, { color: colors.info }]}>
                        Joint Safe
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    maxHeight: '84%',
    paddingBottom: 28,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  kickerBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  kickerBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  gymNameBadge: {
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentCard: {
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.2,
  },
  currentLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  currentName: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  currentSub: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  candidatesHeader: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  candidatesList: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
  candidateCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  candidateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  candidateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  indexCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  indexText: {
    fontSize: 11,
    fontWeight: '900',
  },
  candidateName: {
    fontSize: 14,
    fontWeight: '800',
  },
  candidateMeta: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  swapInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  swapInText: {
    fontSize: 11,
    fontWeight: '900',
  },
  matchIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  matchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matchTagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  emptySwapContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptySwapText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
