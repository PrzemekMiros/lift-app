import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default function ScreenLayout({ children }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{children}</View>
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
});
