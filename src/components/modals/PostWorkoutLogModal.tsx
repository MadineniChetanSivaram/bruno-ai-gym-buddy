// src/components/modals/PostWorkoutLogModal.tsx
// 30-Second Frictionless Post-Workout Logging with Dynamic Reactive Mascot & Overload Calculation

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Animated 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Sparkles, ShieldAlert, Check, X } from 'lucide-react-native';
import { useBruno } from '../../context/BrunoContext';
import { TactileButton } from '../common/TactileButton';

interface PostWorkoutLogModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PostWorkoutLogModal: React.FC<PostWorkoutLogModalProps> = ({ visible, onClose }) => {
  const { todaySession, completeWorkout, colors } = useBruno();

  const [rpe, setRpe] = useState<number>(8);
  const [soreness, setSoreness] = useState<'none' | 'mild' | 'moderate' | 'severe'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!todaySession) return null;

  const handleQuickComplete = () => {
    setIsSubmitting(true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}

    setTimeout(() => {
      completeWorkout(todaySession.id, 8.0, 'none');
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const handleCustomComplete = () => {
    setIsSubmitting(true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}

    setTimeout(() => {
      completeWorkout(todaySession.id, rpe, soreness);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const getRpeMascotFeedback = (val: number) => {
    switch (val) {
      case 6:
        return { emoji: '🐻🤙', title: 'Light & Fresh', desc: '4+ reps left in reserve. Speed was crisp.' };
      case 7:
        return { emoji: '🐻💪', title: 'Moderate Effort', desc: '3 reps left in tank. Great velocity.' };
      case 8:
        return { emoji: '🐻🔥', title: 'Hypertrophy Goldilocks', desc: '2 reps in reserve. Perfect stimulus-to-fatigue ratio.' };
      case 9:
        return { emoji: '🐻⚡', title: 'Heavy Grind', desc: '1 rep before technical breakdown. High central fatigue.' };
      case 10:
      default:
        return { emoji: '🐻💥', title: 'Maximal Effort', desc: 'Zero reps left. Auto-recovery monitoring activated.' };
    }
  };

  const rpeFeedback = getRpeMascotFeedback(rpe);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View 
          style={[
            styles.sheetContainer, 
            { 
              backgroundColor: colors.surfaceCard, 
              borderColor: colors.border,
              shadowColor: colors.cardShadow,
            }
          ]}
        >
          
          {/* Sheet Header */}
          <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
            <View style={styles.sheetHeaderLeft}>
              <View style={[styles.iconCircle, { backgroundColor: colors.amberGlow }]}>
                <Sparkles size={18} color={colors.amber} />
              </View>
              <View>
                <Text style={[styles.sheetPreTitle, { color: colors.amber }]}>
                  30-SECOND FRICTIONLESS LOG
                </Text>
                <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>
                  Lock Session & Overload
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
              activeOpacity={0.7}
            >
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetBody}>
            
            {/* 1-Tap Complete Hero Card */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleQuickComplete}
              disabled={isSubmitting}
              style={[
                styles.oneClickCard, 
                { 
                  backgroundColor: colors.amber, 
                  borderColor: colors.amberDark 
                }
              ]}
            >
              <View style={styles.oneClickContent}>
                <View>
                  <View style={styles.fastTag}>
                    <Text style={[styles.fastTagText, { color: colors.amberDark }]}>
                      ⚡ FASTEST (RECOMMENDED)
                    </Text>
                  </View>
                  <Text style={[styles.oneClickTitle, { color: colors.textInverted }]}>
                    Hit All Prescribed Targets
                  </Text>
                  <Text style={[styles.oneClickSubtitle, { color: colors.textInverted }]}>
                    Logs all sets at RPE 8.0 & auto-applies +2.5kg / +5kg overload
                  </Text>
                </View>
                <View style={[styles.checkPill, { backgroundColor: colors.textInverted }]}>
                  <Check size={18} color={colors.amber} strokeWidth={3} />
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>
                OR CALIBRATE METRICS
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Reactive Mascot RPE Rating Card */}
            <View style={[styles.calibrateCard, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
              <View style={styles.rpeHeader}>
                <View style={styles.rpeMascotFace}>
                  <Text style={{ fontSize: 28 }}>{rpeFeedback.emoji}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.rpeFeedbackTitle, { color: colors.textPrimary }]}>
                    RPE {rpe}.0 — {rpeFeedback.title}
                  </Text>
                  <Text style={[styles.rpeFeedbackDesc, { color: colors.textSecondary }]}>
                    {rpeFeedback.desc}
                  </Text>
                </View>
              </View>

              {/* RPE Discrete Stepper Pills */}
              <View style={styles.rpeButtonsRow}>
                {[6, 7, 8, 9, 10].map((val) => {
                  const isSelected = rpe === val;
                  return (
                    <TouchableOpacity
                      key={val}
                      onPress={() => {
                        try {
                          Haptics.selectionAsync();
                        } catch (_) {}
                        setRpe(val);
                      }}
                      style={[
                        styles.rpeStepBtn,
                        { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                        isSelected && { backgroundColor: colors.amber, borderColor: colors.amberDark }
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text 
                        style={[
                          styles.rpeStepText, 
                          { color: colors.textSecondary },
                          isSelected && { color: colors.textInverted, fontWeight: '900' }
                        ]}
                      >
                        {val}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Joint Soreness Selector */}
            <View style={[styles.calibrateCard, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
              <View style={styles.sorenessTitleRow}>
                <ShieldAlert size={14} color={soreness !== 'none' ? colors.danger : colors.textMuted} />
                <Text style={[styles.sorenessLabel, { color: colors.textPrimary }]}>
                  Joint Discomfort / Soreness
                </Text>
              </View>
              <Text style={[styles.sorenessDesc, { color: colors.textMuted }]}>
                Bruno triggers an automatic deload or movement swap if joint pain is logged.
              </Text>

              <View style={styles.sorenessButtonsRow}>
                {[
                  { id: 'none', label: 'None' },
                  { id: 'mild', label: 'Mild' },
                  { id: 'moderate', label: 'Mod' },
                  { id: 'severe', label: 'High' },
                ].map((item) => {
                  const isSelected = soreness === item.id;
                  const isBad = item.id === 'moderate' || item.id === 'severe';

                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        try {
                          Haptics.selectionAsync();
                        } catch (_) {}
                        setSoreness(item.id as any);
                      }}
                      style={[
                        styles.sorenessBtn,
                        { backgroundColor: colors.surfaceCard, borderColor: colors.border },
                        isSelected && {
                          backgroundColor: isBad ? colors.dangerBg : colors.amberGlow,
                          borderColor: isBad ? colors.danger : colors.amber,
                        }
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text 
                        style={[
                          styles.sorenessBtnText,
                          { color: colors.textSecondary },
                          isSelected && {
                            color: isBad ? colors.danger : colors.amber,
                            fontWeight: '900',
                          }
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Confirm Custom Log Button */}
            <TactileButton
              onPress={handleCustomComplete}
              variant="secondary"
              title="Confirm Custom Log"
              size="md"
              style={{ marginTop: 6 }}
            />

          </ScrollView>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    maxHeight: '88%',
    paddingBottom: 28,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetPreTitle: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  sheetTitle: {
    fontSize: 16,
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
  sheetBody: {
    padding: 20,
    gap: 16,
  },
  oneClickCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  oneClickContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fastTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  fastTagText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  oneClickTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  oneClickSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.9,
    marginTop: 2,
    maxWidth: 240,
  },
  checkPill: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  calibrateCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 14,
  },
  rpeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rpeMascotFace: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  rpeFeedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  rpeFeedbackDesc: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15,
    marginTop: 2,
  },
  rpeButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rpeStepBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpeStepText: {
    fontSize: 13,
    fontWeight: '800',
  },
  sorenessTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  sorenessLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  sorenessDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10,
  },
  sorenessButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sorenessBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sorenessBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
