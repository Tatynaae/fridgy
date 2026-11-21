import { useColorScheme } from 'react-native';

import { authThemes, type AuthTheme } from '@/constants/auth-theme';

export function useAuthTheme(): AuthTheme {
  return useColorScheme() === 'dark' ? authThemes.dark : authThemes.light;
}
