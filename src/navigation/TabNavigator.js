import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useThemeColors } from '../constants/colors';
import { fonts } from '../constants/theme';
import { DEFAULT_EXERCISES, EXERCISE_GROUPS } from '../constants/exercises';
import ScreenLayout from '../components/common/ScreenLayout';
import WorkoutsStack from './WorkoutsStack';
import HistoryScreen from '../screens/History/HistoryScreen';
import TimersScreen from '../screens/Timers/TimersScreen';
import StatsScreen from '../screens/Stats/StatsScreen';
import MetricsScreen from '../screens/Metrics/MetricsScreen';
import LibraryStack from './LibraryStack';

const Tab = createBottomTabNavigator();
 
const MENU_ITEMS = [
  { key: 'Treningi', label: 'Treningi', icon: WorkoutsIcon },
  { key: 'Baza', label: 'Ćwiczenia', icon: LibraryIcon },
  { key: 'Historia', label: 'Historia', icon: HistoryIcon },
  { key: 'Timery', label: 'Timery', icon: TimerIcon },
  { key: 'Metryki', label: 'Metryki ciała', icon: MetricsIcon },
  { key: 'Statystyki', label: 'Statystyki', icon: StatsIcon },
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
      <Path
        d="M7 7c0-2 2-3 5-3s5 1 5 3-2 3-5 3-5-1-5-3Z"
        fill={color}
      />
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

function MenuItem({ label, icon: Icon, onPress, styles, colors }) {
  const color = colors.accent;
  const labelColor = colors.text;

  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Icon color={color} />
      </View>
      <Text style={[styles.menuLabel, { color: labelColor }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function BottomMenuBar({ state, navigation, styles, colors }) {
  const scrollRef = useRef(null);
  const scrollX = useRef(0);

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
        {MENU_ITEMS.map((item, index) => (
          <MenuItem
            key={item.key}
            label={item.label}
            icon={item.icon}
            onPress={() => navigation.navigate(item.key)}
            styles={styles}
            colors={colors}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function PlaceholderScreen({ label, styles }) {
  return (
    <ScreenLayout>
      <View style={styles.placeholderWrap}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.subtitle}>Widok roboczy, nawigacja dziala.</Text>
      </View>
    </ScreenLayout>
  );
}

export default function TabNavigator() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [exerciseDb, setExerciseDb] = useState(DEFAULT_EXERCISES);
  const [exerciseGroups, setExerciseGroups] = useState(EXERCISE_GROUPS);

  useEffect(() => {
    const loadDb = async () => {
      try {
        const savedDb = await AsyncStorage.getItem('ex_db_v3');
        const savedGroups = await AsyncStorage.getItem('exercise_groups_v1');
        if (savedDb) {
          setExerciseDb(JSON.parse(savedDb));
        }
        if (savedGroups) {
          setExerciseGroups(JSON.parse(savedGroups));
        }
      } catch (error) {
        console.error('Load error', error);
      }
    };
    loadDb();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('ex_db_v3', JSON.stringify(exerciseDb));
  }, [exerciseDb]);

  useEffect(() => {
    AsyncStorage.setItem('exercise_groups_v1', JSON.stringify(exerciseGroups));
  }, [exerciseGroups]);

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomMenuBar {...props} styles={styles} colors={colors} />}
    >
      <Tab.Screen name="Treningi">
        {(props) => (
          <WorkoutsStack {...props} exerciseDb={exerciseDb} setExerciseDb={setExerciseDb} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Baza">
        {(props) => (
          <LibraryStack
            {...props}
            exerciseDb={exerciseDb}
            setExerciseDb={setExerciseDb}
            exerciseGroups={exerciseGroups}
            setExerciseGroups={setExerciseGroups}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Historia" component={HistoryScreen} />
      <Tab.Screen name="Timery" component={TimersScreen} />
      <Tab.Screen name="Metryki" component={MetricsScreen} />
      <Tab.Screen name="Statystyki" component={StatsScreen} />
    </Tab.Navigator>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    placeholderWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 22,
      color: colors.text,
      fontWeight: '500',
      fontFamily: fonts.medium,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.muted,
    },
    menuWrapper: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      paddingVertical: 10,
    },
    menuContent: {
      paddingHorizontal: 12,
      paddingRight: 16,
    },
    menuItem: {
      width: 70,
      alignItems: 'center',
      marginRight: 10,
    },
    iconWrap: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.text,
    },
  });
