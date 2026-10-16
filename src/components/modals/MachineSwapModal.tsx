// src/components/modals/MachineSwapModal.tsx
// 1-Tap "Machine Busy" Instant Biomechanical Swap Modal

import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { useBruno } from '../../context/BrunoContext';
import { BrunoEngine } from '../../services/brunoEngine';
import { ExerciseDefinition } from '../../types';

export const MachineSwapModal: React.FC = () => {
  const { 
    selectedExerciseForSwap, 
    activeGym, 
    profile, 
    closeSwapModal, 
    executeExerciseSwap 
  } = useBruno();

  if (!selectedExerciseForSwap) return null;

  const candidateSwaps: ExerciseDefinition[] = BrunoEngine.getMachineSwaps(
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
        <View style={styles.modalSheet}>

          {/* Modal Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <View style={styles.badgeRow}>
                <Text style={styles.kickerBadge}>1-TAP BIOMECHANICAL SWAP</Text>
                <Text style={styles.gymNameBadge}>📍 {activeGym.name}</Text>
              </View>
              <Text style={styles.title}>Machine Busy or Broken?</Text>
            </View>
            <TouchableOpacity onPress={closeSwapModal} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Currently Occupied Exercise */}
          <View style={styles.currentCard}>
            <Text style={styles.currentLabel}>CURRENT PLANNED MOVEMENT:</Text>
            <Text style={styles.currentName}>{selectedExerciseForSwap.name}</Text>
            <Text style={styles.currentSub}>
              {selectedExerciseForSwap.targetSets} sets × {selectedExerciseForSwap.targetReps} reps • {selectedExerciseForSwap.targetWeightKg} kg
            </Text>
          </View>

          <Text style={styles.candidatesHeader}>
            BRUNO'S 3 INSTANT MATCHES ({selectedExerciseForSwap.primaryMuscle.toUpperCase()})
          </Text>

          {/* Candidate Swaps List */}
          <ScrollView style={styles.candidatesList} showsVerticalScrollIndicator={false}>
            {candidateSwaps.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No matching alternative exercises found in your active gym equipment profile.</Text>
              </View>
            ) : (
              candidateSwaps.map(candidate => {
                const targetWeight = BrunoEngine.calculateStartingWeight(candidate, activeGym);
                return (
                  <View key={candidate.id} style={styles.swapCard}>
                    <View style={styles.swapCardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.candidateName}>{candidate.name}</Text>
                        <Text style={styles.candidatePattern}>
                          Pattern: {candidate.movementPattern.replace('_', ' ')} • Gear: {candidate.requiredEquipment.replace('_', ' ')}
                        </Text>
                      </View>
                      <View style={styles.weightBadge}>
                        <Text style={styles.weightText}>{targetWeight} kg</Text>
                      </View>
                    </View>

                    <Text style={styles.candidateCue}>💡 {candidate.cueNote}</Text>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => executeExerciseSwap(candidate)}
                      style={styles.swapButton}
                    >
                      <Text style={styles.swapButtonText}>Swap to This Exercise ⚡</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 20,
    maxHeight: '88%',
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#475569',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  kickerBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  gymNameBadge: {
    fontSize: 10,
    color: '#94A3B8',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  currentCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  currentLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  currentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
    marginTop: 2,
  },
  currentSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  candidatesHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  candidatesList: {
    marginBottom: 10,
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
  },
  swapCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
    padding: 14,
    marginBottom: 12,
  },
  swapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  candidateName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  candidatePattern: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  weightBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  weightText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#60A5FA',
  },
  candidateCue: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
    marginTop: 8,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  swapButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  swapButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
