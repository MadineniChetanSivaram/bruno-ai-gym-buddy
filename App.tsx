// App.tsx
// Root Application Shell with Dynamic Light/Dark Theme, Quick Theme Switcher & Island Tab Navigation

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BrunoProvider, useBruno } from './src/context/BrunoContext';
import { OnboardingFlow } from './src/components/onboarding/OnboardingFlow';
import { HomeDashboardView } from './src/components/views/HomeDashboardView';
import { TodayWorkoutView } from './src/components/views/TodayWorkoutView';
import { ProgramPlanView } from './src/components/views/ProgramPlanView';
import { WeeklyReviewView } from './src/components/views/WeeklyReviewView';
import { GymProfileView } from './src/components/views/GymProfileView';
import { BrunoTabBar, TabType } from './src/components/navigation/BrunoTabBar';
import { MachineSwapModal } from './src/components/modals/MachineSwapModal';
import { Building2, ShieldAlert, Sun, Moon, Database, CheckCircle2, Sparkles } from 'lucide-react-native';

const MainApp: React.FC = () => {
  const {
    profile,
    activeGym,
    activeTab,
    setActiveTab,
    finishOnboarding,
    todaySession,
    theme,
    colors,
    toggleTheme,
    backendConnected,
    isSyncing,
    syncWithBackend,
    showOnboarding,
    setShowOnboarding,
    startOnboarding,
  } = useBruno();

  // If user hasn't finished onboarding or requested replay, show the 8-step flow
  if (showOnboarding || !profile.onboardingCompleted) {
    return (
      <OnboardingFlow 
        onComplete={finishOnboarding} 
        onExit={() => setShowOnboarding(false)} 
      />
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.surfaceCard} 
      />

      {/* Top Universal Header Bar */}
      <View 
        style={[
          styles.topBar, 
          { 
            backgroundColor: colors.surfaceCard, 
            borderBottomColor: colors.border,
            shadowColor: colors.cardShadow,
          }
        ]}
      >
        <TouchableOpacity
          style={[styles.gymIndicator, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.8}
        >
          <Building2 size={15} color={colors.amber} />
          <Text style={[styles.gymIndicatorText, { color: colors.textPrimary }]} numberOfLines={1}>
            {activeGym?.name || 'Commercial Gym'}
          </Text>
        </TouchableOpacity>

        <View style={styles.topBarRight}>
          {/* Quick Onboarding Button */}
          <TouchableOpacity
            style={[styles.onboardingBtn, { backgroundColor: colors.amberGlow, borderColor: colors.amber }]}
            onPress={startOnboarding}
            activeOpacity={0.8}
          >
            <Sparkles size={13} color={colors.amber} />
            <Text style={[styles.onboardingBtnText, { color: colors.amber }]}>
              Onboarding
            </Text>
          </TouchableOpacity>

          {/* Live Backend Connection Badge */}
          <TouchableOpacity
            style={[
              styles.backendPill,
              { 
                backgroundColor: backendConnected ? '#ECFDF5' : colors.surfaceSubtle,
                borderColor: backendConnected ? '#10B981' : colors.border
              }
            ]}
            onPress={syncWithBackend}
            activeOpacity={0.7}
          >
            <View style={[styles.statusDot, { backgroundColor: backendConnected ? '#10B981' : '#9CA3AF' }]} />
            <Text style={[styles.backendPillText, { color: backendConnected ? '#059669' : colors.textMuted }]}>
              {isSyncing ? 'Syncing...' : (backendConnected ? 'API Live' : 'Offline')}
            </Text>
          </TouchableOpacity>

          {profile.injuryBlacklist.length > 0 && (
            <TouchableOpacity
              style={[styles.injuryBadge, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}
              onPress={() => setActiveTab('profile')}
              activeOpacity={0.8}
            >
              <ShieldAlert size={13} color={colors.danger} />
              <Text style={[styles.injuryBadgeText, { color: colors.danger }]}>
                {profile.injuryBlacklist.length} Guarded
              </Text>
            </TouchableOpacity>
          )}

          {/* Quick Theme Switcher Pill (Light / Dark) */}
          <TouchableOpacity
            style={[styles.themeToggleBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            {theme === 'dark' ? (
              <Sun size={15} color={colors.amber} />
            ) : (
              <Moon size={15} color={colors.amber} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Screen Views */}
      <View style={styles.screenContainer}>
        {activeTab === 'today' && (
          <HomeDashboardView onStartWorkout={() => setActiveTab('program')} />
        )}
        {activeTab === 'program' && <TodayWorkoutView />}
        {activeTab === 'review' && <WeeklyReviewView />}
        {activeTab === 'profile' && <GymProfileView />}
      </View>

      {/* Floating Island Tab Bar */}
      <BrunoTabBar
        currentTab={activeTab as TabType}
        onSelectTab={(tab) => setActiveTab(tab)}
        hasUnloggedWorkout={!!todaySession && !todaySession.isCompleted}
      />

      {/* Global 1-Tap Machine Busy Swap Modal */}
      <MachineSwapModal />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <BrunoProvider>
        <MainApp />
      </BrunoProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1.2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  gymIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
    maxWidth: '58%',
  },
  gymIndicatorText: {
    fontSize: 12,
    fontWeight: '800',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  injuryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
  },
  injuryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  onboardingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  onboardingBtnText: {
    fontSize: 10,
    fontWeight: '800',
  },
  themeToggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  backendPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  screenContainer: {
    flex: 1,
  },
});
