import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLayout from '../../components/common/ScreenLayout';
import { useThemeColors } from '../../constants/colors';

function buildPath(points, width, height) {
  if (!points.length || width <= 0 || height <= 0) {
    return '';
  }
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  if (points.length === 1) {
    const y = height - ((points[0] - min) / span) * height;
    return `M0 ${y.toFixed(1)}`;
  }
  const step = width / (points.length - 1);
  return points
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / span) * height;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

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

export default function StatsScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [workouts, setWorkouts] = useState([]);
  const [chartWidth, setChartWidth] = useState(0);
  const chartHeight = 120;

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const loadWorkouts = async () => {
        try {
          const savedWorkouts = await AsyncStorage.getItem('workouts_v3');
          if (!savedWorkouts) {
            if (isActive) {
              setWorkouts([]);
            }
            return;
          }
          if (isActive) {
            setWorkouts(JSON.parse(savedWorkouts));
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

  const stats = useMemo(() => {
    let maxWeight = 0;
    let volumeKg = 0;
    let totalSets = 0;
    workouts.forEach((workout) => {
      workout?.exercises?.forEach((exercise) => {
        exercise?.sets?.forEach((set) => {
          const weight = Number(set?.weight);
          const reps = Number(set?.reps);
          if (!Number.isFinite(weight) || !Number.isFinite(reps)) {
            return;
          }
          maxWeight = Math.max(maxWeight, weight);
          volumeKg += weight * reps;
          totalSets += 1;
        });
      });
    });
    return {
      workouts: workouts.length,
      volume: volumeKg / 1000,
      sets: totalSets,
      maxWeight,
    };
  }, [workouts]);

  const chartPoints = useMemo(() => {
    if (!workouts.length) {
      return [];
    }
    const sorted = [...workouts].sort((a, b) => {
      const aIso = parsePlDateToIso(a?.date);
      const bIso = parsePlDateToIso(b?.date);
      if (!aIso || !bIso) {
        return 0;
      }
      return aIso.localeCompare(bIso);
    });
    return sorted
      .map((workout) => {
        let localMax = 0;
        workout?.exercises?.forEach((exercise) => {
          exercise?.sets?.forEach((set) => {
            const weight = Number(set?.weight);
            if (Number.isFinite(weight)) {
              localMax = Math.max(localMax, weight);
            }
          });
        });
        return localMax;
      })
      .filter((value) => value > 0);
  }, [workouts]);

  const path = useMemo(
    () => buildPath(chartPoints, chartWidth, chartHeight),
    [chartPoints, chartWidth, chartHeight],
  );
  const lastX = chartPoints.length > 1 ? chartWidth : 0;
  const lastY = chartPoints.length
    ? chartHeight -
      ((chartPoints[chartPoints.length - 1] - Math.min(...chartPoints)) /
        (Math.max(...chartPoints) - Math.min(...chartPoints) || 1)) *
        chartHeight
    : 0;

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Statystyki</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TRENINGI</Text>
            <Text style={styles.statValue}>{stats.workouts}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>OBJETOSC (t)</Text>
            <Text style={styles.statValue}>{stats.volume.toFixed(1)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SERIE</Text>
            <Text style={styles.statValue}>{stats.sets}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MAX CIEZAR</Text>
            <Text style={styles.statValue}>{stats.maxWeight} kg</Text>
          </View>
        </View>
        <View
          style={styles.chartBox}
          onLayout={(event) => {
            const nextWidth = Math.max(0, event.nativeEvent.layout.width - 28);
            if (nextWidth !== chartWidth) {
              setChartWidth(nextWidth);
            }
          }}
        >
          <Text style={styles.chartTitle}>Ciezar w czasie</Text>
          {chartWidth > 0 && chartPoints.length ? (
            <Svg
              width={chartWidth}
              height={chartHeight}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            >
              <Path d={path} stroke={colors.accent} strokeWidth={3} fill="none" />
              <Circle cx={lastX} cy={lastY} r={4} fill={colors.accent} />
            </Svg>
          ) : (
            <Text style={styles.chartEmpty}>Brak danych do wykresu.</Text>
          )}
        </View>
        <View style={styles.motivationBox}>
          <Text style={styles.motivationTitle}>MOTYWACJA</Text>
          <Text style={styles.motivationText}>
            Przerzuciles juz {stats.volume.toFixed(1)} ton. To masa okolo{' '}
            {(stats.volume / 1.5).toFixed(1)} aut osobowych!
          </Text>
        </View>
      </View>
    </ScreenLayout>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      fontSize: 22,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 12,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      width: '48%',
      marginBottom: 12,
    },
    statLabel: {
      color: colors.muted,
      fontSize: 11,
      marginBottom: 6,
    },
    statValue: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '500',
    },
    motivationBox: {
      backgroundColor: colors.input,
      borderRadius: 12,
      padding: 14,
      marginTop: 12,
    },
    motivationTitle: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 6,
    },
    motivationText: {
      color: colors.text,
      fontSize: 14,
    },
    chartBox: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chartTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 10,
    },
    chartEmpty: {
      color: colors.muted,
      fontSize: 12,
    },
  });
