// src/services/storageService.ts
// Offline-First Persistent Storage using AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, ProgramBlock } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: '@bruno_user_profile',
  PROGRAM_BLOCK: '@bruno_program_block',
  COMPLETED_SESSIONS: '@bruno_completed_sessions',
};

export class StorageService {
  static async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('AsyncStorage saveProfile failed, using fallback', e);
    }
  }

  static async loadProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('AsyncStorage loadProfile failed', e);
      return null;
    }
  }

  static async saveProgram(program: ProgramBlock): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROGRAM_BLOCK, JSON.stringify(program));
    } catch (e) {
      console.warn('AsyncStorage saveProgram failed', e);
    }
  }

  static async loadProgram(): Promise<ProgramBlock | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRAM_BLOCK);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('AsyncStorage loadProgram failed', e);
      return null;
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_PROFILE,
        STORAGE_KEYS.PROGRAM_BLOCK,
        STORAGE_KEYS.COMPLETED_SESSIONS
      ]);
    } catch (e) {
      console.warn('AsyncStorage clearAll failed', e);
    }
  }
}
