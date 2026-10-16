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
import { TodayWorkoutView } from './src/components/views/TodayWorkoutView';
import { ProgramPlanView } from './src/components/views/ProgramPlanView';
import { WeeklyReviewView } from './src/components/views/WeeklyReviewView';
import { GymProfileView } from './src/components/views/GymProfileView';
import { BrunoTabBar, TabType } from './src/components/navigation/BrunoTabBar';
import { MachineSwapModal } from './src/components/modals/MachineSwapModal';
import { Building2, ShieldAlert } from 'lucide-react-native';

const MainApp: React.FC = () => {
  const {
    profile,
    activeGym,
    activeTab,
    setActiveTab,
    finishOnboarding,
    todaySession,
  } = useBruno();

  // If user hasn't finished onboarding, present the chalked Den intro
  if (!profile.onboardingCompleted) {
    return <OnboardingFlow onComplete={finishOnboarding} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Top Universal Gym Status Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.gymIndicator}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.8}
        >
          <Building2 size={16} color="#F59E0B" />
          <Text style={styles.gymIndicatorText} numberOfLines={1}>
            {activeGym?.name || 'Commercial Gym'}
          </Text>
        </TouchableOpacity>

        {profile.injuryBlacklist.length > 0 && (
          <TouchableOpacity
            style={styles.injuryBadge}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.8}
          >
            <ShieldAlert size={14} color="#EF4444" />
            <Text style={styles.injuryBadgeText}>
              {profile.injuryBlacklist.length} Guarded
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Screen Body */}
      <View style={styles.screenContainer}>
        {activeTab === 'today' && <TodayWorkoutView />}
        {activeTab === 'program' && <ProgramPlanView />}
        {activeTab === 'review' && <WeeklyReviewView />}
        {activeTab === 'profile' && <GymProfileView />}
      </View>

      {/* Universal Tab Navigation */}
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
    backgroundColor: '#090D16',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  gymIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    maxWidth: '65%',
  },
  gymIndicatorText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  injuryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  injuryBadgeText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  screenContainer: {
    flex: 1,
  },
});
