import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const assets = {
  light: {
    email: require('@/assets/icons/auth/mail-open.svg'),
    password: require('@/assets/icons/auth/lock.svg'),
    name: require('@/assets/icons/auth/person.svg'),
    hidden: require('@/assets/icons/auth/eye-off.svg'),
    warning: require('@/assets/icons/auth/warning.svg'),
    check: require('@/assets/icons/auth/check.svg'),
  },
  dark: {
    email: require('@/assets/icons/auth/mail-open-dark.svg'),
    password: require('@/assets/icons/auth/lock-dark.svg'),
    name: require('@/assets/icons/auth/person-dark.svg'),
    hidden: require('@/assets/icons/auth/eye-off-dark.svg'),
    warning: require('@/assets/icons/auth/warning-dark.svg'),
    check: require('@/assets/icons/auth/check-dark.svg'),
  },
};

function useAuthAppearance() {
  const dark = useColorScheme() === 'dark';
  const colors = dark ? Colors.dark : Colors.light;
  return {
    dark,
    assets: assets[dark ? 'dark' : 'light'],
    background: dark ? colors.screen : '#F6FAFC',
    title: dark ? colors.textPrimary : '#0A141A',
    field: colors.card,
    fieldInk: dark ? '#7C8488' : '#546871',
    muted: '#7C8488',
    help: colors.accentSurface,
    link: colors.tabActive,
    primary: colors.accent,
    alternative: dark ? colors.card : '#EDF2F5',
    error: dark ? '#F0717D' : '#C33D4D',
    errorBackground: dark ? '#52000B' : '#FDEAED',
  };
}

const fonts = { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold };

export function AuthPage({ children, onBack }: { children: ReactNode; onBack?: () => void }) {
  const { dark, background } = useAuthAppearance();
  const insets = useSafeAreaInsets();
  const [fontsLoaded, fontError] = useFonts(fonts);
  const top = Math.max(27, insets.top);
  const logo = <Image source={require('@/assets/icons/auth/logo.png')} style={styles.logoImage} />;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.page, { backgroundColor: background }]}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      {fontsLoaded || fontError ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.pageContent,
            { paddingTop: top, paddingBottom: Math.max(25, insets.bottom + 8) },
          ]}>
          <View style={[styles.logo, { marginBottom: Math.max(24, 97 - top) }]}>
            {onBack ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Назад" onPress={onBack}>
                {logo}
              </Pressable>
            ) : logo}
          </View>
          {children}
        </ScrollView>
      ) : null}
    </KeyboardAvoidingView>
  );
}

export function AuthTitle({ children }: { children: string }) {
  const { title } = useAuthAppearance();
  return <Text accessibilityRole="header" style={[styles.title, { color: title }]}>{children}</Text>;
}

export function AuthHint({ children }: { children: string }) {
  const colors = useAuthAppearance();
  return (
    <View style={[styles.hint, { backgroundColor: colors.help }]}>
      <Text style={[styles.hintLabel, { color: colors.link }]}>AI-помощник</Text>
      <Text style={[styles.hintCopy, { color: colors.fieldInk }]}>{children}</Text>
    </View>
  );
}

export function AuthError({ children }: { children: string }) {
  const colors = useAuthAppearance();
  return (
    <View accessibilityRole="alert" style={[styles.error, { backgroundColor: colors.errorBackground }]}>
      <Image source={colors.assets.warning} style={styles.icon} />
      <Text style={[styles.errorCopy, { color: colors.error }]}>{children}</Text>
    </View>
  );
}

export function AuthField({
  label,
  icon,
  error,
  invalid,
  ...inputProps
}: TextInputProps & {
  label: string;
  icon: 'name' | 'email' | 'password';
  error?: string;
  invalid?: boolean;
}) {
  const colors = useAuthAppearance();
  const [visible, setVisible] = useState(false);
  const password = icon === 'password';
  return (
    <View style={styles.fieldGroup}>
      <View style={[
        styles.field,
        { backgroundColor: colors.field, borderColor: error || invalid ? colors.error : colors.fieldInk },
      ]}>
        <Image source={colors.assets[icon]} style={styles.icon} />
        <TextInput
          accessibilityLabel={label}
          placeholder={label}
          placeholderTextColor={colors.fieldInk}
          secureTextEntry={password && !visible}
          style={[styles.input, { color: colors.fieldInk }]}
          autoCapitalize={icon === 'name' ? 'words' : 'none'}
          autoCorrect={icon === 'name'}
          {...inputProps}
        />
        {password && (
          <Pressable onPress={() => setVisible(!visible)} hitSlop={10}
            accessibilityRole="button" accessibilityLabel={visible ? 'Скрыть пароль' : 'Показать пароль'}>
            {visible
              ? <Ionicons name="eye-outline" color={colors.fieldInk} size={24} />
              : <Image source={colors.assets.hidden} style={styles.icon} />}
          </Pressable>
        )}
      </View>
      {error && <Text accessibilityRole="alert" style={[styles.fieldError, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

export function AuthButton({
  children,
  onPress,
  disabled = false,
  alternative = false,
  faded = false,
}: {
  children: string;
  onPress?: () => void;
  disabled?: boolean;
  alternative?: boolean;
  faded?: boolean;
}) {
  const colors = useAuthAppearance();
  const backgroundColor = alternative ? colors.alternative : disabled || faded ? '#87C5F2' : colors.primary;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled}
      onPress={onPress} style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.buttonText, alternative && { color: colors.title, fontFamily: 'Manrope_500Medium' }]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function AuthLink({ children, onPress, disabled }: {
  children: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { link } = useAuthAppearance();
  return (
    <Pressable accessibilityRole="link" accessibilityState={{ disabled }} disabled={disabled}
      hitSlop={8} onPress={onPress}>
      <Text style={[styles.link, { color: link }]}>{children}</Text>
    </Pressable>
  );
}

export function AuthAlternatives({
  registration,
  disabled,
  onSwitch,
}: {
  registration: boolean;
  disabled?: boolean;
  onSwitch: () => void;
}) {
  const colors = useAuthAppearance();
  return (
    <>
      <View style={styles.divider}>
        <View style={[styles.line, { backgroundColor: colors.fieldInk }]} />
        <Text style={[styles.link, { color: colors.fieldInk }]}>Или</Text>
        <View style={[styles.line, { backgroundColor: colors.fieldInk }]} />
      </View>
      <View style={styles.alternatives}>
        <View style={styles.grow}><AuthButton alternative disabled>Google</AuthButton></View>
        <View style={styles.grow}><AuthButton alternative disabled>Apple</AuthButton></View>
      </View>
      <View style={styles.switch}>
        <Text style={[styles.link, { color: colors.muted }]}>{registration ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}</Text>
        <AuthLink disabled={disabled} onPress={onSwitch}>{registration ? 'Войти' : 'Зарегистрироваться'}</AuthLink>
      </View>
    </>
  );
}

export function AuthConsent({
  checked,
  onPress,
  error,
}: {
  checked: boolean;
  onPress: () => void;
  error?: string;
}) {
  const colors = useAuthAppearance();
  return (
    <View style={styles.fieldGroup}>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} hitSlop={6}
        onPress={onPress} style={styles.consent}>
        <View style={[
          styles.checkbox,
          { borderColor: error ? colors.error : colors.fieldInk },
          checked && { backgroundColor: colors.primary, borderColor: colors.primary },
        ]}>
          {checked && <Ionicons name="checkmark" size={12} color="#fff" />}
        </View>
        <Text style={[styles.consentText, { color: colors.muted }]}>
          Я принимаю <Text style={{ color: colors.link }}>условия</Text> и{' '}
          <Text style={{ color: colors.link }}>политику конфиденциальности</Text>
        </Text>
      </Pressable>
      {error && <Text accessibilityRole="alert" style={[styles.fieldError, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

export function AuthConfirmation({
  title,
  description,
  icon,
  footer,
}: {
  title: string;
  description: string;
  icon: 'mail' | 'check';
  footer: ReactNode;
}) {
  const colors = useAuthAppearance();
  const source: ComponentProps<typeof Image>['source'] = icon === 'check'
    ? colors.assets.check
    : require('@/assets/icons/auth/mail.svg');
  return (
    <>
      <View style={styles.confirmation}>
        <Image source={source} style={styles.illustration} />
        <View style={styles.confirmationCopy}>
          <AuthTitle>{title}</AuthTitle>
          <Text style={[styles.confirmationText, { color: colors.muted }]}>{description}</Text>
        </View>
      </View>
      <View style={styles.stickyFooter}>{footer}</View>
    </>
  );
}

export const authLayout = StyleSheet.create({
  form: { marginTop: 70, gap: 16 },
  fields: { gap: 12 },
  alignRight: { alignSelf: 'flex-end' },
  stickyFooter: { marginTop: 'auto', paddingTop: 24, gap: 12 },
});

const styles = StyleSheet.create({
  page: { flex: 1 },
  pageContent: { flexGrow: 1, width: '100%', maxWidth: 430, alignSelf: 'center', paddingHorizontal: 20 },
  logo: { width: 65, height: 52, marginLeft: 4 },
  logoImage: { width: 65, height: 52 },
  title: { fontFamily: 'Manrope_700Bold', fontSize: 26, lineHeight: 36, textAlign: 'center' },
  hint: { borderRadius: 24, padding: 12, gap: 14 },
  hintLabel: { fontFamily: 'Manrope_600SemiBold', fontSize: 12, lineHeight: 16 },
  hintCopy: { maxWidth: 295, fontFamily: 'Manrope_400Regular', fontSize: 12, lineHeight: 16 },
  error: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, gap: 8, padding: 12 },
  errorCopy: { flex: 1, maxWidth: 263, fontFamily: 'Manrope_400Regular', fontSize: 12, lineHeight: 16 },
  fieldGroup: { gap: 4 },
  field: {
    minHeight: 50, borderRadius: 16, borderWidth: 0.5, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  icon: { width: 24, height: 24 },
  input: { flex: 1, minHeight: 48, padding: 0, fontFamily: 'Manrope_500Medium', fontSize: 12 },
  fieldError: { fontFamily: 'Manrope_400Regular', fontSize: 10, lineHeight: 14 },
  button: { minHeight: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 10 },
  buttonText: { fontFamily: 'Manrope_600SemiBold', fontSize: 13, lineHeight: 18, color: '#fff' },
  pressed: { opacity: 0.78 },
  link: { fontFamily: 'Manrope_500Medium', fontSize: 12, lineHeight: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 2 },
  line: { height: StyleSheet.hairlineWidth, opacity: 0.3, flex: 1 },
  alternatives: { flexDirection: 'row', gap: 20 },
  grow: { flex: 1 },
  switch: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4 },
  consent: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  checkbox: { width: 15, height: 15, marginTop: 2, borderRadius: 2, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center' },
  consentText: { flexShrink: 1, maxWidth: 185, fontFamily: 'Manrope_500Medium', fontSize: 10, lineHeight: 14 },
  confirmation: { alignItems: 'center', gap: 12 },
  illustration: { width: 200, height: 200 },
  confirmationCopy: { alignItems: 'center', gap: 4 },
  confirmationText: {
    maxWidth: 237, textAlign: 'center', fontFamily: 'Manrope_400Regular',
    fontSize: 12, lineHeight: 16,
  },
  stickyFooter: authLayout.stickyFooter,
});
