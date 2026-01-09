import { useColorScheme } from 'react-native';

export const darkColors = {
  background: '#332e45',
  primary: '#bfff00ff',
  accent: '#d7fb00',
  onAccent: '#1c1b1f',
  error: '#8a0101',
  text: '#f2f0f5',
  muted: '#c9c4d4',
  surface: '#3f3953',
  card: '#3a3450',
  input: '#2b263a',
  border: '#4a445f',
};

export const lightColors = {
  background: '#f7f6fb',
  primary: '#d05940',
  accent: '#d05940',
  onAccent: '#ffffff',
  error: '#b00020',
  text: '#1c1b1f',
  muted: '#5f5a6b',
  surface: '#ffffff',
  card: '#ffffff',
  input: '#f1eef5',
  border: '#d8d4de',
};

export const getThemeColors = (scheme) => (scheme === 'dark' ? darkColors : lightColors);

export const useThemeColors = () => {
  const scheme = useColorScheme();
  return getThemeColors(scheme);
};
