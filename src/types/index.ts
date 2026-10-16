// src/types/index.ts
// Bruno — AI Gym Buddy Core Domain Types

export type WeightUnit = 'kg' | 'lbs';

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'quads' 
  | 'hamstrings' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'calves' 
  | 'core';

export type MovementPattern = 
  | 'horizontal_push' 
  | 'vertical_push' 
  | 'horizontal_pull' 
  | 'vertical_pull' 
  | 'squat' 
  | 'hinge' 
  | 'lunge' 
  | 'isolation';

export type EquipmentRequirement = 
  | 'barbell' 
  | 'dumbbell' 
  | 'cable' 
  | 'smith_machine' 
  | 'pullup_bar' 
  | 'bodyweight' 
  | 'machine';

export type JointContraindication = 
  | 'lower_back' 
  | 'shoulder' 
  | 'knee' 
  | 'wrist'
  | 'elbow';

export interface GymEnvironment {
  id: string;
  name: string;
  type: 'commercial' | 'apartment' | 'home';
  maxDumbbellWeightKg: number;
  hasBarbellRack: boolean;
  hasCableStack: boolean;
  hasSmithMachine: boolean;
  hasPullUpBar: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  unit: WeightUnit;
  activeGymId: string;
  gymEnvironments: GymEnvironment[];
  injuryBlacklist: JointContraindication[];
  daysPerWeek: 3 | 4 | 5 | 6;
  sessionDurationMinutes: 30 | 45 | 60;
  onboardingCompleted: boolean;
  currentStreakWeeks: number;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  movementPattern: MovementPattern;
  requiredEquipment: EquipmentRequirement;
  contraindications: JointContraindication[];
  defaultRepsMin: number;
  defaultRepsMax: number;
  defaultSets: number;
  defaultRpe: number;
  isCompound: boolean;
  cueNote: string;
}

export interface PrescribedExercise {
  id: string;
  exerciseId: string;
  name: string;
  primaryMuscle: MuscleGroup;
  movementPattern: MovementPattern;
  targetSets: number;
  targetReps: string; // e.g., "8 - 10"
  targetWeightKg: number;
  targetRpe: number;
  cueNote: string;
  isCompleted?: boolean;
  actualWeightKg?: number;
  actualRepsAchieved?: number;
}

export interface WorkoutSession {
  id: string;
  weekNumber: number;
  dayNumber: number;
  splitName: string; // e.g. "Push Strength & Hypertrophy"
  splitCategory: 'Push' | 'Pull' | 'Legs' | 'Upper' | 'Lower' | 'Full Body';
  estimatedDurationMin: number;
  exercises: PrescribedExercise[];
  isCompleted: boolean;
  completedAt?: string;
  userRpeRating?: number; // 1 to 10
  jointSoreness?: 'none' | 'mild' | 'moderate' | 'severe';
  sessionNotes?: string;
}

export interface ProgramBlock {
  id: string;
  name: string; // e.g. "Hypertrophy & Overload Block 1"
  totalWeeks: number; // 4 to 6 weeks
  currentWeek: number;
  splitType: 'Push/Pull/Legs' | 'Upper/Lower' | 'Full Body';
  sessions: WorkoutSession[];
  isDeloadWeek: boolean;
}

export type MascotState = 
  | 'studying_journal' 
  | 'approving_nod' 
  | 'chalking_up' 
  | 'waiting_watch' 
  | 'proud_coach';

export interface WeeklyReviewReport {
  weekNumber: number;
  totalTonnageMovedKg: number;
  volumeByMuscle: Record<MuscleGroup, number>;
  brunoVerdict: string;
  consistencyScore: number; // 0 to 100%
  isDeloadTriggered: boolean;
}
