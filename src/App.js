import React, { useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import {
  Text,
  useColorScheme,
  View,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useFonts } from '@expo-google-fonts/poppins';
import { Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import AppNavigator from './navigation/AppNavigator';
import { fonts } from './constants/theme';
import { getThemeColors } from './constants/colors';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });
  const scheme = useColorScheme();
  const colors = getThemeColors(scheme);
  const { width: viewportWidth } = useWindowDimensions();
  const webViewportWidth = useMemo(() => {
    if (Platform.OS !== 'web') {
      return viewportWidth;
    }
    if (typeof window === 'undefined') {
      return viewportWidth;
    }
    const screenWidth = window.screen?.width;
    if (typeof screenWidth === 'number') {
      return Math.min(viewportWidth, screenWidth);
    }
    return viewportWidth;
  }, [viewportWidth]);
  const isWideWeb = Platform.OS === 'web' && webViewportWidth > 767;
  const navTheme = useMemo(
    () => ({
      dark: scheme === 'dark',
      colors: {
        primary: colors.accent,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.accent,
      },
    }),
    [colors, scheme],
  );
  const styles = useMemo(() => createStyles(colors, isWideWeb), [colors, isWideWeb]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const root = document.getElementById('root');
    if (!root) {
      return;
    }

    document.documentElement.style.backgroundColor = '#2a2536';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'stretch';
    document.body.style.backgroundColor = '#2a2536';

    root.style.width = isWideWeb ? '400px' : '100%';
    root.style.maxWidth = '100%';
    root.style.minHeight = '100vh';
    root.style.display = 'flex';
    root.style.flexDirection = 'column';
    root.style.alignItems = 'stretch';
    root.style.margin = '0 auto';
  }, [isWideWeb]);

  React.useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    if (!Text.defaultProps) {
      Text.defaultProps = {};
    }

    if (!Text.defaultProps.style) {
      Text.defaultProps.style = { fontFamily: fonts.regular };
      return;
    }

    const existing = Text.defaultProps.style;
    const existingArray = Array.isArray(existing) ? existing : [existing];
    const hasFont = existingArray.some(
      (style) => style && typeof style === 'object' && style.fontFamily === fonts.regular,
    );

    if (!hasFont) {
      Text.defaultProps.style = [{ fontFamily: fonts.regular }, ...existingArray];
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.page}>
      <View style={styles.appFrame}>
        <NavigationContainer theme={navTheme}>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          <AppNavigator />
        </NavigationContainer>
      </View>
    </View>
  );
}

const createStyles = (colors, isWideWeb) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: isWideWeb ? '#232033' : colors.background,
      ...(Platform.OS === 'web'
        ? {
            width: '100%',
            alignItems: isWideWeb ? 'center' : 'stretch',
          }
        : null),
    },
    appFrame: {
      flex: 1,
      ...(Platform.OS === 'web'
        ? {
            width: isWideWeb ? 400 : '100%',
            maxWidth: isWideWeb ? 400 : '100%',
            flexGrow: 1,
            flexBasis: isWideWeb ? 400 : 'auto',
            alignSelf: isWideWeb ? 'center' : 'stretch',
          }
        : null),
    },
  });
