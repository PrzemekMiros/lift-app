import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLayout from '../../components/common/ScreenLayout';
import colors from '../../constants/colors';
import { fonts } from '../../constants/theme';

const WEEKDAYS = ['Pn', 'Wt', 'Sr', 'Cz', 'Pt', 'So', 'Nd'];
const MONTHS = [
  'Styczen',
  'Luty',
  'Marzec',
  'Kwiecien',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpien',
  'Wrzesien',
  'Pazdziernik',
  'Listopad',
  'Grudzien',
];

function parsePlDateToIso(dateStr) {
  if (!dateStr) {
    return null;
  }
  const parts = dateStr.split('.');
  if (parts.length < 3) {
    return null;
  }
  const [day, month, year] = parts.map((part) => part.trim());
  if (!day || !month || !year) {
    return null;
  }
  const dd = day.padStart(2, '0');
  const mm = month.padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(42).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells[startOffset + day - 1] = day;
  }
  return cells;
}

export default function HistoryScreen() {
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const [markedDates, setMarkedDates] = useState(new Set());

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadWorkouts = async () => {
        try {
          const savedWorkouts = await AsyncStorage.getItem('workouts_v3');
          if (!savedWorkouts) {
            if (isActive) {
              setMarkedDates(new Set());
            }
            return;
          }
          const workouts = JSON.parse(savedWorkouts);
          const nextMarked = new Set();
          workouts.forEach((workout) => {
            const iso = parsePlDateToIso(workout?.date);
            if (iso) {
              nextMarked.add(iso);
            }
          });
          if (isActive) {
            setMarkedDates(nextMarked);
          }
        } catch (error) {
          console.error('Load error', error);
        }
      };

      loadWorkouts();
      return () => {
        isActive = false;
      };
    }, []),
  );

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const monthLabel = `${MONTHS[month]} ${year}`;
  const cells = getMonthMatrix(year, month);

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Historia</Text>
        <View style={styles.calendarHeader}>
          <Pressable
            style={styles.calendarNav}
            onPress={() => setMonthCursor(new Date(year, month - 1, 1))}
          >
            <Text style={styles.calendarNavText}>{'<'}</Text>
          </Pressable>
          <Text style={styles.calendarTitle}>{monthLabel}</Text>
          <Pressable
            style={styles.calendarNav}
            onPress={() => setMonthCursor(new Date(year, month + 1, 1))}
          >
            <Text style={styles.calendarNavText}>{'>'}</Text>
          </Pressable>
        </View>
        <View style={styles.calendarWeekRow}>
          {WEEKDAYS.map((label) => (
            <Text key={label} style={styles.calendarWeekText}>
              {label}
            </Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {cells.map((day, index) => {
            if (!day) {
              return <View key={`empty-${index}`} style={styles.calendarCell} />;
            }
            const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(
              2,
              '0',
            )}`;
            const marked = markedDates.has(iso);
            return (
              <View key={`day-${day}-${index}`} style={styles.calendarCell}>
                <View style={[styles.calendarDay, marked && styles.calendarDayMarked]}>
                  <Text style={[styles.calendarDayText, marked && styles.calendarDayTextMarked]}>
                    {day}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: '500',
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: 15,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: fonts.medium,
  },
  calendarNav: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarNavText: {
    color: colors.accent,
    fontWeight: '500',
    fontFamily: fonts.medium,
  },
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calendarWeekText: {
    width: '14.285%',
    textAlign: 'center',
    color: colors.muted,
    fontSize: 12,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14.285%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  calendarDay: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4a445f',
  },
  calendarDayMarked: {
    backgroundColor: colors.accent,
  },
  calendarDayText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: fonts.medium,
  },
  calendarDayTextMarked: {
    color: colors.background,
  },
});
