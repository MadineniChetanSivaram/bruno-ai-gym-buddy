// src/context/BrunoContext.tsx
// Global State Context for Bruno AI Gym Buddy with Dynamic Light / Dark Theming

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
  WeeklyReviewReport 
} from '../types';
import { BrunoEngine } from '../services/brunoEngine';
import { StorageService } from '../services/storageService';
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

  // Load theme and saved state
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

      if (savedProfile && savedProfile.onboardingCompleted && savedProgram) {
        setProfile(savedProfile);
        setProgram(savedProgram);
      } else {
        const defaultProg = BrunoEngine.generateProgram(INITIAL_PROFILE);
        setProgram(defaultProg);
      }
    }
    init();
  }, []);

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

  const finishOnboarding = (configuredProfile: UserProfile) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
    const finalProfile = { ...configuredProfile, onboardingCompleted: true };
    setProfile(finalProfile);
    StorageService.saveProfile(finalProfile);

    const newProgram = BrunoEngine.generateProgram(finalProfile);
    setProgram(newProgram);
    StorageService.saveProgram(newProgram);
    setActiveTab('today');
    setMascotState('approving_nod');
  };

  const resetApp = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
    StorageService.clearAll();
    setProfile(INITIAL_PROFILE);
    const prog = BrunoEngine.generateProgram(INITIAL_PROFILE);
    setProgram(prog);
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
