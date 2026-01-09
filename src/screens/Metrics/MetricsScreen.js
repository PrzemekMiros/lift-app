import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenLayout from '../../components/common/ScreenLayout';
import { useThemeColors } from '../../constants/colors';
import { fonts } from '../../constants/theme';

const STORAGE_KEY = 'metrics_v1';

export default function MetricsScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [entries, setEntries] = useState([]);
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [arm, setArm] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setEntries(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Load error', error);
      }
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleAdd = () => {
    if (!weight && !waist && !chest && !arm) {
      return;
    }
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('pl-PL'),
      weight: weight.trim(),
      waist: waist.trim(),
      chest: chest.trim(),
      arm: arm.trim(),
    };
    setEntries([newEntry, ...entries]);
    setWeight('');
    setWaist('');
    setChest('');
    setArm('');
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Metryki ciala</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nowy pomiar</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Waga (kg)"
              placeholderTextColor={colors.muted}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Talia (cm)"
              placeholderTextColor={colors.muted}
              value={waist}
              onChangeText={setWaist}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Klatka (cm)"
              placeholderTextColor={colors.muted}
              value={chest}
              onChangeText={setChest}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Biceps (cm)"
              placeholderTextColor={colors.muted}
              value={arm}
              onChangeText={setArm}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>Dodaj pomiar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.entry}
              onLongPress={() => {
                Alert.alert('Usun', 'Usunac pomiar?', [
                  { text: 'Nie' },
                  {
                    text: 'Tak',
                    onPress: () => setEntries(entries.filter((entry) => entry.id !== item.id)),
                  },
                ]);
              }}
            >
              <View style={styles.entryTop}>
                <Text style={styles.entryDate}>{item.date}</Text>
                <Text style={styles.entryWeight}>{item.weight ? `${item.weight} kg` : '-'}</Text>
              </View>
              <Text style={styles.entryMeta}>
                Talia: {item.waist || '-'} cm  •  Klatka: {item.chest || '-'} cm  •  Biceps:{' '}
                {item.arm || '-'} cm
              </Text>
            </TouchableOpacity>
          )}
        />
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
      fontFamily: fonts.medium,
      color: colors.text,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '500',
      fontFamily: fonts.medium,
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      columnGap: 10,
      marginBottom: 10,
    },
    input: {
      backgroundColor: colors.input,
      color: colors.text,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      width: '48%',
      textAlign: 'center',
    },
    addBtn: {
      backgroundColor: 'transparent',
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.accent,
      borderStyle: 'dashed',
    },
    addBtnText: {
      color: colors.accent,
      fontWeight: '500',
      fontFamily: fonts.medium,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    listContent: {
      paddingBottom: 20,
    },
    entry: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 10,
    },
    entryTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    entryDate: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '500',
      fontFamily: fonts.medium,
    },
    entryWeight: {
      color: colors.accent,
      fontSize: 14,
      fontWeight: '500',
      fontFamily: fonts.medium,
    },
    entryMeta: {
      color: colors.muted,
      fontSize: 12,
    },
  });
