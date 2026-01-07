import React, { useRef, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Animated } from 'react-native';
import colors from '../../constants/colors';

export default function ScreenLayout({ children }) {
  const opacity = useRef(new Animated.Value(0)).current;

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  fade: {
    flex: 1,
  },
});
