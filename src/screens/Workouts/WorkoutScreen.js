import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLayout from '../../components/common/ScreenLayout';
import { useThemeColors } from '../../constants/colors';
import { createStyles } from './styles';
import { DEFAULT_EXERCISES, GROUP_ORDER } from '../../constants/exercises';

export default function WorkoutScreen({
  navigation,
  route,
  workouts,
  setWorkouts,
  exerciseDb,
  setExerciseDb,
  exerciseGroups,
  setExerciseGroups,
  showDbModal,
  setShowDbModal,
  newDbEx,
  setNewDbEx,
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { workoutId } = route.params;
  const workout = workouts.find((item) => item.id === workoutId);
  const startedAtRef = useRef(null);
  const [isModalMounted, setIsModalMounted] = useState(false);
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const allowedGroups = useMemo(() => {
    const selected = workout?.selectedGroups;
    if (!selected || selected.length === 0) {
      return GROUP_ORDER;
    }
    return GROUP_ORDER.filter((group) => selected.includes(group));
  }, [workout?.selectedGroups]);

  const allowedExercises = useMemo(() => {
    return exerciseDb.filter((name) => {
      const mapped = exerciseGroups[name] || 'Inne';
      return allowedGroups.includes(mapped);
    });
  }, [allowedGroups, exerciseDb, exerciseGroups]);

  useFocusEffect(
    React.useCallback(() => {
      startedAtRef.current = Date.now();
      return () => {
        startedAtRef.current = null;
      };
    }, [setWorkouts, workoutId]),
  );

  useEffect(() => {
    if (showDbModal) {
      setIsModalMounted(true);
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return;
    }
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsModalMounted(false);
      }
    });
  }, [modalOpacity, showDbModal]);

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
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => {
            setShowDbModal(true);
          }}
        >
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
      <Modal visible={isModalMounted} animationType="none" transparent>
        <Animated.View style={[styles.modalContent, { opacity: modalOpacity }]}>
          <Text style={[styles.header, styles.modalHeader]}>
            Wybierz cwiczenie
          </Text>
          <ScrollView contentContainerStyle={styles.dbList}>
            {allowedExercises.map((exercise) => (
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
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              setShowDbModal(false);
            }}
          >
            <Text style={styles.closeBtnText}>ZAMKNIJ</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </ScreenLayout>
  );
}
