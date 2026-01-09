import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import ScreenLayout from '../../components/common/ScreenLayout';
import { useThemeColors } from '../../constants/colors';

const STATS = {
  workouts: 2,
  volume: 9.8,
  sets: 16,
  maxWeight: 120,
};

const CHART_POINTS = [60, 72, 85, 92, 105, 110, 120];

function buildPath(points, width, height) {
  if (!points.length) {
    return '';
  }
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1);
  return points
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / span) * height;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function StatsScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const chartWidth = 320;
  const chartHeight = 120;
  const path = buildPath(CHART_POINTS, chartWidth, chartHeight);
  const lastX = chartWidth;
  const lastY = CHART_POINTS.length
    ? chartHeight -
      ((CHART_POINTS[CHART_POINTS.length - 1] - Math.min(...CHART_POINTS)) /
        (Math.max(...CHART_POINTS) - Math.min(...CHART_POINTS) || 1)) *
        chartHeight
    : 0;

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Statystyki</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TRENINGI</Text>
            <Text style={styles.statValue}>{STATS.workouts}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>OBJETOSC (t)</Text>
            <Text style={styles.statValue}>{STATS.volume}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SERIE</Text>
            <Text style={styles.statValue}>{STATS.sets}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MAX CIEZAR</Text>
            <Text style={styles.statValue}>{STATS.maxWeight} kg</Text>
          </View>
        </View>
        <View style={styles.motivationBox}>
          <Text style={styles.motivationTitle}>MOTYWACJA</Text>
          <Text style={styles.motivationText}>
            Przerzuciles juz {STATS.volume} ton. To masa okolo 7 aut osobowych!
          </Text>
        </View>
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Ciezar w czasie</Text>
          <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            <Path d={path} stroke={colors.accent} strokeWidth={3} fill="none" />
            <Circle cx={lastX} cy={lastY} r={4} fill={colors.accent} />
          </Svg>
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
      marginBottom: 16,
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
  });
