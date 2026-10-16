// src/context/BrunoContext.tsx
// Global State Context for Bruno AI Gym Buddy with Dynamic Theming & Live Backend Integration

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { 
  UserProfile, 
  GymEnvironment, 
  ProgramBlock, 
  WorkoutSession, 
  MascotState, 
  ExerciseDefinition, 
  PrescribedExercise, 
  WeeklyReviewReport,
  JointContraindication
} from '../types';
import { BrunoEngine } from '../services/brunoEngine';
import { StorageService } from '../services/storageService';
import { apiService, BackendGymProfile, BackendConstraint } from '../services/apiService';
import { ThemeColors, ThemeMode, darkTheme, lightTheme } from '../theme/theme';

const THEME_STORAGE_KEY = '@bruno_theme_mode';

const DEFAULT_GYMS: GymEnvironment[] = [
  {
    id: 'commercial_gym',
    name: 'Metropolis Commercial Gym',
    type: 'commercial',
    maxDumbbellWeightKg: 50,
    hasBarbellRack: true,
    hasCableStack: true,
    hasSmithMachine: true,
    hasPullUpBar: true,
  },
  {
    id: 'apartment_gym',
    name: 'Apartment Fitness Center',
    type: 'apartment',
    maxDumbbellWeightKg: 24,
    hasBarbellRack: false,
    hasCableStack: true,
    hasSmithMachine: false,
    hasPullUpBar: true,
  },
  {
    id: 'home_gym',
    name: 'Home Dumbbell Studio',
    type: 'home',
    maxDumbbellWeightKg: 20,
    hasBarbellRack: false,
    hasCableStack: false,
    hasSmithMachine: false,
    hasPullUpBar: true,
  }
];

const INITIAL_PROFILE: UserProfile = {
  id: 'user_bruno_1',
  name: 'Alex Hunter',
  unit: 'kg',
  activeGymId: 'commercial_gym',
  gymEnvironments: DEFAULT_GYMS,
  injuryBlacklist: [],
  daysPerWeek: 4,
  sessionDurationMinutes: 45,
  onboardingCompleted: false,
  currentStreakWeeks: 3,
};

interface BrunoContextType {
  profile: UserProfile;
  activeGym: GymEnvironment;
  program: ProgramBlock | null;
  todaySession: WorkoutSession | null;
  mascotState: MascotState;
  activeTab: 'today' | 'program' | 'review' | 'profile';
  selectedExerciseForSwap: PrescribedExercise | null;
  weeklyReview: WeeklyReviewReport | null;
  theme: ThemeMode;
  colors: ThemeColors;
  showOnboarding: boolean;
  setShowOnboarding: (val: boolean) => void;
  startOnboarding: () => void;
  backendConnected: boolean;
  isSyncing: boolean;
  remoteExercises: ExerciseDefinition[];
  syncWithBackend: () => Promise<void>;
  toggleTheme: () => void;
  setActiveTab: (tab: 'today' | 'program' | 'review' | 'profile') => void;
  setMascotState: (state: MascotState) => void;
  openSwapModal: (exercise: PrescribedExercise) => void;
  closeSwapModal: () => void;
  executeExerciseSwap: (newExercise: ExerciseDefinition) => void;
  completeWorkout: (
    sessionId: string, 
    rpe: number, 
    jointSoreness: 'none' | 'mild' | 'moderate' | 'severe'
  ) => void;
  switchGymProfile: (gymId: string) => void;
  finishOnboarding: (configuredProfile: UserProfile) => void;
  resetApp: () => void;
}

const BrunoContext = createContext<BrunoContextType | undefined>(undefined);

export const BrunoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [program, setProgram] = useState<ProgramBlock | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'program' | 'review' | 'profile'>('today');
  const [mascotState, setMascotState] = useState<MascotState>('studying_journal');
  const [selectedExerciseForSwap, setSelectedExerciseForSwap] = useState<PrescribedExercise | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [remoteExercises, setRemoteExercises] = useState<ExerciseDefinition[]>([]);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true); // Start directly in onboarding

  // Load theme and saved state, then connect to live Fastify backend
  useEffect(() => {
    async function init() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
      } catch (_) {}

      const savedProfile = await StorageService.loadProfile();
      const savedProgram = await StorageService.loadProgram();

      let currentProf = savedProfile;
      if (savedProfile && savedProfile.onboardingCompleted && savedProgram) {
        setProfile(savedProfile);
        setProgram(savedProgram);
      } else {
        const defaultProg = BrunoEngine.generateProgram(INITIAL_PROFILE);
        setProgram(defaultProg);
        currentProf = INITIAL_PROFILE;
      }

      // Check live backend connection and sync
      await checkAndSyncBackend(currentProf);
    }
    init();
  }, []);

  const startOnboarding = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
    setShowOnboarding(true);
  };

  const checkAndSyncBackend = async (currentProf?: UserProfile) => {
    setIsSyncing(true);
    try {
      const health = await apiService.checkHealth();
      setBackendConnected(health.ok);

      if (health.ok) {
        const authed = await apiService.ensureAuthenticated();
        if (authed) {
          // 1. Fetch remote exercises
          const exerciseRes = await apiService.getExercises();
          if (exerciseRes.exercises.length > 0) {
            setRemoteExercises(exerciseRes.exercises);
          }

          // 2. Fetch remote gym profiles
          const remoteGyms = await apiService.getGymProfiles();
          if (remoteGyms.length > 0) {
            // Map remote gyms to GymEnvironment
            const mappedGyms: GymEnvironment[] = remoteGyms.map((rg) => ({
              id: rg.id,
              name: rg.name,
              type: rg.environmentType || 'commercial',
              maxDumbbellWeightKg: rg.maxDumbbellWeightKg || 50,
              hasBarbellRack: rg.hasBarbell || rg.hasSquatRack,
              hasCableStack: rg.hasCableStack,
              hasSmithMachine: rg.hasSmithMachine,
              hasPullUpBar: rg.hasPullupBar,
            }));

            setProfile((prev) => {
              const updated = {
                ...prev,
                gymEnvironments: mappedGyms,
                activeGymId: mappedGyms[0]?.id || prev.activeGymId,
              };
              StorageService.saveProfile(updated);
              return updated;
            });
          } else if (currentProf && currentProf.gymEnvironments.length > 0) {
            // Push local default gym to backend
            const activeG = currentProf.gymEnvironments[0];
            await apiService.createGymProfile({
              name: activeG.name,
              environmentType: activeG.type,
              maxDumbbellWeightKg: activeG.maxDumbbellWeightKg,
              hasBarbell: activeG.hasBarbellRack,
              hasSquatRack: activeG.hasBarbellRack,
              hasCableStack: activeG.hasCableStack,
              hasSmithMachine: activeG.hasSmithMachine,
              hasPullupBar: activeG.hasPullUpBar,
              hasDumbbells: true,
              isDefault: true,
            });
          }

          // 3. Fetch remote constraints
          const remoteConstraints = await apiService.getConstraints();
          if (remoteConstraints.length > 0) {
            const blacklist = remoteConstraints.map(c => c.jointArea as JointContraindication);
            setProfile((prev) => {
              const updated = { ...prev, injuryBlacklist: blacklist };
              StorageService.saveProfile(updated);
              return updated;
            });
          }
        }
      }
    } catch (e) {
      console.warn('[BrunoContext] Backend sync notice:', e);
      setBackendConnected(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncWithBackend = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    await checkAndSyncBackend(profile);
  };

  const toggleTheme = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme).catch(() => {});
  };

  const colors = theme === 'dark' ? darkTheme : lightTheme;

  const activeGym = profile.gymEnvironments.find(g => g.id === profile.activeGymId) || profile.gymEnvironments[0];

  const todaySession = program 
    ? program.sessions.find(s => !s.isCompleted) || program.sessions[0] 
    : null;

  const weeklyReview = program 
    ? BrunoEngine.generateWeeklyReview(program.currentWeek, program.sessions)
    : null;

  const openSwapModal = (exercise: PrescribedExercise) => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    setSelectedExerciseForSwap(exercise);
  };

  const closeSwapModal = () => {
    setSelectedExerciseForSwap(null);
  };

  const executeExerciseSwap = (newExercise: ExerciseDefinition) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
    if (!program || !selectedExerciseForSwap) return;

    const updatedSessions = program.sessions.map(session => {
      const updatedExercises = session.exercises.map(ex => {
        if (ex.exerciseId === selectedExerciseForSwap.exerciseId) {
          return {
            ...ex,
            exerciseId: newExercise.id,
            name: newExercise.name,
            targetWeightKg: Math.min(ex.targetWeightKg, activeGym.maxDumbbellWeightKg || 50),
          };
        }
        return ex;
      });
      return { ...session, exercises: updatedExercises };
    });

    const updatedProgram = { ...program, sessions: updatedSessions };
    setProgram(updatedProgram);
    StorageService.saveProgram(updatedProgram);
    setSelectedExerciseForSwap(null);
    setMascotState('approving_nod');
  };

  const completeWorkout = (
    sessionId: string, 
    rpe: number, 
    jointSoreness: 'none' | 'mild' | 'moderate' | 'severe'
  ) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
    if (!program) return;

    const targetSession = program.sessions.find(s => s.id === sessionId);
    if (!targetSession) return;

    const nextSessions = BrunoEngine.applyProgressiveOverload(
      targetSession,
      program.sessions
    );

    const completedSessions = nextSessions.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          isCompleted: true,
          userRpeRating: rpe,
          jointSoreness: jointSoreness,
          completedAt: new Date().toISOString(),
          exercises: s.exercises.map(e => ({
            ...e,
            actualRepsAchieved: 10,
            actualWeightKg: e.targetWeightKg,
            isCompleted: true,
          })),
        };
      }
      return s;
    });

    const updatedProgram: ProgramBlock = {
      ...program,
      sessions: completedSessions,
    };

    setProgram(updatedProgram);
    StorageService.saveProgram(updatedProgram);
    setMascotState('proud_coach');
  };

  const switchGymProfile = (gymId: string) => {
    try {
      Haptics.selectionAsync();
    } catch (_) {}
    const updatedProfile = { ...profile, activeGymId: gymId };
    setProfile(updatedProfile);
    StorageService.saveProfile(updatedProfile);

    const regenerated = BrunoEngine.generateProgram(updatedProfile);
    setProgram(regenerated);
    StorageService.saveProgram(regenerated);
    setMascotState('studying_journal');
  };

  const finishOnboarding = async (configuredProfile: UserProfile) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
    const finalProfile = { ...configuredProfile, onboardingCompleted: true };
    setProfile(finalProfile);
    StorageService.saveProfile(finalProfile);

    const newProgram = BrunoEngine.generateProgram(finalProfile);
    setProgram(newProgram);
    StorageService.saveProgram(newProgram);
    setShowOnboarding(false);
    setActiveTab('today');
    setMascotState('approving_nod');

    // Async sync onboarding data to backend in background
    if (backendConnected) {
      try {
        const activeG = finalProfile.gymEnvironments.find(g => g.id === finalProfile.activeGymId) || finalProfile.gymEnvironments[0];
        if (activeG) {
          await apiService.createGymProfile({
            name: activeG.name,
            environmentType: activeG.type,
            maxDumbbellWeightKg: activeG.maxDumbbellWeightKg,
            hasBarbell: activeG.hasBarbellRack,
            hasSquatRack: activeG.hasBarbellRack,
            hasCableStack: activeG.hasCableStack,
            hasSmithMachine: activeG.hasSmithMachine,
            hasPullupBar: activeG.hasPullUpBar,
            hasDumbbells: true,
            isDefault: true,
          });
        }

        // Sync constraints
        for (const joint of finalProfile.injuryBlacklist) {
          await apiService.addConstraint(joint, `Restricted during onboarding for ${joint}`);
        }
      } catch (e) {
        console.warn('[BrunoContext] Background sync after onboarding notice:', e);
      }
    }
  };

  const resetApp = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
    StorageService.clearAll();
    setProfile(INITIAL_PROFILE);
    const prog = BrunoEngine.generateProgram(INITIAL_PROFILE);
    setProgram(prog);
    setShowOnboarding(true);
    setActiveTab('today');
  };

  return (
    <BrunoContext.Provider value={{
      profile,
      activeGym,
      program,
      todaySession,
      mascotState,
      activeTab,
      selectedExerciseForSwap,
      weeklyReview,
      theme,
      colors,
      showOnboarding,
      setShowOnboarding,
      startOnboarding,
      backendConnected,
      isSyncing,
      remoteExercises,
      syncWithBackend,
      toggleTheme,
      setActiveTab,
      setMascotState,
      openSwapModal,
      closeSwapModal,
      executeExerciseSwap,
      completeWorkout,
      switchGymProfile,
      finishOnboarding,
      resetApp,
    }}>
      {children}
    </BrunoContext.Provider>
  );
};

export const useBruno = () => {
  const context = useContext(BrunoContext);
  if (!context) {
    throw new Error('useBruno must be used within a BrunoProvider');
  }
  return context;
};
