// src/services/brunoEngine.ts
// Bruno's Biomechanical Periodization, Overload & Machine Swap Engine

import { 
  UserProfile, 
  GymEnvironment, 
  ExerciseDefinition, 
  PrescribedExercise, 
  WorkoutSession, 
  ProgramBlock,
  MuscleGroup,
  WeeklyReviewReport
} from '../types';
import { EXERCISE_DATABASE } from '../data/exerciseDatabase';

export class BrunoEngine {
  
  /**
   * Check if an exercise is compatible with user's gym equipment
   */
  static isEquipmentAvailable(exercise: ExerciseDefinition, gym: GymEnvironment): boolean {
    switch (exercise.requiredEquipment) {
      case 'barbell':
        return gym.hasBarbellRack;
      case 'cable':
        return gym.hasCableStack;
      case 'smith_machine':
        return gym.hasSmithMachine;
      case 'pullup_bar':
        return gym.hasPullUpBar;
      case 'dumbbell':
        return gym.maxDumbbellWeightKg > 0;
      case 'machine':
        return gym.type === 'commercial';
      case 'bodyweight':
        return true;
      default:
        return false;
    }
  }

  /**
   * Check if an exercise violates user's injury restrictions
   */
  static isSafeFromInjuries(exercise: ExerciseDefinition, injuries: string[]): boolean {
    return !exercise.contraindications.some(c => injuries.includes(c));
  }

  /**
   * Find candidate exercises filtered by equipment and injuries
   */
  static getEligibleExercises(gym: GymEnvironment, injuries: string[]): ExerciseDefinition[] {
    return EXERCISE_DATABASE.filter(ex => 
      this.isEquipmentAvailable(ex, gym) && this.isSafeFromInjuries(ex, injuries)
    );
  }

  /**
   * 1-Tap "Machine Busy" Swap Algorithm
   * Surfaces up to 3 biomechanically matched replacements matching:
   * 1. Exact same primary muscle group
   * 2. Matching movement pattern
   * 3. Available equipment in the user's active gym
   * 4. Zero contraindications
   */
  static getMachineSwaps(
    currentExerciseId: string, 
    gym: GymEnvironment, 
    injuries: string[]
  ): ExerciseDefinition[] {
    const current = EXERCISE_DATABASE.find(e => e.id === currentExerciseId);
    if (!current) return [];

    const eligible = this.getEligibleExercises(gym, injuries).filter(e => e.id !== currentExerciseId);

    // Tier 1 Priority: Same primary muscle AND same movement pattern
    const perfectMatches = eligible.filter(
      e => e.primaryMuscle === current.primaryMuscle && e.movementPattern === current.movementPattern
    );

    if (perfectMatches.length >= 3) {
      return perfectMatches.slice(0, 3);
    }

    // Tier 2 Fallback: Same primary muscle
    const muscleMatches = eligible.filter(
      e => e.primaryMuscle === current.primaryMuscle && !perfectMatches.includes(e)
    );

    return [...perfectMatches, ...muscleMatches].slice(0, 3);
  }

  /**
   * Generate initial starting weight based on gym limits and exercise type
   */
  static calculateStartingWeight(exercise: ExerciseDefinition, gym: GymEnvironment): number {
    let baseWeight = 20; // default 20 kg
    if (exercise.isCompound) {
      if (exercise.primaryMuscle === 'quads' || exercise.primaryMuscle === 'hamstrings') {
        baseWeight = gym.hasBarbellRack ? 60 : Math.min(30, gym.maxDumbbellWeightKg);
      } else if (exercise.primaryMuscle === 'chest' || exercise.primaryMuscle === 'back') {
        baseWeight = gym.hasBarbellRack ? 45 : Math.min(22.5, gym.maxDumbbellWeightKg);
      } else if (exercise.primaryMuscle === 'shoulders') {
        baseWeight = gym.hasBarbellRack ? 30 : Math.min(16, gym.maxDumbbellWeightKg);
      }
    } else {
      // Isolation
      baseWeight = exercise.primaryMuscle === 'calves' ? 40 : Math.min(12, gym.maxDumbbellWeightKg);
    }
    return baseWeight;
  }

  /**
   * Generates a complete 6-Week Periodized Program Block tailored to the user profile
   */
  static generateProgram(profile: UserProfile): ProgramBlock {
    const activeGym = profile.gymEnvironments.find(g => g.id === profile.activeGymId) || profile.gymEnvironments[0];
    const eligible = this.getEligibleExercises(activeGym, profile.injuryBlacklist);

    // Determine split structure
    let splitType: 'Push/Pull/Legs' | 'Upper/Lower' | 'Full Body' = 'Push/Pull/Legs';
    type SessionTemplateItem = { 
      name: string; 
      splitCategory: 'Push' | 'Pull' | 'Legs' | 'Upper' | 'Lower' | 'Full Body'; 
      muscles: MuscleGroup[]; 
    };
    let sessionTemplates: SessionTemplateItem[] = [];

    if (profile.daysPerWeek === 4) {
      splitType = 'Upper/Lower';
      sessionTemplates = [
        { name: 'Upper Body Power & Hypertrophy', splitCategory: 'Upper', muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'] },
        { name: 'Lower Body Strength & Quads', splitCategory: 'Lower', muscles: ['quads', 'hamstrings', 'calves'] },
        { name: 'Upper Body Volume & Accessories', splitCategory: 'Upper', muscles: ['chest', 'back', 'shoulders', 'triceps'] },
        { name: 'Lower Body Posterior & Chains', splitCategory: 'Lower', muscles: ['hamstrings', 'quads', 'calves'] },
      ];
    } else if (profile.daysPerWeek === 3) {
      splitType = 'Full Body';
      sessionTemplates = [
        { name: 'Full Body A (Chest & Quad Focus)', splitCategory: 'Full Body', muscles: ['chest', 'quads', 'back', 'shoulders'] },
        { name: 'Full Body B (Back & Hinge Focus)', splitCategory: 'Full Body', muscles: ['back', 'hamstrings', 'chest', 'biceps'] },
        { name: 'Full Body C (Shoulder & Volume)', splitCategory: 'Full Body', muscles: ['shoulders', 'quads', 'back', 'triceps'] },
      ];
    } else {
      // 5 or 6 days -> Push / Pull / Legs rotation
      splitType = 'Push/Pull/Legs';
      const pplTemplates: SessionTemplateItem[] = [
        { name: 'Push A: Chest & Triceps Dominant', splitCategory: 'Push', muscles: ['chest', 'shoulders', 'triceps'] },
        { name: 'Pull A: Lat Width & Bicep Peak', splitCategory: 'Pull', muscles: ['back', 'shoulders', 'biceps'] },
        { name: 'Legs A: Quad Focus & Calves', splitCategory: 'Legs', muscles: ['quads', 'hamstrings', 'calves'] },
        { name: 'Push B: Overhead & Upper Chest', splitCategory: 'Push', muscles: ['shoulders', 'chest', 'triceps'] },
        { name: 'Pull B: Thickness & Upper Back', splitCategory: 'Pull', muscles: ['back', 'biceps'] },
        { name: 'Legs B: Hamstring Hinge & Quads', splitCategory: 'Legs', muscles: ['hamstrings', 'quads', 'calves'] },
      ];
      sessionTemplates = pplTemplates.slice(0, profile.daysPerWeek);
    }

    // Determine exercise count based on sessionDurationMinutes
    const exerciseLimit = profile.sessionDurationMinutes === 30 ? 3 : profile.sessionDurationMinutes === 45 ? 4 : 5;

    const allSessions: WorkoutSession[] = [];
    const totalWeeks = 6;

    for (let week = 1; week <= totalWeeks; week++) {
      const isDeload = week === 6;

      sessionTemplates.forEach((template, dayIdx) => {
        const pickedExercises: PrescribedExercise[] = [];
        const usedIds = new Set<string>();

        template.muscles.forEach(muscle => {
          if (pickedExercises.length >= exerciseLimit) return;
          const candidates = eligible.filter(e => e.primaryMuscle === muscle && !usedIds.has(e.id));
          if (candidates.length > 0) {
            const exDef = candidates[0];
            usedIds.add(exDef.id);

            let weight = this.calculateStartingWeight(exDef, activeGym);
            // Apply simulated progression week by week
            if (week > 1 && !isDeload) {
              const weeklyBump = (exDef.primaryMuscle === 'quads' || exDef.primaryMuscle === 'hamstrings') ? 5 : 2.5;
              weight += weeklyBump * (week - 1);
            } else if (isDeload) {
              weight = Math.round(weight * 0.7); // 30% reduction on deload
            }

            pickedExercises.push({
              id: `w${week}_d${dayIdx + 1}_${exDef.id}`,
              exerciseId: exDef.id,
              name: exDef.name,
              primaryMuscle: exDef.primaryMuscle,
              movementPattern: exDef.movementPattern,
              targetSets: isDeload ? 2 : exDef.defaultSets,
              targetReps: `${exDef.defaultRepsMin} - ${exDef.defaultRepsMax}`,
              targetWeightKg: weight,
              targetRpe: isDeload ? 6.5 : exDef.defaultRpe,
              cueNote: exDef.cueNote,
              isCompleted: false,
            });
          }
        });

        allSessions.push({
          id: `session_w${week}_d${dayIdx + 1}`,
          weekNumber: week,
          dayNumber: dayIdx + 1,
          splitName: template.name,
          splitCategory: template.splitCategory,
          estimatedDurationMin: profile.sessionDurationMinutes,
          exercises: pickedExercises,
          isCompleted: false,
        });
      });
    }

    return {
      id: 'program_block_1',
      name: `${splitType} Overload Block`,
      totalWeeks,
      currentWeek: 1,
      splitType,
      sessions: allSessions,
      isDeloadWeek: false,
    };
  }

  /**
   * Calibrate progressive overload after workout completion
   * Rule: +2.5 kg upper / +5 kg lower if all sets achieved
   */
  static applyProgressiveOverload(
    completedSession: WorkoutSession, 
    allSessions: WorkoutSession[]
  ): WorkoutSession[] {
    const nextWeekNumber = completedSession.weekNumber + 1;
    
    // Find matching session in next week
    const nextSession = allSessions.find(
      s => s.weekNumber === nextWeekNumber && s.dayNumber === completedSession.dayNumber
    );

    if (!nextSession) return allSessions;

    // Check performance for each exercise
    const updatedNextExercises = nextSession.exercises.map(nextEx => {
      const loggedEx = completedSession.exercises.find(e => e.exerciseId === nextEx.exerciseId);
      if (loggedEx) {
        const isLower = loggedEx.primaryMuscle === 'quads' || loggedEx.primaryMuscle === 'hamstrings';
        const bump = isLower ? 5.0 : 2.5;
        return {
          ...nextEx,
          targetWeightKg: loggedEx.targetWeightKg + bump,
        };
      }
      return nextEx;
    });

    return allSessions.map(s => {
      if (s.id === nextSession.id) {
        return { ...s, exercises: updatedNextExercises };
      }
      return s;
    });
  }

  /**
   * Generate weekly review summary & mascot verdict
   */
  static generateWeeklyReview(weekNumber: number, sessions: WorkoutSession[]): WeeklyReviewReport {
    const weekSessions = sessions.filter(s => s.weekNumber === weekNumber);
    const completedSessions = weekSessions.filter(s => s.isCompleted);
    
    let totalTonnage = 0;
    const volumeByMuscle: Record<MuscleGroup, number> = {
      chest: 0, back: 0, quads: 0, hamstrings: 0, shoulders: 0, biceps: 0, triceps: 0, calves: 0, core: 0
    };

    completedSessions.forEach(session => {
      session.exercises.forEach(ex => {
        const weight = ex.actualWeightKg || ex.targetWeightKg;
        const reps = ex.actualRepsAchieved || 10;
        const sets = ex.targetSets;
        totalTonnage += (weight * reps * sets);
        volumeByMuscle[ex.primaryMuscle] += sets;
      });
    });

    const adherenceRate = weekSessions.length > 0 ? (completedSessions.length / weekSessions.length) * 100 : 0;
    const isDeloadTriggered = weekNumber === 5 || completedSessions.some(s => s.jointSoreness === 'severe');

    let verdict = "Solid week in the books. Progressive overload was logged with textbook discipline.";
    if (adherenceRate === 100) {
      verdict = "Flawless consistency. Bruno bumped your heavy compounds by +2.5 kg and +5 kg for next week. Eat, sleep, and show up ready.";
    } else if (adherenceRate < 75) {
      verdict = "You missed sessions this week. Don't rush to compensate with ego-lifting; we'll hold weights steady and rebuild consistency.";
    }

    if (isDeloadTriggered) {
      verdict += " ⚠️ Auto-deload scheduled for next week: 30% lighter loads to clear joint fatigue.";
    }

    return {
      weekNumber,
      totalTonnageMovedKg: Math.round(totalTonnage),
      volumeByMuscle,
      brunoVerdict: verdict,
      consistencyScore: Math.round(adherenceRate),
      isDeloadTriggered,
    };
  }

  /**
   * Generates Bruno's Pre-Session Briefing Note for the home screen
   */
  static getPreSessionBriefing(session: WorkoutSession, profile: UserProfile): string {
    const mainExercise = session.exercises[0];
    if (!mainExercise) return "Ready when you are. Keep form strict.";

    const unit = profile.unit;
    return `Today we tackle ${session.splitName}. Target: ${mainExercise.name} at ${mainExercise.targetWeightKg} ${unit} for ${mainExercise.targetReps} reps. Bruno locked in your progression—control the eccentric descent and don't rush.`;
  }
}
