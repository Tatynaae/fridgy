// Токены экранов авторизации из Figma («мобильная разработка» → Style Guide и экраны SignIn / Авторизация / …).
// Светлая и тёмная темы — как в макете (тёмный фон #1B1B1B).
export type AuthTheme = {
  bg: string;
  card: string; // баннер «AI-помощник»
  text: string;
  secondary: string;
  primary: string; // кнопка
  link: string;
  inputBg: string;
  inputBorder: string;
  placeholder: string;
  icon: string;
  socialBg: string;
  divider: string;
  danger: string;
  dangerBg: string;
  success: string;
};

export const authThemes: Record<'light' | 'dark', AuthTheme> = {
  light: {
    bg: '#F6FAFC',
    card: '#EAF7FD',
    text: '#0A141A',
    secondary: '#546871',
    primary: '#1479C9',
    link: '#168CE1',
    inputBg: '#FFFFFF',
    inputBorder: '#7C8488',
    placeholder: '#546871',
    icon: '#546871',
    socialBg: '#EDF2F5',
    divider: '#D9E2E7',
    danger: '#C33D4D',
    dangerBg: '#FFE7EA',
    success: '#27A26A',
  },
  dark: {
    bg: '#1B1B1B',
    card: '#002E52',
    text: '#FFFFFF',
    secondary: '#7C8488',
    primary: '#1479C9',
    link: '#168CE1',
    inputBg: '#2A2A2A',
    inputBorder: '#7C8488',
    placeholder: '#7C8488',
    icon: '#7C8488',
    socialBg: '#2A2A2A',
    divider: '#2A2A2A',
    danger: '#F0717D',
    dangerBg: '#5A0A14',
    success: '#43C989',
  },
};
