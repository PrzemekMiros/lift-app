import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLayout from '../../components/common/ScreenLayout';
import styles from './styles';
import colors from '../../constants/colors';
import { DEFAULT_EXERCISES } from '../../constants/exercises';

export default function WorkoutScreen({
  navigation,
  route,
  workouts,
  setWorkouts,
  exerciseDb,
  setExerciseDb,
  showDbModal,
  setShowDbModal,
  newDbEx,
  setNewDbEx,
}) {
  const { workoutId } = route.params;
  const workout = workouts.find((item) => item.id === workoutId);
  const startedAtRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      startedAtRef.current = Date.now();
      return () => {
        startedAtRef.current = null;
      };
    }, [setWorkouts, workoutId]),
  );

  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Text style={styles.backLink}>&lt;- Lista treningow</Text>
        </TouchableOpacity>
        <View style={styles.workoutHeaderRow}>
          <Text style={styles.header}>{workout?.date}</Text>
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={() => {
              if (!startedAtRef.current) {
                startedAtRef.current = Date.now();
              }
              const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
              setWorkouts((prev) =>
                prev.map((item) =>
                  item.id === workoutId
                    ? {
                        ...item,
                        durationSeconds: elapsed,
                        completedAt: new Date().toISOString(),
                      }
                    : item,
                ),
              );
              startedAtRef.current = null;
              navigation.goBack();
            }}
          >
            <Text style={styles.finishBtnText}>Zakończ</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.outlineBtn} onPress={() => setShowDbModal(true)}>
          <Text style={styles.outlineBtnText}>+ DODAJ CWICZENIE</Text>
        </TouchableOpacity>
        <FlatList
          data={workout?.exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('Exercise', { workoutId: workoutId, exerciseId: item.id })
              }
              onLongPress={() => {
                const updated = workouts.map((w) =>
                  w.id === workoutId
                    ? { ...w, exercises: w.exercises.filter((exercise) => exercise.id !== item.id) }
                    : w,
                );
                setWorkouts(updated);
              }}
            >
              <View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub}>{item.sets.length} serii</Text>
              </View>
              <Text style={styles.cardArrow}>&gt;</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <Modal visible={showDbModal} animationType="slide" transparent>
        <View style={styles.modalContent}>
          <Text style={[styles.header, styles.modalHeader]}>Baza cwiczen</Text>
          <View style={[styles.row, styles.modalRow]}>
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
          <ScrollView contentContainerStyle={styles.dbList}>
            {exerciseDb.map((exercise) => (
              <TouchableOpacity
                key={exercise}
                style={styles.dbItem}
                onPress={() => {
                  const updated = workouts.map((w) =>
                    w.id === workoutId
                      ? {
                          ...w,
                          exercises: [
                            ...w.exercises,
                            { id: Date.now(), name: exercise, sets: [] },
                          ],
                        }
                      : w,
                  );
                  setWorkouts(updated);
                  setShowDbModal(false);
                }}
                onLongPress={() => {
                  if (!DEFAULT_EXERCISES.includes(exercise)) {
                    setExerciseDb(exerciseDb.filter((item) => item !== exercise));
                  }
                }}
              >
                <Text style={styles.dbItemText}>{exercise}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowDbModal(false)}>
            <Text style={styles.closeBtnText}>ZAMKNIJ</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScreenLayout>
  );
}
