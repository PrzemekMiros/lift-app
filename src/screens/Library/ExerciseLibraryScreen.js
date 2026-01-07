import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import styles from '../Workouts/styles';
import colors from '../../constants/colors';
import { DEFAULT_EXERCISES } from '../../constants/exercises';

export default function ExerciseLibraryScreen({ exerciseDb, setExerciseDb }) {
  const [newDbEx, setNewDbEx] = useState('');

  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
        <Text style={styles.header}>Baza cwiczen</Text>
        <View style={styles.row}>
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
        <FlatList
          data={exerciseDb}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dbItem}
              onLongPress={() => {
                if (!DEFAULT_EXERCISES.includes(item)) {
                  setExerciseDb(exerciseDb.filter((exercise) => exercise !== item));
                }
              }}
            >
              <Text style={styles.dbItemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenLayout>
  );
}
