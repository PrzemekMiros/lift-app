import React, { useRef, useEffect, useMemo } from 'react';
import { SafeAreaView, View, StyleSheet, Animated } from 'react-native';
import { useThemeColors } from '../../constants/colors';

export default function ScreenLayout({ children }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <SafeAreaView style={styles.container}>
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
      paddingTop: 54,
    },
    fade: {
      flex: 1,
    },
  });
