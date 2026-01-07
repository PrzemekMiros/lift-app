import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import ScreenLayout from '../../components/common/ScreenLayout';
import styles from '../Workouts/styles';
import colors from '../../constants/colors';
import { DEFAULT_EXERCISES, EXERCISE_GROUPS, GROUP_ORDER } from '../../constants/exercises';

export default function ExerciseLibraryScreen({ navigation, exerciseDb, setExerciseDb }) {
  const [newDbEx, setNewDbEx] = useState('');
  const grouped = useMemo(() => {
    const groups = {};
    exerciseDb.forEach((name) => {
      const group = EXERCISE_GROUPS[name] || 'Inne';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(name);
    });
    return GROUP_ORDER.filter((group) => groups[group]?.length).map((group) => ({
      title: group,
      data: groups[group],
    }));
  }, [exerciseDb]);

  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
        <Text style={styles.header}>Baza cwiczen</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.modalInput]}
            placeholder="Nowe..."
            placeholderTextColor={colors.muted}
            value={newDbEx}
            onChangeText={setNewDbEx}
          />
          <TouchableOpacity
            style={styles.addSmall}
            onPress={() => {
              if (newDbEx && !exerciseDb.includes(newDbEx)) {
                setExerciseDb([...exerciseDb, newDbEx]);
                setNewDbEx('');
              }
            }}
          >
            <Text style={styles.addSmallText}>+</Text>
          </TouchableOpacity>
        </View>
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
          <Rect x="3" y="6" width="8" height="14" rx="2" fill={color} />
          <Rect x="15" y="6" width="8" height="14" rx="2" fill={color} />
        </Svg>
      );
    case 'Plecy':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Path d="M4 6h18v6l-9 8-9-8V6z" fill={color} />
        </Svg>
      );
    case 'Barki':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Circle cx="8" cy="13" r="5" fill={color} />
          <Circle cx="18" cy="13" r="5" fill={color} />
        </Svg>
      );
    case 'Biceps':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Path d="M6 18c0-4 3-7 7-7h5v6a5 5 0 0 1-5 5H9a3 3 0 0 1-3-3z" fill={color} />
        </Svg>
      );
    case 'Triceps':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Path d="M7 6h12v14H7z" fill={color} />
        </Svg>
      );
    case 'Nogi':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Rect x="6" y="4" width="6" height="18" rx="2" fill={color} />
          <Rect x="14" y="4" width="6" height="18" rx="2" fill={color} />
        </Svg>
      );
    case 'Brzuch':
      return (
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <Rect x="7" y="4" width="12" height="18" rx="3" fill={color} />
          <Rect x="9" y="7" width="8" height="3" rx="1.5" fill="#2f2a40" />
          <Rect x="9" y="12" width="8" height="3" rx="1.5" fill="#2f2a40" />
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
