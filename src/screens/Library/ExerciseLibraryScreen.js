import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import styles from '../Workouts/styles';
import colors from '../../constants/colors';
import { GROUP_ORDER } from '../../constants/exercises';

export default function ExerciseLibraryScreen({
  navigation,
  exerciseDb,
  exerciseGroups,
}) {
  const grouped = useMemo(() => {
    const groups = {};
    exerciseDb.forEach((name) => {
      const group = exerciseGroups[name] || 'Inne';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(name);
    });
    return GROUP_ORDER.map((group) => ({
      title: group,
      data: groups[group] || [],
    }));
  }, [exerciseDb, exerciseGroups]);

  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
        <Text style={styles.header}>Baza ćwiczeń</Text>
        <FlatList
          data={grouped}
          keyExtractor={(item) => item.title}
          numColumns={2}
          columnWrapperStyle={localStyles.gridRow}
          contentContainerStyle={localStyles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={localStyles.tile}
              onPress={() => navigation.navigate('GroupExercises', { group: item.title })}
            >
              <View style={localStyles.iconWrap}>
                <Image source={getGroupImage(item.title)} style={localStyles.iconImage} />
              </View>
              <Text style={localStyles.tileTitle}>{item.title}</Text>
              <Text style={localStyles.tileMeta}>{item.data.length} cwiczen</Text>
            </TouchableOpacity>
          )}
        />
      </View>
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

const localStyles = StyleSheet.create({
  gridRow: {
    gap: 10,
  },
  listContent: {
    paddingBottom: 24,
  },
  tile: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#3a3450',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4a445f',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    marginBottom: 8,
    width: '60%',
    height: '60%',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  tileTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  tileMeta: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 6,
  },
});
