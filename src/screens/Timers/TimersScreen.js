import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import colors from '../../constants/colors';

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function TimersScreen() {
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const stopwatchRef = useRef(null);

  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [inputMinutes, setInputMinutes] = useState('1');
  const [inputSeconds, setInputSeconds] = useState('30');
  const timerRef = useRef(null);

  useEffect(() => {
    if (!stopwatchRunning) {
      return;
    }
    stopwatchRef.current = setInterval(() => {
      setStopwatchSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(stopwatchRef.current);
  }, [stopwatchRunning]);

  useEffect(() => {
    if (!timerRunning) {
      return;
    }
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const handleTimerStart = () => {
    if (timerRunning) {
      return;
    }
    const minutes = Math.max(0, parseInt(inputMinutes || '0', 10));
    const seconds = Math.max(0, parseInt(inputSeconds || '0', 10));
    const total = minutes * 60 + seconds;
    if (total > 0) {
      setTimerSeconds(total);
    }
    setTimerRunning(true);
  };

  const handleTimerReset = () => {
    setTimerRunning(false);
    const minutes = Math.max(0, parseInt(inputMinutes || '0', 10));
    const seconds = Math.max(0, parseInt(inputSeconds || '0', 10));
    setTimerSeconds(minutes * 60 + seconds);
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Timery</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stoper przerwy</Text>
          <Text style={styles.time}>{formatTime(stopwatchSeconds)}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.button, stopwatchRunning && styles.buttonMuted]}
              onPress={() => setStopwatchRunning((prev) => !prev)}
            >
              <Text style={styles.buttonText}>
                {stopwatchRunning ? 'Pauza' : 'Start'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => {
                setStopwatchRunning(false);
                setStopwatchSeconds(0);
              }}
            >
              <Text style={styles.buttonTextSecondary}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Timer</Text>
          <Text style={styles.time}>{formatTime(timerSeconds)}</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={inputMinutes}
              onChangeText={setInputMinutes}
              keyboardType="numeric"
              placeholder="min"
              placeholderTextColor={colors.muted}
            />
            <TextInput
              style={styles.input}
              value={inputSeconds}
              onChangeText={setInputSeconds}
              keyboardType="numeric"
              placeholder="sek"
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.button, timerRunning && styles.buttonMuted]}
              onPress={handleTimerStart}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={handleTimerReset}>
              <Text style={styles.buttonTextSecondary}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => setTimerRunning(false)}
            >
              <Text style={styles.buttonTextSecondary}>Stop</Text>
            </TouchableOpacity>
          </View>
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
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#3a3450',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4a445f',
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  time: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '500',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonMuted: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#201c2b',
    fontWeight: '500',
  },
  buttonSecondary: {
    backgroundColor: '#2b263a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonTextSecondary: {
    color: colors.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#2b263a',
    color: colors.text,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    flex: 1,
    textAlign: 'center',
  },
});
