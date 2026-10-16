// src/components/modals/PostWorkoutLogModal.tsx
// 30-Second Frictionless Post-Workout Logging Modal with 1-Click "Hit Targets"

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { useBruno } from '../../context/BrunoContext';

interface PostWorkoutLogModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PostWorkoutLogModal: React.FC<PostWorkoutLogModalProps> = ({ visible, onClose }) => {
  const { todaySession, completeWorkout } = useBruno();

  const [rpe, setRpe] = useState<number>(8);
  const [soreness, setSoreness] = useState<'none' | 'mild' | 'moderate' | 'severe'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!todaySession) return null;

  const handleQuickComplete = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      completeWorkout(todaySession.id, rpe, soreness);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.kicker}>30-SECOND COMPLETION LOG</Text>
              <Text style={styles.title}>{todaySession.splitName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* 1-Click "Hit Prescribed Targets" (Hero CTA) */}
            <TouchableOpacity 
              activeOpacity={0.85}
              onPress={handleQuickComplete}
              disabled={isSubmitting}
              style={styles.heroCompleteBtn}
            >
              <View style={styles.heroBtnContent}>
                <Text style={styles.heroEmoji}>⚡</Text>
                <View>
                  <Text style={styles.heroBtnTitle}>Hit Prescribed Targets</Text>
                  <Text style={styles.heroBtnSub}>1-Tap session completion • Log full sets & reps</Text>
                </View>
              </View>
              <Text style={styles.heroChevron}>→</Text>
            </TouchableOpacity>

            {/* Summary of Prescribed Sets */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>SESSION MOVEMENTS LOGGED:</Text>
              {todaySession.exercises.map((ex, idx) => (
                <View key={ex.id} style={styles.summaryItem}>
                  <Text style={styles.summaryIndex}>{idx + 1}.</Text>
                  <Text style={styles.summaryExName}>{ex.name}</Text>
                  <Text style={styles.summaryTargets}>{ex.targetSets} sets × {ex.targetReps} @ {ex.targetWeightKg}kg</Text>
                </View>
              ))}
            </View>

            {/* Overall Session Effort (RPE) */}
            <Text style={styles.sectionTitle}>SESSION EFFORT (RPE 6 - 10)</Text>
            <Text style={styles.sectionSubtitle}>How close were you to absolute muscular failure?</Text>
            <View style={styles.rpeRow}>
              {[6, 7, 8, 9, 10].map(val => (
                <TouchableOpacity
                  key={val}
                  onPress={() => setRpe(val)}
                  style={[styles.rpePill, rpe === val && styles.rpePillActive]}
                >
                  <Text style={[styles.rpePillText, rpe === val && styles.rpePillTextActive]}>
                    RPE {val}
                  </Text>
                  <Text style={[styles.rpePillSub, rpe === val && styles.rpePillSubActive]}>
                    {val === 8 ? '2 in tank' : val === 9 ? '1 in tank' : val === 10 ? 'Max effort' : 'Moderate'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Joint Soreness & Fatigue */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>JOINT SORENESS / TWEAKS</Text>
            <Text style={styles.sectionSubtitle}>Any pain in shoulders, knees, or lower back today?</Text>
            <View style={styles.sorenessRow}>
              {[
                { id: 'none', label: 'None 🟢', sub: 'Joints feel great' },
                { id: 'mild', label: 'Mild 🟡', sub: 'Normal fatigue' },
                { id: 'moderate', label: 'Moderate 🟠', sub: 'Watch closely' },
                { id: 'severe', label: 'Severe 🔴', sub: 'Triggers Deload' },
              ].map(item => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSoreness(item.id as any)}
                  style={[styles.sorenessPill, soreness === item.id && styles.sorenessPillActive]}
                >
                  <Text style={[styles.sorenessText, soreness === item.id && styles.sorenessTextActive]}>
                    {item.label}
                  </Text>
                  <Text style={styles.sorenessSub}>{item.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bottom Overload Guarantee Note */}
            <View style={styles.guaranteeCard}>
              <Text style={styles.guaranteeTitle}>📓 BRUNO'S PROGRESSIVE CALIBRATION:</Text>
              <Text style={styles.guaranteeText}>
                Logging this session will automatically bump your compound lifts by +2.5 kg (upper) / +5 kg (lower) for next week.
              </Text>
            </View>

            <TouchableOpacity 
              activeOpacity={0.85}
              onPress={handleQuickComplete}
              disabled={isSubmitting}
              style={styles.finalSubmitBtn}
            >
              <Text style={styles.finalSubmitText}>
                {isSubmitting ? 'Calibrating Overload...' : 'Confirm & Calibrate Next Week →'}
              </Text>
            </TouchableOpacity>

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
    maxHeight: '90%',
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
  kicker: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 2,
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
  heroCompleteBtn: {
    backgroundColor: '#059669',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  heroBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroEmoji: {
    fontSize: 26,
  },
  heroBtnTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroBtnSub: {
    fontSize: 11,
    color: '#D1FAE5',
    marginTop: 2,
  },
  heroChevron: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryBox: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryIndex: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#60A5FA',
    width: 16,
  },
  summaryExName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  summaryTargets: {
    fontSize: 11,
    color: '#94A3B8',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 10,
    marginTop: 2,
  },
  rpeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  rpePill: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rpePillActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  rpePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  rpePillTextActive: {
    color: '#60A5FA',
  },
  rpePillSub: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  rpePillSubActive: {
    color: '#93C5FD',
  },
  sorenessRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  sorenessPill: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 10,
  },
  sorenessPillActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  sorenessText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  sorenessTextActive: {
    color: '#34D399',
  },
  sorenessSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  guaranteeCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  guaranteeTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#60A5FA',
    letterSpacing: 0.5,
  },
  guaranteeText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
    marginTop: 4,
  },
  finalSubmitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  finalSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
