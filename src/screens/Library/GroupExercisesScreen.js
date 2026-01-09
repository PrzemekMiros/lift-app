import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import { useThemeColors } from '../../constants/colors';
import { DEFAULT_EXERCISES } from '../../constants/exercises';
import { createStyles } from '../Workouts/styles';

export default function GroupExercisesScreen({
  navigation,
  route,
  exerciseDb,
  setExerciseDb,
  exerciseGroups,
  setExerciseGroups,
}) {
  const colors = useThemeColors();
  const workoutStyles = useMemo(() => createStyles(colors), [colors]);
  const styles = useMemo(() => createLocalStyles(colors), [colors]);
  const { group } = route.params;
  const [newExercise, setNewExercise] = useState('');
  const exercises = useMemo(() => {
    return exerciseDb.filter((name) => {
      const mapped = exerciseGroups[name] || 'Inne';
      return mapped === group;
    });
  }, [exerciseDb, exerciseGroups, group]);

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={workoutStyles.backButtonContainer}>
          <Text style={workoutStyles.backLink}>&lt;- Baza ćwiczeń</Text>
        </TouchableOpacity>
        <Text style={workoutStyles.header}>{group}</Text>
        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            value={newExercise}
            onChangeText={setNewExercise}
            placeholder="Nowe cwiczenie..."
            placeholderTextColor={colors.muted}
          />
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              const trimmed = newExercise.trim();
              if (!trimmed) {
                return;
              }
              if (!exerciseDb.includes(trimmed)) {
                setExerciseDb([trimmed, ...exerciseDb]);
              }
              setExerciseGroups({ ...exerciseGroups, [trimmed]: group });
              setNewExercise('');
            }}
          >
            <Text style={styles.addBtnText}>Dodaj</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={workoutStyles.card}
              onLongPress={() => {
                if (!DEFAULT_EXERCISES.includes(item)) {
                  setExerciseDb(exerciseDb.filter((exercise) => exercise !== item));
                  const nextGroups = { ...exerciseGroups };
                  delete nextGroups[item];
                  setExerciseGroups(nextGroups);
                }
              }}
            >
              <Text style={workoutStyles.cardTitle}>{item}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Brak cwiczen w tej grupie.</Text>
          }
        />
      </View>
    </ScreenLayout>
  );
}

const createLocalStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    addRow: {
      flexDirection: 'row',
      columnGap: 10,
      marginBottom: 12,
    },
    input: {
      flex: 1,
      backgroundColor: colors.input,
      color: colors.text,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
    },
    addBtn: {
      backgroundColor: 'transparent',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.accent,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addBtnText: {
      color: colors.accent,
      fontWeight: '500',
    },
    listContent: {
      paddingBottom: 24,
    },
    emptyText: {
      color: colors.muted,
      textAlign: 'center',
      marginTop: 12,
    },
  });
