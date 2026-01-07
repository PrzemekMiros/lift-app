import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import colors from '../../constants/colors';
import { DEFAULT_EXERCISES, EXERCISE_GROUPS } from '../../constants/exercises';
import workoutStyles from '../Workouts/styles';

export default function GroupExercisesScreen({ navigation, route, exerciseDb, setExerciseDb }) {
  const { group } = route.params;
  const exercises = useMemo(() => {
    return exerciseDb.filter((name) => {
      const mapped = EXERCISE_GROUPS[name] || 'Inne';
      return mapped === group;
    });
  }, [exerciseDb, group]);

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={workoutStyles.backButtonContainer}>
          <Text style={workoutStyles.backLink}>&lt;- Baza cwiczen</Text>
        </TouchableOpacity>
        <Text style={workoutStyles.header}>{group}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
