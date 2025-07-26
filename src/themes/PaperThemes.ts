import { DarkTheme } from '@react-navigation/native';
import { DefaultTheme, MD3DarkTheme } from 'react-native-paper';

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    background: '#ffffff',
    text: '#000000',
    surface: '#f6f6f6',
  },
};

export const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#bb86fc',
    background: '#121212',
    text: '#ffffff',
    surface: '#1f1f1f',
  },
};
