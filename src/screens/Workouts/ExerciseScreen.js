import React from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import styles from './styles';
import colors from '../../constants/colors';

export default function ExerciseScreen({
  navigation,
  route,
  workouts,
  setWorkouts,
  reps,
  setReps,
  weight,
  setWeight,
}) {
  const { workoutId, exerciseId } = route.params;
  const workout = workouts.find((item) => item.id === workoutId);
  const exercise = workout?.exercises?.find((item) => item.id === exerciseId);

  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Text style={styles.backLink}>&lt;- Lista cwiczen</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{exercise?.name}</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.inputSmall}
            placeholder="Powt"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
            placeholderTextColor={colors.muted}
          />
          <TextInput
            style={styles.inputSmall}
            placeholder="kg"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            placeholderTextColor={colors.muted}
          />
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              if (!reps || !weight) {
                return;
              }
              const updated = workouts.map((w) =>
                w.id === workoutId
                  ? {
                      ...w,
                      exercises: w.exercises.map((ex) =>
                        ex.id === exerciseId
                          ? { ...ex, sets: [...ex.sets, { id: Date.now(), reps, weight }] }
                          : ex,
                      ),
                    }
                  : w,
              );
              setWorkouts(updated);
              setReps('');
              setWeight('');
            }}
          >
            <Text style={styles.addBtnText}>DODAJ</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={exercise?.sets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.setRow}
              onPress={() => {
                const updated = workouts.map((w) =>
                  w.id === workoutId
                    ? {
                        ...w,
                        exercises: w.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? { ...ex, sets: ex.sets.filter((set) => set.id !== item.id) }
                            : ex,
                        ),
                      }
                    : w,
                );
                setWorkouts(updated);
              }}
            >
              <Text style={styles.setText}>SERIA {index + 1}</Text>
              <Text style={styles.setVal}>
                {item.weight} kg x {item.reps}
              </Text>
              <Text style={styles.removeText}>USUN</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenLayout>
  );
}
