import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import ScreenLayout from '../../components/common/ScreenLayout';
import styles from '../Workouts/styles';
import colors from '../../constants/colors';
import { GROUP_ORDER } from '../../constants/exercises';

export default function ExerciseLibraryScreen({
  navigation,
  exerciseDb,
  exerciseGroups,
}) {
  const grouped = useMemo(() => {
    const groups = {};
    exerciseDb.forEach((name) => {
      const group = exerciseGroups[name] || 'Inne';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(name);
    });
    return GROUP_ORDER.map((group) => ({
      title: group,
      data: groups[group] || [],
    }));
  }, [exerciseDb, exerciseGroups]);

  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
        <Text style={styles.header}>Baza ćwiczen</Text>
        <FlatList
          data={grouped}
          keyExtractor={(item) => item.title}
          numColumns={3}
          columnWrapperStyle={localStyles.gridRow}
          contentContainerStyle={localStyles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={localStyles.tile}
              onPress={() => navigation.navigate('GroupExercises', { group: item.title })}
            >
              <View style={localStyles.iconWrap}>{renderGroupIcon(item.title)}</View>
              <Text style={localStyles.tileTitle}>{item.title}</Text>
              <Text style={localStyles.tileMeta}>{item.data.length} cwiczen</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenLayout>
  );
}

function renderGroupIcon(group) {
  const color = colors.accent;
  switch (group) {
    case 'Klatka':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Rect x="2" y="10" width="4" height="6" rx="1" stroke={color} strokeWidth="2" />
          <Rect x="20" y="10" width="4" height="6" rx="1" stroke={color} strokeWidth="2" />
          <Rect x="7" y="11" width="12" height="4" rx="2" stroke={color} strokeWidth="2" />
          <Path d="M9 9c2-1.5 6-1.5 8 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );
    case 'Plecy':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Path
            d="M6 6c2 2 3 4 3 7s-1 5-3 7M20 6c-2 2-3 4-3 7s1 5 3 7"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Path d="M13 6v14" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );
    case 'Barki':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Path d="M6 16c0-3 2-5 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Path d="M20 16c0-3-2-5-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Circle cx="6" cy="17" r="3" stroke={color} strokeWidth="2" />
          <Circle cx="20" cy="17" r="3" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'Biceps':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Path
            d="M7 18c0-4 3-7 7-7h2v4M16 15c0 3-2 5-5 5H9a2 2 0 0 1-2-2"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="16" cy="10" r="2" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'Triceps':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Path
            d="M8 7h8l3 6-3 6H8l-2-6 2-6z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Path d="M11 10h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );
    case 'Nogi':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Path d="M8 6v10l-2 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Path d="M18 6v10l2 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Path d="M6 20h6" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Path d="M14 20h6" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );
    case 'Brzuch':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Rect x="7" y="4" width="12" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="9" y="7" width="3" height="4" rx="1" stroke={color} strokeWidth="2" />
          <Rect x="14" y="7" width="3" height="4" rx="1" stroke={color} strokeWidth="2" />
          <Rect x="9" y="13" width="3" height="4" rx="1" stroke={color} strokeWidth="2" />
          <Rect x="14" y="13" width="3" height="4" rx="1" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'Inne':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Circle cx="13" cy="13" r="9" stroke={color} strokeWidth="2" />
          <Path d="M13 8v10M8 13h10" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );
    default:
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Circle cx="13" cy="13" r="9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}

const localStyles = StyleSheet.create({
  gridRow: {
    gap: 10,
  },
  listContent: {
    paddingBottom: 24,
  },
  tile: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#3a3450',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4a445f',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    marginBottom: 8,
  },
  tileTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  tileMeta: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 6,
  },
});
