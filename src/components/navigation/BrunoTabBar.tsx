import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dumbbell, CalendarRange, Trophy, Building2 } from 'lucide-react-native';

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

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Icon
                  size={22}
                  color={isActive ? '#F59E0B' : '#64748B'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {tab.badge && !isActive && (
                  <View style={styles.badgeDot} />
                )}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 70,
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 4,
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.2,
  },
  activeTabLabel: {
    color: '#F59E0B',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
  },
});
