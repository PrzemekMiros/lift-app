import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExerciseLibraryScreen from '../screens/Library/ExerciseLibraryScreen';
import GroupExercisesScreen from '../screens/Library/GroupExercisesScreen';

const Stack = createNativeStackNavigator();

export default function LibraryStack({ exerciseDb, setExerciseDb }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LibraryHome">
        {(props) => (
          <ExerciseLibraryScreen
            {...props}
            exerciseDb={exerciseDb}
            setExerciseDb={setExerciseDb}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="GroupExercises">
        {(props) => (
          <GroupExercisesScreen
            {...props}
            exerciseDb={exerciseDb}
            setExerciseDb={setExerciseDb}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
