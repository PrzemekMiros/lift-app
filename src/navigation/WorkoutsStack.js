import React, { useEffect, useState } from 'react';
import { Platform, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutListScreen from '../screens/Workouts/WorkoutListScreen';
import WorkoutScreen from '../screens/Workouts/WorkoutScreen';
import ExerciseScreen from '../screens/Workouts/ExerciseScreen';

const Stack = createNativeStackNavigator();

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function WorkoutsStack({ exerciseDb, setExerciseDb }) {
  const [workouts, setWorkouts] = useState([]);
  const [showDbModal, setShowDbModal] = useState(false);
  const [newDbEx, setNewDbEx] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedWorkouts = await AsyncStorage.getItem('workouts_v3');
        if (savedWorkouts) {
          setWorkouts(JSON.parse(savedWorkouts));
        }
      } catch (error) {
        console.error('Load error', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('workouts_v3', JSON.stringify(workouts));
  }, [workouts]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutList">
        {(props) => (
          <WorkoutListScreen {...props} workouts={workouts} setWorkouts={setWorkouts} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Workout">
        {(props) => (
          <WorkoutScreen
            {...props}
            workouts={workouts}
            setWorkouts={setWorkouts}
            exerciseDb={exerciseDb}
            setExerciseDb={setExerciseDb}
            showDbModal={showDbModal}
            setShowDbModal={setShowDbModal}
            newDbEx={newDbEx}
            setNewDbEx={setNewDbEx}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Exercise">
        {(props) => (
          <ExerciseScreen
            {...props}
            workouts={workouts}
            setWorkouts={setWorkouts}
            reps={reps}
            setReps={setReps}
            weight={weight}
            setWeight={setWeight}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
