// src/components/views/GymProfileView.tsx
// Multi-Gym Hardware Switcher, Joint Protection Blacklist & Theme Mode Settings

import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { 
  Building2, 
  ShieldAlert, 
  Sun, 
  Moon, 
  RotateCcw, 
  Check, 
  Dumbbell,
  Database,
  RefreshCw
} from 'lucide-react-native';
import { useBruno } from '../../context/BrunoContext';
import { JointContraindication } from '../../types';

export const GymProfileView: React.FC = () => {
  const { 
    profile, 
    activeGym, 
    switchGymProfile, 
    resetApp, 
    theme, 
    colors, 
    toggleTheme,
    backendConnected,
    isSyncing,
    syncWithBackend,
  } = useBruno();

  const handleToggleInjury = (joint: JointContraindication) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}

    const isCurrent = profile.injuryBlacklist.includes(joint);
    const updated = isCurrent
      ? profile.injuryBlacklist.filter(j => j !== joint)
      : [...profile.injuryBlacklist, joint];

    const updatedProfile = { ...profile, injuryBlacklist: updated };
    // This switches / persists through switchGymProfile or context
    switchGymProfile(profile.activeGymId);
    profile.injuryBlacklist = updated;
  };

  const handleReset = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (_) {}
    Alert.alert(
      "Reset Bruno's Notebook?",
      "This will reset your onboarding preferences and clear all logged session data.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset Everything", 
          style: "destructive", 
          onPress: () => resetApp() 
        }
      ]
    );
  };

  const injuries: { id: JointContraindication; label: string; desc: string }[] = [
    { id: 'lower_back', label: 'Lower Back', desc: 'Removes spinal loads (Deadlifts, Back Squats)' },
    { id: 'shoulder', label: 'Shoulders', desc: 'Favors neutral grip presses & cables' },
    { id: 'knee', label: 'Knees', desc: 'Substitutes high knee shear for hip hinges' },
    { id: 'wrist', label: 'Wrists', desc: 'Neutral barbell & dumbbell grips only' },
    { id: 'elbow', label: 'Elbows', desc: 'Replaces skullcrushers with cable pressdowns' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Theme Mode Toggle Bento Card */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={[styles.sectionIconCircle, { backgroundColor: colors.amberGlow }]}>
                {theme === 'dark' ? (
                  <Moon size={16} color={colors.amber} />
                ) : (
                  <Sun size={16} color={colors.amber} />
                )}
              </View>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Appearance Mode
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                  {theme === 'dark' ? 'Obsidian Dark (Powerlifting Den)' : 'Chalk Light (Clean Crisp Paper)'}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={toggleTheme}
              style={[styles.themePillBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
              activeOpacity={0.7}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={14} color={colors.amber} />
                  <Text style={[styles.themePillText, { color: colors.textPrimary }]}>Switch to Light</Text>
                </>
              ) : (
                <>
                  <Moon size={14} color={colors.amber} />
                  <Text style={[styles.themePillText, { color: colors.textPrimary }]}>Switch to Dark</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Multi-Gym Hardware Switcher */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={[styles.sectionIconCircle, { backgroundColor: colors.amberGlow }]}>
                <Building2 size={16} color={colors.amber} />
              </View>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Active Gym Environment
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                  Routines calibrate to dumbbell limits & equipment availability
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.gymList}>
            {profile.gymEnvironments.map((gym) => {
              const isActive = gym.id === activeGym.id;

              return (
                <TouchableOpacity
                  key={gym.id}
                  onPress={() => switchGymProfile(gym.id)}
                  style={[
                    styles.gymItemCard,
                    { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
                    isActive && { backgroundColor: colors.amberGlow, borderColor: colors.amber }
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={styles.gymItemTop}>
                    <View style={styles.gymItemLeft}>
                      <Text style={{ fontSize: 22 }}>
                        {gym.type === 'commercial' ? '🏛️' : gym.type === 'apartment' ? '🏢' : '🏠'}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.gymName, { color: colors.textPrimary }]}>
                          {gym.name}
                        </Text>
                        <Text style={[styles.gymSpecs, { color: colors.textMuted }]}>
                          Max DB: {gym.maxDumbbellWeightKg}kg • {gym.hasBarbellRack ? 'Barbell Rack' : 'No Barbell'} • {gym.hasCableStack ? 'Cables Available' : 'No Cables'}
                        </Text>
                      </View>
                    </View>

                    {isActive && (
                      <View style={[styles.activeCheckPill, { backgroundColor: colors.amber }]}>
                        <Check size={14} color={colors.textInverted} strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Joint Injury Blacklist Manager */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={[styles.sectionIconCircle, { backgroundColor: colors.dangerBg }]}>
                <ShieldAlert size={16} color={colors.danger} />
              </View>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Joint Injury Blacklist
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                  Toggle joints you want Bruno to protect with safe alternatives
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.injuryList}>
            {injuries.map((injury) => {
              const isGuarded = profile.injuryBlacklist.includes(injury.id);

              return (
                <TouchableOpacity
                  key={injury.id}
                  onPress={() => handleToggleInjury(injury.id)}
                  style={[
                    styles.injuryItem,
                    { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
                    isGuarded && { backgroundColor: colors.dangerBg, borderColor: colors.danger }
                  ]}
                  activeOpacity={0.75}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.injuryLabel, { color: isGuarded ? colors.danger : colors.textPrimary }]}>
                      {injury.label} {isGuarded ? '🛡️ Guarded' : ''}
                    </Text>
                    <Text style={[styles.injuryDesc, { color: colors.textMuted }]}>
                      {injury.desc}
                    </Text>
                  </View>

                  <View 
                    style={[
                      styles.toggleIndicator, 
                      { borderColor: colors.borderStrong },
                      isGuarded && { backgroundColor: colors.danger, borderColor: colors.danger }
                    ]}
                  >
                    {isGuarded && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Live Cloud Backend Status Card */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={[styles.sectionIconCircle, { backgroundColor: backendConnected ? '#ECFDF5' : colors.surfaceSubtle }]}>
                <Database size={16} color={backendConnected ? '#059669' : colors.textMuted} />
              </View>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Cloud Backend & Database
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                  Fastify 5 • PostgreSQL • Drizzle ORM
                </Text>
              </View>
            </View>

            <View style={[styles.liveBadge, { backgroundColor: backendConnected ? '#ECFDF5' : colors.surfaceSubtle }]}>
              <View style={[styles.liveDot, { backgroundColor: backendConnected ? '#10B981' : '#9CA3AF' }]} />
              <Text style={[styles.liveBadgeText, { color: backendConnected ? '#059669' : colors.textMuted }]}>
                {backendConnected ? 'LIVE' : 'OFFLINE'}
              </Text>
            </View>
          </View>

          <View style={[styles.cloudInfoBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
            <View style={styles.cloudInfoRow}>
              <Text style={[styles.cloudLabel, { color: colors.textMuted }]}>API Server:</Text>
              <Text style={[styles.cloudValue, { color: colors.textPrimary }]} numberOfLines={1}>
                ds3xeksdqbnoqesxabywgrke.167.233.97.217.sslip.io
              </Text>
            </View>

            <View style={styles.cloudInfoRow}>
              <Text style={[styles.cloudLabel, { color: colors.textMuted }]}>Exercise Catalogue:</Text>
              <Text style={[styles.cloudValue, { color: colors.textPrimary }]}>
                40 Core Exercises (PostgreSQL)
              </Text>
            </View>

            <View style={styles.cloudInfoRow}>
              <Text style={[styles.cloudLabel, { color: colors.textMuted }]}>Constraint Filter:</Text>
              <Text style={[styles.cloudValue, { color: colors.amber }]}>
                Algorithmic Biomechanical Safety Active
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.syncButton, { backgroundColor: colors.amber }]}
            onPress={syncWithBackend}
            activeOpacity={0.85}
          >
            <RefreshCw size={14} color="#FFFFFF" />
            <Text style={styles.syncButtonText}>
              {isSyncing ? 'Synchronizing with Cloud...' : 'Sync with Backend Now'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reset / Onboarding Repeat */}
        <TouchableOpacity
          onPress={handleReset}
          style={[styles.resetButton, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <RotateCcw size={15} color={colors.textSecondary} />
          <Text style={[styles.resetButtonText, { color: colors.textSecondary }]}>
            Reset Bruno's Notebook & Re-Run Onboarding
          </Text>
        </TouchableOpacity>

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
  sectionCard: {
    borderRadius: 22,
    borderWidth: 1.2,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  sectionIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  themePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  themePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  gymList: {
    gap: 10,
  },
  gymItemCard: {
    borderRadius: 16,
    borderWidth: 1.2,
    padding: 12,
  },
  gymItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gymItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  gymName: {
    fontSize: 14,
    fontWeight: '800',
  },
  gymSpecs: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  activeCheckPill: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  injuryList: {
    gap: 8,
  },
  injuryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.2,
  },
  injuryLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  injuryDesc: {
    fontSize: 10,
    marginTop: 2,
  },
  toggleIndicator: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  cloudInfoBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
    gap: 8,
  },
  cloudInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cloudLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  cloudValue: {
    fontSize: 11,
    fontWeight: '800',
    maxWidth: '65%',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 12,
    gap: 6,
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.2,
    marginTop: 4,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
