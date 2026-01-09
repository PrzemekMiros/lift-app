import React, { useRef, useEffect, useMemo } from 'react';
import { SafeAreaView, View, StyleSheet, Animated, Image, Text, useColorScheme } from 'react-native';
import { useThemeColors } from '../../constants/colors';

export default function ScreenLayout({ children }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scheme = useColorScheme();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const logoSource =
    scheme === 'light'
      ? require('../../assets/logo-light.png')
      : require('../../assets/logo-dark.png');

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brandRow} pointerEvents="none">
        <Image source={logoSource} style={styles.brandIcon} />
        <Text style={styles.brandText}>
          LIFT <Text style={styles.brandTextAccent}>NOTE</Text>
        </Text>
      </View>
      <View style={styles.content}>
        <Animated.View style={[styles.fade, { opacity }]}>{children}</Animated.View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 100,
    },
    fade: {
      flex: 1,
    },
    brandRow: {
      position: 'absolute',
      top: 48,
      left: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      zIndex: 10,
    },
    brandIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
    },
    brandText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 1,
    },
    brandTextAccent: {
      color: colors.accent,
      fontWeight: '700',
    },
  });
