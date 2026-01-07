import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, LayoutAnimation } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import styles from './styles';

function formatDuration(totalSeconds = 0) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}.${String(seconds).padStart(2, '0')} min`;
}

export default function WorkoutListScreen({ navigation, workouts, setWorkouts }) {
  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
        <Text style={styles.header}>Treningi</Text>
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
                  <Text style={styles.cardDuration}>
                    {formatDuration(item.durationSeconds || 0)}
                  </Text>
                </View>
                <Text style={styles.cardSub}>{item.exercises.length} cwiczen</Text>
              </View>
              <Text style={styles.cardArrow}>&gt;</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            const newWorkout = {
              id: Date.now(),
              date: new Date().toLocaleDateString('pl-PL'),
              exercises: [],
              durationSeconds: 0,
            };
            setWorkouts([newWorkout, ...workouts]);
          }}
        >
          <Text style={styles.bottomButtonText}>Dodaj trening</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}
