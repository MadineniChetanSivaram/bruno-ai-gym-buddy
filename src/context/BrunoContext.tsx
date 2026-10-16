// src/context/BrunoContext.tsx
// Global State Context for Bruno AI Gym Buddy

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  // Initialize from storage or generate default
  useEffect(() => {
    async function init() {
      const savedProfile = await StorageService.loadProfile();
      const savedProgram = await StorageService.loadProgram();

      if (savedProfile && savedProfile.onboardingCompleted && savedProgram) {
        setProfile(savedProfile);
        setProgram(savedProgram);
      } else {
        // Generate pre-loaded program for instant demonstration
        const defaultProg = BrunoEngine.generateProgram(INITIAL_PROFILE);
        setProgram(defaultProg);
      }
    }
    init();
  }, []);

  const activeGym = profile.gymEnvironments.find(g => g.id === profile.activeGymId) || profile.gymEnvironments[0];

  // Active workout session for current week & day
  const todaySession = program 
    ? program.sessions.find(s => !s.isCompleted) || program.sessions[0] 
    : null;

  // Weekly review report
  const weeklyReview = program 
    ? BrunoEngine.generateWeeklyReview(program.currentWeek, program.sessions)
    : null;

  const openSwapModal = (exercise: PrescribedExercise) => {
    setSelectedExerciseForSwap(exercise);
  };

  const closeSwapModal = () => {
    setSelectedExerciseForSwap(null);
  };

  const executeExerciseSwap = (newExercise: ExerciseDefinition) => {
    if (!program || !todaySession || !selectedExerciseForSwap) return;

    const updatedExercises = todaySession.exercises.map(ex => {
      if (ex.id === selectedExerciseForSwap.id) {
        return {
          ...ex,
          exerciseId: newExercise.id,
          name: newExercise.name,
          primaryMuscle: newExercise.primaryMuscle,
          movementPattern: newExercise.movementPattern,
          targetWeightKg: BrunoEngine.calculateStartingWeight(newExercise, activeGym),
          cueNote: newExercise.cueNote,
        };
      }
      return ex;
    });

    const updatedSessions = program.sessions.map(s => {
      if (s.id === todaySession.id) {
        return { ...s, exercises: updatedExercises };
      }
      return s;
    });

    const updatedProgram = { ...program, sessions: updatedSessions };
    setProgram(updatedProgram);
    StorageService.saveProgram(updatedProgram);
    closeSwapModal();
    setMascotState('approving_nod');
  };

  const completeWorkout = (
    sessionId: string, 
    rpe: number, 
    jointSoreness: 'none' | 'mild' | 'moderate' | 'severe'
  ) => {
    if (!program) return;

    // 1. Mark session as completed with recovery metrics
    const updatedSessions = program.sessions.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          isCompleted: true,
          completedAt: new Date().toISOString(),
          userRpeRating: rpe,
          jointSoreness,
        };
      }
      return s;
    });

    const justCompletedSession = updatedSessions.find(s => s.id === sessionId);

    // 2. Trigger Bruno's Automated Progressive Overload Engine (+2.5 kg / +5 kg)
    let calibratedSessions = updatedSessions;
    if (justCompletedSession) {
      calibratedSessions = BrunoEngine.applyProgressiveOverload(justCompletedSession, updatedSessions);
    }

    const updatedProgram = { ...program, sessions: calibratedSessions };
    setProgram(updatedProgram);
    StorageService.saveProgram(updatedProgram);

    // 3. Update Mascot state
    setMascotState('proud_coach');
  };

  const switchGymProfile = (gymId: string) => {
    const updatedProfile = { ...profile, activeGymId: gymId };
    setProfile(updatedProfile);
    StorageService.saveProfile(updatedProfile);

    // Regenerate program calibrated to new hardware
    const regenerated = BrunoEngine.generateProgram(updatedProfile);
    setProgram(regenerated);
    StorageService.saveProgram(regenerated);
    setMascotState('studying_journal');
  };

  const finishOnboarding = (configuredProfile: UserProfile) => {
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
