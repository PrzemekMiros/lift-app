import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import colors from '../constants/colors';

const MENU_ITEMS = [
  { key: 'workouts', label: 'Treningi', icon: WorkoutsIcon },
  { key: 'library', label: 'Baza cwiczen', icon: LibraryIcon },
  { key: 'history', label: 'Historia', icon: HistoryIcon },
  { key: 'timers', label: 'Timery', icon: TimerIcon },
  { key: 'metrics', label: 'Metryki ciala', icon: MetricsIcon },
  { key: 'stats', label: 'Statystyki', icon: StatsIcon },
];

function WorkoutsIcon({ color }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="9" width="4" height="6" rx="1.5" fill={color} />
      <Rect x="18" y="9" width="4" height="6" rx="1.5" fill={color} />
      <Rect x="6" y="10" width="12" height="4" rx="2" fill={color} />
    </Svg>
  );
}

function LibraryIcon({ color }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="6" height="16" rx="1.5" fill={color} />
      <Rect x="10" y="6" width="4" height="14" rx="1.5" fill={color} />
      <Rect x="15" y="5" width="6" height="15" rx="1.5" fill={color} />
    </Svg>
  );
}

function HistoryIcon({ color }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" />
      <Path d="M12 7v5l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function TimerIcon({ color }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="13" r="7" stroke={color} strokeWidth="2" />
      <Rect x="9" y="3" width="6" height="3" rx="1" fill={color} />
      <Path d="M12 13l3 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function MetricsIcon({ color }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M7 7c0-2 2-3 5-3s5 1 5 3-2 3-5 3-5-1-5-3Z" fill={color} />
      <Rect x="6" y="10" width="12" height="10" rx="5" fill={color} />
    </Svg>
  );
}

function StatsIcon({ color }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="12" width="3" height="8" rx="1" fill={color} />
      <Rect x="10" y="8" width="3" height="12" rx="1" fill={color} />
      <Rect x="16" y="5" width="3" height="15" rx="1" fill={color} />
    </Svg>
  );
}

function MenuItem({ label, icon: Icon, active, onPress }) {
  const color = active ? colors.primary : colors.muted;

  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Icon color={color} />
      </View>
      <Text style={[styles.menuLabel, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function AppNavigator() {
  const [activeKey, setActiveKey] = React.useState('workouts');
  const scrollRef = useRef(null);
  const scrollX = useRef(0);
  const activeLabel = useMemo(() => {
    const item = MENU_ITEMS.find((entry) => entry.key === activeKey);
    return item ? item.label : 'Treningi';
  }, [activeKey]);

  const handleScroll = (event) => {
    scrollX.current = event.nativeEvent.contentOffset.x;
  };

  const handleWheel = (event) => {
    if (Platform.OS !== 'web' || !scrollRef.current) {
      return;
    }

    const nextX = Math.max(0, scrollX.current + event.nativeEvent.deltaY);
    scrollRef.current.scrollTo({ x: nextX, animated: false });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{activeLabel}</Text>
        <Text style={styles.subtitle}>Widok roboczy, nawigacja na dole.</Text>
      </View>
      <View style={styles.menuWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.menuContent}
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onWheel={handleWheel}
        >
          {MENU_ITEMS.map((item) => (
            <MenuItem
              key={item.key}
              label={item.label}
              icon={item.icon}
              active={item.key === activeKey}
              onPress={() => setActiveKey(item.key)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
  },
  menuWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#4a445f',
    backgroundColor: colors.surface,
    paddingVertical: 10,
  },
  menuContent: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  menuItem: {
    width: 96,
    alignItems: 'center',
    marginRight: 16,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2f2a40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  menuLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
