import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MENU_ITEMS = [
  { key: 'Treningi', label: 'Treningi', icon: WorkoutsIcon },
  { key: 'Baza', label: 'Baza cwiczen', icon: LibraryIcon },
  { key: 'Historia', label: 'Historia', icon: HistoryIcon },
  { key: 'Timery', label: 'Timery', icon: TimerIcon },
  { key: 'Metryki', label: 'Metryki ciala', icon: MetricsIcon },
  { key: 'Statystyki', label: 'Statystyki', icon: StatsIcon },
];

const DEFAULT_EXERCISES = [
  'Wyciskanie sztangi na plaskiej',
  'Przysiad ze sztanga',
  'Martwy ciag',
  'Podciaganie na drazku (szeroko)',
  'Wioslowanie sztanga w opadzie',
];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function WorkoutsIcon({ color }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="9" width="4" height="6" rx="1.5" fill={color} />
      <Rect x="18" y="9" width="4" height="6" rx="1.5" fill={color} />
      <Rect x="6" y="10" width="12" height="4" rx="2" fill={color} />
    </Svg>
  );
}

function LibraryIcon({ color }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="6" height="16" rx="1.5" fill={color} />
      <Rect x="10" y="6" width="4" height="14" rx="1.5" fill={color} />
      <Rect x="15" y="5" width="6" height="15" rx="1.5" fill={color} />
    </Svg>
  );
}

function HistoryIcon({ color }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" />
      <Path d="M12 7v5l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function TimerIcon({ color }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="13" r="7" stroke={color} strokeWidth="2" />
      <Rect x="9" y="3" width="6" height="3" rx="1" fill={color} />
      <Path d="M12 13l3 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function MetricsIcon({ color }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 7c0-2 2-3 5-3s5 1 5 3-2 3-5 3-5-1-5-3Z"
        fill={color}
      />
      <Rect x="6" y="10" width="12" height="10" rx="5" fill={color} />
    </Svg>
  );
}

function StatsIcon({ color }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="12" width="3" height="8" rx="1" fill={color} />
      <Rect x="10" y="8" width="3" height="12" rx="1" fill={color} />
      <Rect x="16" y="5" width="3" height="15" rx="1" fill={color} />
    </Svg>
  );
}

function ScreenLayout({ children }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenContent}>{children}</View>
    </SafeAreaView>
  );
}

function MenuItem({ label, icon: Icon, active, onPress }) {
  const color = active ? colors.primary : colors.muted;

  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Icon color={color} />
      </View>
      <Text style={[styles.menuLabel, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function BottomMenuBar({ state, navigation }) {
  const scrollRef = useRef(null);
  const scrollX = useRef(0);

  const handleScroll = (event) => {
    scrollX.current = event.nativeEvent.contentOffset.x;
  };

  const handleWheel = (event) => {
    if (Platform.OS !== 'web' || !scrollRef.current) {
      return;
    }

    const nextX = Math.max(0, scrollX.current + event.nativeEvent.deltaY);
    scrollRef.current.scrollTo({ x: nextX, animated: false });
  };

  return (
    <View style={styles.menuWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.menuContent}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onWheel={handleWheel}
      >
        {MENU_ITEMS.map((item, index) => (
          <MenuItem
            key={item.key}
            label={item.label}
            icon={item.icon}
            active={state.index === index}
            onPress={() => navigation.navigate(item.key)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function PlaceholderScreen({ label }) {
  return (
    <ScreenLayout>
      <View style={styles.placeholderWrap}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.subtitle}>Widok roboczy, nawigacja dziala.</Text>
      </View>
    </ScreenLayout>
  );
}

function ExerciseLibraryScreen({ exerciseDb, setExerciseDb }) {
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

function WorkoutListScreen({ navigation, workouts, setWorkouts }) {
  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
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

function WorkoutScreen({
  navigation,
  route,
  workouts,
  setWorkouts,
  exerciseDb,
  setExerciseDb,
  showDbModal,
  setShowDbModal,
  newDbEx,
  setNewDbEx,
}) {
  const { workoutId } = route.params;
  const workout = workouts.find((item) => item.id === workoutId);

  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Text style={styles.backLink}>&lt;- Lista treningow</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{workout?.date}</Text>
        <TouchableOpacity style={styles.outlineBtn} onPress={() => setShowDbModal(true)}>
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
          <Text style={[styles.header, styles.modalHeader]}>Baza cwiczen</Text>
          <View style={[styles.row, styles.modalRow]}>
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
          <ScrollView contentContainerStyle={styles.dbList}>
            {exerciseDb.map((exercise) => (
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
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowDbModal(false)}>
            <Text style={styles.closeBtnText}>ZAMKNIJ</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScreenLayout>
  );
}

function ExerciseScreen({
  navigation,
  route,
  workouts,
  setWorkouts,
  reps,
  setReps,
  weight,
  setWeight,
}) {
  const { workoutId, exerciseId } = route.params;
  const workout = workouts.find((item) => item.id === workoutId);
  const exercise = workout?.exercises?.find((item) => item.id === exerciseId);

  return (
    <ScreenLayout>
      <View style={styles.workoutInner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Text style={styles.backLink}>&lt;- Lista cwiczen</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{exercise?.name}</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.inputSmall}
            placeholder="Powt"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
            placeholderTextColor={colors.muted}
          />
          <TextInput
            style={styles.inputSmall}
            placeholder="kg"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            placeholderTextColor={colors.muted}
          />
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              if (!reps || !weight) {
                return;
              }
              const updated = workouts.map((w) =>
                w.id === workoutId
                  ? {
                      ...w,
                      exercises: w.exercises.map((ex) =>
                        ex.id === exerciseId
                          ? { ...ex, sets: [...ex.sets, { id: Date.now(), reps, weight }] }
                          : ex,
                      ),
                    }
                  : w,
              );
              setWorkouts(updated);
              setReps('');
              setWeight('');
            }}
          >
            <Text style={styles.addBtnText}>DODAJ</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={exercise?.sets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.setRow}
              onPress={() => {
                const updated = workouts.map((w) =>
                  w.id === workoutId
                    ? {
                        ...w,
                        exercises: w.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? { ...ex, sets: ex.sets.filter((set) => set.id !== item.id) }
                            : ex,
                        ),
                      }
                    : w,
                );
                setWorkouts(updated);
              }}
            >
              <Text style={styles.setText}>SERIA {index + 1}</Text>
              <Text style={styles.setVal}>
                {item.weight} kg x {item.reps}
              </Text>
              <Text style={styles.removeText}>USUN</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenLayout>
  );
}

function WorkoutsStackScreen({ exerciseDb, setExerciseDb }) {
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

export default function AppNavigator() {
  const [exerciseDb, setExerciseDb] = useState(DEFAULT_EXERCISES);

  useEffect(() => {
    const loadDb = async () => {
      try {
        const savedDb = await AsyncStorage.getItem('ex_db_v3');
        if (savedDb) {
          setExerciseDb(JSON.parse(savedDb));
        }
      } catch (error) {
        console.error('Load error', error);
      }
    };
    loadDb();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('ex_db_v3', JSON.stringify(exerciseDb));
  }, [exerciseDb]);

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomMenuBar {...props} />}
    >
      <Tab.Screen name="Treningi">
        {(props) => (
          <WorkoutsStackScreen
            {...props}
            exerciseDb={exerciseDb}
            setExerciseDb={setExerciseDb}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Baza">
        {(props) => (
          <ExerciseLibraryScreen
            {...props}
            exerciseDb={exerciseDb}
            setExerciseDb={setExerciseDb}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Historia" children={() => <PlaceholderScreen label="Historia" />} />
      <Tab.Screen name="Timery" children={() => <PlaceholderScreen label="Timery" />} />
      <Tab.Screen name="Metryki" children={() => <PlaceholderScreen label="Metryki ciala" />} />
      <Tab.Screen name="Statystyki" children={() => <PlaceholderScreen label="Statystyki" />} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  placeholderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
  },
  menuWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#4a445f',
    backgroundColor: colors.surface,
    paddingVertical: 10,
  },
  menuContent: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  menuItem: {
    width: 76,
    alignItems: 'center',
    marginRight: 16,
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  workoutInner: {
    flex: 1,
  },
  historyIntro: {
    marginBottom: 15,
    paddingRight: 20,
  },
  historyDescription: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 21,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  backButtonContainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 10,
  },
  backLink: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  cardSub: {
    color: colors.muted,
    fontSize: 12,
  },
  cardArrow: {
    color: colors.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 32,
    color: colors.background,
    fontWeight: '600',
  },
  outlineBtn: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: colors.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 15,
    borderRadius: 12,
  },
  inputSmall: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 15,
    borderRadius: 12,
    width: 75,
    marginRight: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontWeight: '600',
    color: colors.background,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  setText: {
    color: colors.muted,
    fontWeight: '600',
  },
  setVal: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  removeText: {
    color: colors.error,
    fontSize: 10,
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  modalRow: {
    paddingHorizontal: 20,
  },
  modalInput: {
    flex: 1,
  },
  dbList: {
    paddingHorizontal: 20,
  },
  dbItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#4a445f',
  },
  dbItemText: {
    color: colors.text,
    fontSize: 16,
  },
  addSmall: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSmallText: {
    fontWeight: '700',
    color: colors.background,
    fontSize: 18,
  },
  closeBtn: {
    backgroundColor: '#2f2a40',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    margin: 20,
  },
  closeBtnText: {
    color: colors.text,
    fontWeight: '700',
  },
});
