// src/theme/theme.ts
// Bruno design tokens matching the exact terracotta / warm ivory mobile design template

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
  
  // Brand Terracotta Accents
  amber: string;          // Terracotta / Burnt Orange
  amberLight: string;     // Soft Peach / Creamy Orange
  amberDark: string;      // Deep Rust
  amberGlow: string;      // Soft Glow
  
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

export const lightTheme: ThemeColors = {
  mode: 'light',
  background: '#FAF6F0',         // Warm sand / ivory paper
  surface: '#FFFFFF',            // Crisp card surface
  surfaceSubtle: '#F4ECE1',      // Subdued container
  surfaceElevated: '#EDE4D6',
  surfaceCard: '#FFFFFF',
  
  border: '#EFE6D8',            // Soft warm border
  borderStrong: '#DFCFC0',
  borderHighlight: '#D9572B',   // Terracotta orange
  
  textPrimary: '#1E1915',        // Deep warm charcoal
  textSecondary: '#6B6055',      // Medium warm slate
  textMuted: '#9B9085',
  textInverted: '#FFFFFF',
  
  amber: '#D9572B',              // Terracotta brand orange
  amberLight: '#FFF0EB',         // Peach highlight
  amberDark: '#BD461D',
  amberGlow: 'rgba(217, 87, 43, 0.12)',
  
  success: '#2E8540',
  successBg: '#EAF5EC',
  danger: '#D9381E',
  dangerBg: '#FDF0ED',
  info: '#2563EB',
  infoBg: '#EFF6FF',
  
  chalkNoteBg: '#FFFDF9',
  chalkBorder: '#EFE4D6',
  tabBarBg: 'rgba(255, 255, 255, 0.96)',
  tabBarBorder: '#EFE6D8',
  cardShadow: 'rgba(50, 35, 20, 0.06)',
};

export const darkTheme: ThemeColors = {
  mode: 'dark',
  background: '#121110',         // Deep warm obsidian
  surface: '#1A1816',
  surfaceSubtle: '#23201C',
  surfaceElevated: '#2C2824',
  surfaceCard: '#1E1C1A',
  
  border: '#2F2B26',
  borderStrong: '#443F39',
  borderHighlight: '#E0683E',
  
  textPrimary: '#FBF8F4',
  textSecondary: '#A9A097',
  textMuted: '#746D66',
  textInverted: '#121110',
  
  amber: '#E0683E',              // Warm glowing terracotta
  amberLight: '#3D251D',
  amberDark: '#C9532A',
  amberGlow: 'rgba(224, 104, 62, 0.18)',
  
  success: '#34D399',
  successBg: 'rgba(52, 211, 153, 0.14)',
  danger: '#F87171',
  dangerBg: 'rgba(248, 113, 113, 0.14)',
  info: '#60A5FA',
  infoBg: 'rgba(96, 165, 250, 0.14)',
  
  chalkNoteBg: '#211E1A',
  chalkBorder: '#3A342E',
  tabBarBg: 'rgba(26, 24, 22, 0.96)',
  tabBarBorder: '#2F2B26',
  cardShadow: 'rgba(0, 0, 0, 0.5)',
};
