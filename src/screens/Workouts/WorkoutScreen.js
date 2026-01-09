import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Image,
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
  const [selectedGroup, setSelectedGroup] = useState(null);

  const allowedGroups = useMemo(() => {
    const selected = workout?.selectedGroups;
    if (!selected || selected.length === 0) {
      return GROUP_ORDER;
    }
    return GROUP_ORDER.filter((group) => selected.includes(group));
  }, [workout?.selectedGroups]);

  const grouped = useMemo(() => {
    const counts = allowedGroups.reduce((acc, group) => {
      acc[group] = 0;
      return acc;
    }, {});
    exerciseDb.forEach((name) => {
      const group = exerciseGroups[name] || 'Inne';
      if (counts[group] === undefined) {
        counts[group] = 0;
      }
      counts[group] += 1;
    });
    return allowedGroups.map((group) => ({
      title: group,
      count: counts[group] || 0,
    }));
  }, [allowedGroups, exerciseDb, exerciseGroups]);

  const groupExercises = useMemo(() => {
    if (!selectedGroup) {
      return [];
    }
    return exerciseDb.filter((name) => {
      const mapped = exerciseGroups[name] || 'Inne';
      return mapped === selectedGroup;
    });
  }, [exerciseDb, exerciseGroups, selectedGroup]);

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
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => {
            setSelectedGroup(null);
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
      <Modal visible={showDbModal} animationType="slide" transparent>
        <View style={styles.modalContent}>
          <Text style={[styles.header, styles.modalHeader]}>
            {selectedGroup ? selectedGroup : 'Wybierz grupe miesni'}
          </Text>
          {selectedGroup ? (
            <>
              <TouchableOpacity
                style={styles.modalBackRow}
                onPress={() => {
                  setSelectedGroup(null);
                }}
              >
                <Text style={styles.backLink}>&lt;- Wybierz grupe</Text>
              </TouchableOpacity>
              <View style={[styles.row, styles.modalRow]}>
                <TextInput
                  style={[styles.input, styles.modalInput]}
                  placeholder="Nowe cwiczenie..."
                  placeholderTextColor={colors.muted}
                  value={newDbEx}
                  onChangeText={setNewDbEx}
                />
                <TouchableOpacity
                  style={styles.addSmall}
                  onPress={() => {
                    const trimmed = newDbEx.trim();
                    if (trimmed && !exerciseDb.includes(trimmed)) {
                      setExerciseDb([...exerciseDb, trimmed]);
                      setExerciseGroups({ ...exerciseGroups, [trimmed]: selectedGroup });
                    }
                    setNewDbEx('');
                  }}
                >
                  <Text style={styles.addSmallText}>+</Text>
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.dbList}>
                {groupExercises.map((exercise) => (
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
                      setSelectedGroup(null);
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
            </>
          ) : (
            <FlatList
              data={grouped}
              keyExtractor={(item) => item.title}
              numColumns={2}
              columnWrapperStyle={styles.groupGridRow}
              contentContainerStyle={styles.groupListContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.groupTile}
                  onPress={() => setSelectedGroup(item.title)}
                >
                  <View style={styles.groupIconWrap}>
                    <Image source={getGroupImage(item.title)} style={styles.groupIconImage} />
                  </View>
                  <Text style={styles.groupTileTitle}>{item.title}</Text>
                  <Text style={styles.groupTileMeta}>{item.count} cwiczen</Text>
                </TouchableOpacity>
              )}
            />
          )}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              setSelectedGroup(null);
              setShowDbModal(false);
            }}
          >
            <Text style={styles.closeBtnText}>ZAMKNIJ</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScreenLayout>
  );
}

function getGroupImage(group) {
  switch (group) {
    case 'Klatka':
      return require('../../assets/baza-cwiczen-klatka.png');
    case 'Plecy':
      return require('../../assets/baza-cwiczen-plecy.png');
    case 'Barki':
      return require('../../assets/baza-cwiczen-barki.png');
    case 'Biceps':
      return require('../../assets/baza-cwiczen-biceps.png');
    case 'Triceps':
      return require('../../assets/baza-cwiczen-triceps.png');
    case 'Nogi':
      return require('../../assets/baza-cwiczen-nogi.png');
    case 'Brzuch':
      return require('../../assets/baza-cwiczen-brzuch.png');
    case 'Sztuki walki':
    case 'Inne':
    default:
      return require('../../assets/baza-cwiczen-brzuch.png');
  }
}
