import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Text, useColorScheme } from 'react-native';
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
  const navTheme = React.useMemo(
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
    <NavigationContainer theme={navTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
}
