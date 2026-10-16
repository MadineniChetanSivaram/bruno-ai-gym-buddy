// src/services/apiService.ts
// Robust API client integrating Bruno AI Gym Buddy with the live Fastify + PostgreSQL Backend
// Docs: https://ds3xeksdqbnoqesxabywgrke.167.233.97.217.sslip.io/docs

import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  GymEnvironment, 
  JointContraindication, 
  ExerciseDefinition, 
  MuscleGroup, 
  MovementPattern, 
  EquipmentRequirement 
} from '../types';

export const API_BASE_URL = 'https://ds3xeksdqbnoqesxabywgrke.167.233.97.217.sslip.io';

const STORAGE_KEYS = {
  TOKEN: '@bruno_jwt_token',
  REFRESH_TOKEN: '@bruno_refresh_token',
  USER_DATA: '@bruno_auth_user',
};

export interface BackendUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  created_at: string;
}

export interface BackendGymProfile {
  id: string;
  userId: string;
  name: string;
  environmentType: 'commercial' | 'apartment' | 'home';
  maxDumbbellWeightKg: number | null;
  hasBarbell: boolean;
  hasSquatRack: boolean;
  hasBench: boolean;
  hasCableStack: boolean;
  hasSmithMachine: boolean;
  hasPullupBar: boolean;
  hasAdjustableBench: boolean;
  hasDumbbells: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendConstraint {
  id: string;
  userId: string;
  jointArea: string;
  restrictionType: string;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface BackendExercise {
  id: string;
  name: string;
  primaryMuscleGroup: string;
  secondaryMuscleGroups: string[];
  movementPattern: string;
  requiredEquipment: string;
  contraindicatedInjuries: string[];
  instructions?: string;
}

export interface ExerciseFilterMeta {
  totalAvailable: number;
  totalMatched: number;
  excludedByEquipment: number;
  excludedByContraindications: number;
  equipmentProfileApplied: string | null;
  activeConstraintsApplied: string[];
  disclaimer?: string;
}

class ApiService {
  private token: string | null = null;
  private refreshTokenVal: string | null = null;
  private user: BackendUser | null = null;
  private isOnline: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.loadStoredAuth();
  }

  private async loadStoredAuth(): Promise<void> {
    try {
      const [token, refreshToken, userData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
      ]);

      if (token) this.token = token;
      if (refreshToken) this.refreshTokenVal = refreshToken;
      if (userData) this.user = JSON.parse(userData);
    } catch (e) {
      console.warn('[ApiService] Failed to load stored credentials', e);
    }
  }

  /**
   * Check backend health and readiness
   */
  async checkHealth(): Promise<{ ok: boolean; status?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, {
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        this.isOnline = true;
        return { ok: true, status: data.data?.status || 'ok' };
      }
      return { ok: false };
    } catch (e) {
      this.isOnline = false;
      return { ok: false };
    }
  }

  get online(): boolean {
    return this.isOnline;
  }

  /**
   * Ensures an active authenticated session exists.
   * If not logged in, registers/authenticates automatically with a durable guest lifter account.
   */
  async ensureAuthenticated(): Promise<boolean> {
    await this.initPromise;

    if (this.token) {
      return true;
    }

    try {
      // Auto-register or authenticate unique device account
      let deviceId = await AsyncStorage.getItem('@bruno_device_id');
      if (!deviceId) {
        deviceId = 'lifter_' + Math.random().toString(36).substring(2, 10);
        await AsyncStorage.setItem('@bruno_device_id', deviceId);
      }

      const email = `${deviceId}@bruno-gym.app`;
      const password = `BrunoAuth#2026_${deviceId}`;

      // Try login first
      const loginRes = await this.login(email, password);
      if (loginRes.success) return true;

      // If login fails (user does not exist), register
      const regRes = await this.register(email, password, 'Alex Hunter');
      return regRes.success;
    } catch (e) {
      console.warn('[ApiService] ensureAuthenticated error', e);
      return false;
    }
  }

  /**
   * User Registration
   */
  async register(email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        this.token = data.data.token;
        this.refreshTokenVal = data.data.refreshToken;
        this.user = data.data.user;

        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.TOKEN, this.token!),
          AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, this.refreshTokenVal!),
          AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(this.user)),
        ]);
        this.isOnline = true;
        return { success: true };
      }

      return { success: false, error: data.error?.message || 'Registration failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  }

  /**
   * User Login
   */
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        this.token = data.data.token;
        this.refreshTokenVal = data.data.refreshToken;
        this.user = data.data.user;

        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.TOKEN, this.token!),
          AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, this.refreshTokenVal!),
          AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(this.user)),
        ]);
        this.isOnline = true;
        return { success: true };
      }

      return { success: false, error: data.error?.message || 'Login failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  }

  /**
   * Token refresh rotation
   */
  async refreshToken(): Promise<boolean> {
    if (!this.refreshTokenVal) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshTokenVal }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        this.token = data.data.token;
        this.refreshTokenVal = data.data.refreshToken;
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.TOKEN, this.token!),
          AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, this.refreshTokenVal!),
        ]);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /**
   * Helper for authenticated fetch with automatic 401 token refresh
   */
  private async authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    await this.ensureAuthenticated();

    const headers = new Headers(options.headers || {});
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }
    headers.set('Content-Type', 'application/json');

    let res = await fetch(url, { ...options, headers });

    // Handle expired token with 1 retry
    if (res.status === 401 && this.refreshTokenVal) {
      const refreshed = await this.refreshToken();
      if (refreshed && this.token) {
        headers.set('Authorization', `Bearer ${this.token}`);
        res = await fetch(url, { ...options, headers });
      }
    }

    return res;
  }

  // ==========================================
  // GYM PROFILES API
  // ==========================================

  async getGymProfiles(): Promise<BackendGymProfile[]> {
    try {
      const res = await this.authFetch(`${API_BASE_URL}/api/v1/gym-profiles`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.warn('[ApiService] getGymProfiles failed', e);
      return [];
    }
  }

  async createGymProfile(profile: Partial<BackendGymProfile>): Promise<BackendGymProfile | null> {
    try {
      const res = await this.authFetch(`${API_BASE_URL}/api/v1/gym-profiles`, {
        method: 'POST',
        body: JSON.stringify(profile),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch (e) {
      console.warn('[ApiService] createGymProfile failed', e);
      return null;
    }
  }

  async updateGymProfile(id: string, profile: Partial<BackendGymProfile>): Promise<BackendGymProfile | null> {
    try {
      const res = await this.authFetch(`${API_BASE_URL}/api/v1/gym-profiles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch (e) {
      console.warn('[ApiService] updateGymProfile failed', e);
      return null;
    }
  }

  async deleteGymProfile(id: string): Promise<boolean> {
    try {
      const res = await this.authFetch(`${API_BASE_URL}/api/v1/gym-profiles/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  // ==========================================
  // PHYSICAL CONSTRAINTS API
  // ==========================================

  async getConstraints(): Promise<BackendConstraint[]> {
    try {
      const res = await this.authFetch(`${API_BASE_URL}/api/v1/constraints`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.warn('[ApiService] getConstraints failed', e);
      return [];
    }
  }

  async addConstraint(jointArea: string, notes?: string): Promise<BackendConstraint | null> {
    try {
      const res = await this.authFetch(`${API_BASE_URL}/api/v1/constraints`, {
        method: 'POST',
        body: JSON.stringify({
          jointArea,
          restrictionType: 'pain',
          notes: notes || `Protected by Bruno AI for ${jointArea}`,
        }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch (e) {
      console.warn('[ApiService] addConstraint failed', e);
      return null;
    }
  }

  async deleteConstraint(id: string): Promise<boolean> {
    try {
      const res = await this.authFetch(`${API_BASE_URL}/api/v1/constraints/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  // ==========================================
  // EXERCISES & CONSTRAINT-AWARE FILTERING API
  // ==========================================

  /**
   * Fetches exercises from backend with algorithmic constraint & equipment filtering
   */
  async getExercises(params?: {
    gymProfileId?: string;
    movementPattern?: string;
    primaryMuscleGroup?: string;
  }): Promise<{ exercises: ExerciseDefinition[]; meta?: ExerciseFilterMeta }> {
    try {
      const query = new URLSearchParams();
      if (params?.gymProfileId) query.set('gymProfileId', params.gymProfileId);
      if (params?.movementPattern) query.set('movementPattern', params.movementPattern);
      if (params?.primaryMuscleGroup) query.set('primaryMuscleGroup', params.primaryMuscleGroup);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await this.authFetch(`${API_BASE_URL}/api/v1/exercises${qs}`);
      
      if (!res.ok) {
        return { exercises: [] };
      }

      const json = await res.json();
      const rawList: BackendExercise[] = json.data || [];

      // Map backend schema to app's ExerciseDefinition
      const mapped: ExerciseDefinition[] = rawList.map((item) => {
        return {
          id: item.id,
          name: item.name,
          primaryMuscle: (item.primaryMuscleGroup as MuscleGroup) || 'chest',
          movementPattern: (item.movementPattern as MovementPattern) || 'horizontal_push',
          requiredEquipment: (item.requiredEquipment as EquipmentRequirement) || 'dumbbell',
          contraindications: (item.contraindicatedInjuries || []) as JointContraindication[],
          defaultRepsMin: 8,
          defaultRepsMax: 12,
          defaultSets: 3,
          defaultRpe: 8,
          isCompound: true,
          cueNote: item.instructions || 'Controlled tempo, mind-muscle connection.',
        };
      });

      return {
        exercises: mapped,
        meta: json.meta,
      };
    } catch (e) {
      console.warn('[ApiService] getExercises failed', e);
      return { exercises: [] };
    }
  }
}

export const apiService = new ApiService();
