// src/theme/theme.ts
// Clucky / Amble style design tokens with curated Light and Dark modes

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  mode: ThemeMode;
  // Backgrounds
  background: string;
  surface: string;
  surfaceSubtle: string;
  surfaceElevated: string;
  surfaceCard: string;
  
  // Borders
  border: string;
  borderStrong: string;
  borderHighlight: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverted: string;
  
  // Brand & Accents
  amber: string;
  amberLight: string;
  amberDark: string;
  amberGlow: string;
  
  // Feedback
  success: string;
  successBg: string;
  danger: string;
  dangerBg: string;
  info: string;
  infoBg: string;
  
  // Special UI
  chalkNoteBg: string;
  chalkBorder: string;
  tabBarBg: string;
  tabBarBorder: string;
  cardShadow: string;
}

export const darkTheme: ThemeColors = {
  mode: 'dark',
  background: '#07090E',
  surface: '#0E131F',
  surfaceSubtle: '#141B2D',
  surfaceElevated: '#1A233A',
  surfaceCard: '#101626',
  
  border: '#1E293B',
  borderStrong: '#334155',
  borderHighlight: 'rgba(245, 158, 11, 0.4)',
  
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverted: '#07090E',
  
  amber: '#F59E0B',
  amberLight: '#FDE68A',
  amberDark: '#D97706',
  amberGlow: 'rgba(245, 158, 11, 0.18)',
  
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.12)',
  danger: '#EF4444',
  dangerBg: 'rgba(239, 68, 68, 0.14)',
  info: '#3B82F6',
  infoBg: 'rgba(59, 130, 246, 0.14)',
  
  chalkNoteBg: '#131A2B',
  chalkBorder: '#2E3D5B',
  tabBarBg: 'rgba(14, 19, 31, 0.94)',
  tabBarBorder: 'rgba(30, 41, 59, 0.8)',
  cardShadow: 'rgba(0, 0, 0, 0.5)',
};

export const lightTheme: ThemeColors = {
  mode: 'light',
  background: '#F6F8FC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F4F9',
  surfaceElevated: '#E8EDF5',
  surfaceCard: '#FFFFFF',
  
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  borderHighlight: 'rgba(217, 119, 6, 0.4)',
  
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverted: '#FFFFFF',
  
  amber: '#D97706',
  amberLight: '#FEF3C7',
  amberDark: '#B45309',
  amberGlow: 'rgba(217, 119, 6, 0.14)',
  
  success: '#059669',
  successBg: 'rgba(16, 185, 129, 0.10)',
  danger: '#DC2626',
  dangerBg: 'rgba(239, 68, 68, 0.10)',
  info: '#2563EB',
  infoBg: 'rgba(37, 99, 235, 0.10)',
  
  chalkNoteBg: '#FFFBEB',
  chalkBorder: '#FDE68A',
  tabBarBg: 'rgba(255, 255, 255, 0.94)',
  tabBarBorder: 'rgba(226, 232, 240, 0.9)',
  cardShadow: 'rgba(15, 23, 42, 0.08)',
};
