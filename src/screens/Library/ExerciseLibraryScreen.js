import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import styles from '../Workouts/styles';
import colors from '../../constants/colors';
import { DEFAULT_EXERCISES, EXERCISE_GROUPS, GROUP_ORDER } from '../../constants/exercises';

export default function ExerciseLibraryScreen({ exerciseDb, setExerciseDb }) {
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
        <ScrollView contentContainerStyle={localStyles.listContent} showsVerticalScrollIndicator={false}>
          {grouped.map((group) => (
            <View key={group.title} style={localStyles.groupSection}>
              <Text style={localStyles.groupTitle}>{group.title}</Text>
              <FlatList
                data={group.data}
                keyExtractor={(item) => item}
                numColumns={3}
                scrollEnabled={false}
                columnWrapperStyle={localStyles.gridRow}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={localStyles.tile}
                    onLongPress={() => {
                      if (!DEFAULT_EXERCISES.includes(item)) {
                        setExerciseDb(exerciseDb.filter((exercise) => exercise !== item));
                      }
                    }}
                  >
                    <Text style={localStyles.tileText} numberOfLines={2}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </ScreenLayout>
  );
}

const localStyles = StyleSheet.create({
  groupSection: {
    marginBottom: 16,
  },
  groupTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4a445f',
    padding: 10,
    justifyContent: 'center',
  },
  tileText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
