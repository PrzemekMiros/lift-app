import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  LayoutAnimation,
  Modal,
  Image,
} from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import { useThemeColors } from '../../constants/colors';
import { createStyles } from './styles';
import { GROUP_ORDER } from '../../constants/exercises';

function formatDuration(totalSeconds = 0) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

export default function WorkoutListScreen({
  navigation,
  workouts,
  setWorkouts,
  exerciseDb,
  exerciseGroups,
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const grouped = useMemo(() => {
    const counts = GROUP_ORDER.reduce((acc, group) => {
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
    return GROUP_ORDER.map((group) => ({
      title: group,
      count: counts[group] || 0,
    }));
  }, [exerciseDb, exerciseGroups]);

  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Treningi</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              setSelectedGroups([]);
              setShowGroupModal(true);
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
      <Modal visible={showGroupModal} animationType="slide" transparent>
        <View style={styles.modalContent}>
          <Text style={[styles.header, styles.modalHeader]}>Wybierz grupe miesni</Text>
          <FlatList
            data={grouped}
            keyExtractor={(item) => item.title}
            numColumns={2}
            columnWrapperStyle={styles.groupGridRow}
            contentContainerStyle={styles.groupListContent}
            renderItem={({ item }) => {
              const isSelected = selectedGroups.includes(item.title);
              return (
                <TouchableOpacity
                  style={[styles.groupTile, isSelected && styles.groupTileSelected]}
                  onPress={() => {
                    setSelectedGroups((prev) =>
                      prev.includes(item.title)
                        ? prev.filter((group) => group !== item.title)
                        : [...prev, item.title],
                    );
                  }}
                >
                  <View style={styles.groupIconWrap}>
                    <Image source={getGroupImage(item.title)} style={styles.groupIconImage} />
                  </View>
                  <Text style={styles.groupTileTitle}>{item.title}</Text>
                  <Text style={styles.groupTileMeta}>{item.count} cwiczen</Text>
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              const newWorkout = {
                id: Date.now(),
                date: new Date().toLocaleDateString('pl-PL'),
                exercises: [],
                durationSeconds: 0,
                completedAt: null,
                selectedGroups: [...selectedGroups],
              };
              setWorkouts([newWorkout, ...workouts]);
              setShowGroupModal(false);
              setSelectedGroups([]);
            }}
          >
            <Text style={styles.closeBtnText}>DODAJ TRENING</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              setShowGroupModal(false);
              setSelectedGroups([]);
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
