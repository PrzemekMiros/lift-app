import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
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
              <Text style={localStyles.tileTitle}>{item.title}</Text>
              <Text style={localStyles.tileMeta}>{item.data.length} cwiczen</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenLayout>
  );
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
