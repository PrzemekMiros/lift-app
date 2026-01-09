import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, LayoutAnimation } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import styles from './styles';

function formatDuration(totalSeconds = 0) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

export default function WorkoutListScreen({ navigation, workouts, setWorkouts }) {
  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Treningi</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              const newWorkout = {
                id: Date.now(),
                date: new Date().toLocaleDateString('pl-PL'),
                exercises: [],
                durationSeconds: 0,
                completedAt: null,
              };
              setWorkouts([newWorkout, ...workouts]);
            }}
          >
            <Text style={styles.headerButtonText}>Dodaj trening</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Workout', { workoutId: item.id })}
              onLongPress={() => {
                Alert.alert('Usun', 'Usunac trening?', [
                  { text: 'Nie' },
                  {
                    text: 'Tak',
                    onPress: () => setWorkouts(workouts.filter((workout) => workout.id !== item.id)),
                  },
                ]);
              }}
            >
              <View>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{item.date}</Text>
                  {item.completedAt && item.durationSeconds ? (
                    <Text style={styles.cardDuration}>
                      {formatDuration(item.durationSeconds)}
                    </Text>
                  ) : null}
                </View>
                <Text style={styles.cardSub}>{item.exercises.length} cwiczen</Text>
              </View>
              <Text style={styles.cardArrow}>&gt;</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenLayout>
  );
}
