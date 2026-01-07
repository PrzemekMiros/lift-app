import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, LayoutAnimation } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import styles from './styles';

export default function WorkoutListScreen({ navigation, workouts, setWorkouts }) {
  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
        <View style={styles.historyIntro}>
          <Text style={styles.historyDescription}>
            Zapisuj sesje treningowe, ciezar, ilosc serii oraz powtorzen. Sledz regularnosc
            i swoje postepy.
          </Text>
        </View>
        <Text style={styles.header}>Treningi</Text>
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
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
                <Text style={styles.cardTitle}>{item.date}</Text>
                <Text style={styles.cardSub}>{item.exercises.length} cwiczen</Text>
              </View>
              <Text style={styles.cardArrow}>&gt;</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          const newWorkout = {
            id: Date.now(),
            date: new Date().toLocaleDateString('pl-PL'),
            exercises: [],
          };
          setWorkouts([newWorkout, ...workouts]);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
}
