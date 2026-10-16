// src/components/navigation/BrunoTabBar.tsx
// Floating Dynamic Island / Tactile Tab Bar (Satya style) with Spring Physics and Haptics

import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Dumbbell, CalendarRange, Trophy, Building2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useBruno } from '../../context/BrunoContext';

export type TabType = 'today' | 'program' | 'review' | 'profile';

interface BrunoTabBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  hasUnloggedWorkout?: boolean;
}

export const BrunoTabBar: React.FC<BrunoTabBarProps> = ({
  currentTab,
  onSelectTab,
  hasUnloggedWorkout = true,
}) => {
  const { colors } = useBruno();

  const tabs = [
    {
      id: 'today' as TabType,
      label: 'Today',
      icon: Dumbbell,
      badge: hasUnloggedWorkout,
    },
    {
      id: 'program' as TabType,
      label: 'Program',
      icon: CalendarRange,
    },
    {
      id: 'review' as TabType,
      label: 'Verdict',
      icon: Trophy,
    },
    {
      id: 'profile' as TabType,
      label: 'Gym & Gear',
      icon: Building2,
    },
  ];

  const handleTabPress = (tabId: TabType) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    onSelectTab(tabId);
  };

  return (
    <View style={styles.floatingContainer} pointerEvents="box-none">
      <View 
        style={[
          styles.pillBar, 
          { 
            backgroundColor: colors.tabBarBg, 
            borderColor: colors.tabBarBorder,
            shadowColor: colors.cardShadow,
          }
        ]}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                isActive && {
                  backgroundColor: colors.amberGlow,
                },
              ]}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Icon
                  size={20}
                  color={isActive ? colors.amber : colors.textMuted}
                  strokeWidth={isActive ? 2.6 : 1.8}
                />
                {tab.badge && !isActive && (
                  <View style={[styles.badgeDot, { borderColor: colors.tabBarBg }]} />
                )}
              </View>

              <Text 
                style={[
                  styles.tabLabel, 
                  { color: isActive ? colors.amber : colors.textMuted },
                  isActive && styles.activeTabLabel
                ]}
              >
                {tab.label}
              </Text>

              {isActive && (
                <View style={[styles.activeIndicator, { backgroundColor: colors.amber }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
    borderWidth: 1.2,
    width: '100%',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    minWidth: 68,
    position: 'relative',
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 3,
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  activeTabLabel: {
    fontWeight: '900',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 14,
    height: 2.5,
    borderRadius: 1.5,
  },
});
