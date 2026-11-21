import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authApi } from './api';
import { useSession } from './session';

const REMEMBERED_EMAIL = 'fridgy.remembered-email';
const copy = {
  login: { title: 'Войти в Fridgy', detail: '', submit: 'Войти' },
  register: { title: 'Регистрация', detail: '', submit: 'Создать аккаунт' },
  forgot: {
    title: 'Забыли пароль?',
    detail: 'Укажи email, чтобы получить ссылку для сброса пароля.',
    submit: 'Отправить ссылку',
  },
  reset: {
    title: 'Новый пароль',
    detail: 'Придумай пароль из 8–128 символов.',
    submit: 'Сохранить пароль',
  },
};

export function AuthScreen({ mode }: { mode: keyof typeof copy }) {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string; status?: string }>();
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const reset = mode === 'reset';
  const login = mode === 'login';
  const register = mode === 'register';
  const text = copy[mode];

  useEffect(() => {
    if (!login) return;
    let current = true;
    void AsyncStorage.getItem(REMEMBERED_EMAIL)
      .then((value) => {
        if (value && current) {
          setEmail((existing) => existing || value);
          setRememberEmail(true);
        }
      })
      .catch(() => undefined);
    return () => {
      current = false;
    };
  }, [login]);

  async function submit() {
    if (busy || sent) return;
    setError('');
    const normalizedEmail = email.trim().toLowerCase();
    const token = params.token || resetToken.trim();
    if (reset && !token) return setError('Вставь код или ссылку из письма.');
    if (!reset && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return setError('Укажи корректный email.');
    }
    if (login && !password) return setError('Введи пароль.');
    if (register && name.trim().length === 1)
      return setError('Имя должно содержать хотя бы 2 символа.');
    if ((register || reset) && (password.length < 8 || !password.trim())) {
      return setError('Пароль должен содержать минимум 8 символов.');
    }
    if ((register || reset) && password !== confirmation)
      return setError('Пароли не совпадают.');

    setBusy(true);
    try {
      switch (mode) {
        case 'login':
          await signIn(normalizedEmail, password);
          await (
            rememberEmail
              ? AsyncStorage.setItem(REMEMBERED_EMAIL, normalizedEmail)
              : AsyncStorage.removeItem(REMEMBERED_EMAIL)
          ).catch(() => undefined);
          break;
        case 'register':
          await authApi.register({
            email: normalizedEmail,
            password,
            displayName: name.trim() || undefined,
          });
          router.replace({
            pathname: '/login',
            params: { status: 'registered' },
          });
          break;
        case 'forgot':
          await authApi.forgotPassword(normalizedEmail);
          setSent(true);
          break;
        case 'reset': {
          const code =
            token.match(/[?&]token=([a-f0-9]{64})(?:[&#]|$)/i)?.[1] ?? token;
          await authApi.resetPassword(code, password);
          router.replace({ pathname: '/login', params: { status: 'reset' } });
          break;
        }
      }
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : 'Произошла ошибка. Попробуй ещё раз.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Image
              source={require('@/assets/img/logo.png')}
              style={styles.logo}
              accessibilityLabel="Fridgy"
            />
            <View style={styles.card}>
              <Text accessibilityRole="header" style={styles.title}>
                {text.title}
              </Text>
              {Boolean(text.detail) && (
                <Text style={styles.detail}>{text.detail}</Text>
              )}

              {login && params.status === 'registered' && (
                <Text accessibilityLiveRegion="polite" style={styles.notice}>
                  Аккаунт создан. Войди с новым паролем.
                </Text>
              )}
              {login && params.status === 'reset' && (
                <Text accessibilityLiveRegion="polite" style={styles.notice}>
                  Пароль изменён. Теперь можно войти.
                </Text>
              )}
              {sent ? (
                <Text accessibilityLiveRegion="polite" style={styles.notice}>
                  Если аккаунт с таким email существует, мы отправили
                  инструкцию.
                </Text>
              ) : (
                <>
                  {register && (
                    <View style={styles.field}>
                      <Text style={styles.label}>Имя (необязательно)</Text>
                      <TextInput
                        accessibilityLabel="Имя"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        autoComplete="name"
                        maxLength={100}
                        editable={!busy}
                      />
                    </View>
                  )}
                  {!reset && (
                    <View style={styles.field}>
                      <Text style={styles.label}>Email</Text>
                      <TextInput
                        accessibilityLabel="Email"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!busy}
                      />
                    </View>
                  )}
                  {reset && !params.token && (
                    <View style={styles.field}>
                      <Text style={styles.label}>Код или ссылка из письма</Text>
                      <TextInput
                        accessibilityLabel="Код или ссылка из письма"
                        style={styles.input}
                        value={resetToken}
                        onChangeText={setResetToken}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!busy}
                      />
                    </View>
                  )}
                  {mode !== 'forgot' && (
                    <View style={styles.field}>
                      <Text style={styles.label}>
                        {reset ? 'Новый пароль' : 'Пароль'}
                      </Text>
                      <View style={styles.password}>
                        <TextInput
                          accessibilityLabel={reset ? 'Новый пароль' : 'Пароль'}
                          style={[styles.input, styles.passwordInput]}
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          autoComplete={
                            login ? 'current-password' : 'new-password'
                          }
                          maxLength={128}
                          editable={!busy}
                          onSubmitEditing={
                            login ? () => void submit() : undefined
                          }
                        />
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={
                            showPassword ? 'Скрыть пароль' : 'Показать пароль'
                          }
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.eye}
                        >
                          <Ionicons
                            name={
                              showPassword ? 'eye-off-outline' : 'eye-outline'
                            }
                            size={22}
                            color="#466274"
                          />
                        </Pressable>
                      </View>
                    </View>
                  )}
                  {(register || reset) && (
                    <View style={styles.field}>
                      <Text style={styles.label}>Повтори пароль</Text>
                      <TextInput
                        accessibilityLabel="Повтори пароль"
                        style={styles.input}
                        value={confirmation}
                        onChangeText={setConfirmation}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        maxLength={128}
                        editable={!busy}
                        onSubmitEditing={() => void submit()}
                      />
                    </View>
                  )}
                  {login && (
                    <View style={styles.options}>
                      <Pressable
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: rememberEmail }}
                        disabled={busy}
                        onPress={() => setRememberEmail(!rememberEmail)}
                        style={styles.remember}
                      >
                        <Ionicons
                          name={rememberEmail ? 'checkbox' : 'square-outline'}
                          size={20}
                          color="#176DAA"
                        />
                        <Text style={styles.label}>Запомнить email</Text>
                      </Pressable>
                      <Link href="/forgot-password" style={styles.link}>
                        Забыли пароль?
                      </Link>
                    </View>
                  )}
                  {Boolean(error) && (
                    <Text accessibilityRole="alert" style={styles.error}>
                      {error}
                    </Text>
                  )}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ busy, disabled: busy }}
                    disabled={busy}
                    onPress={() => void submit()}
                    style={({ pressed }) => [
                      styles.submit,
                      (pressed || busy) && styles.dimmed,
                    ]}
                  >
                    {busy ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.submitText}>{text.submit}</Text>
                    )}
                  </Pressable>
                </>
              )}
              {mode === 'forgot' && (
                <Link href="/reset-password" style={styles.footer}>
                  У меня есть ссылка
                </Link>
              )}
              {login ? (
                <Link href="/register" style={styles.footer}>
                  Создать аккаунт
                </Link>
              ) : (
                <Link href="/login" replace style={styles.footer}>
                  Вернуться ко входу
                </Link>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6FAFC' },
  fill: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: { width: '100%', maxWidth: 440, alignItems: 'center', gap: 20 },
  logo: { width: 110, height: 80, resizeMode: 'contain' },
  card: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 22,
    gap: 16,
  },
  title: { color: '#192C38', fontSize: 27, fontWeight: '700' },
  detail: { color: '#466274', lineHeight: 20 },
  field: { gap: 6 },
  label: { color: '#192C38', fontWeight: '500', fontSize: 14 },
  input: {
    backgroundColor: '#F6FAFC',
    minHeight: 49,
    borderWidth: 1,
    borderColor: '#CBDCE7',
    borderRadius: 12,
    paddingHorizontal: 12,
    color: '#192C38',
    fontSize: 16,
  },
  password: { position: 'relative', justifyContent: 'center' },
  passwordInput: { paddingRight: 50 },
  eye: { position: 'absolute', right: 0, padding: 12 },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    gap: 6,
  },
  link: { color: '#176DAA', fontSize: 14, fontWeight: '600' },
  footer: {
    color: '#176DAA',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 4,
  },
  submit: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#176DAA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  dimmed: { opacity: 0.65 },
  error: { color: '#AC2222', lineHeight: 20 },
  notice: {
    color: '#165D43',
    backgroundColor: '#E9F8EF',
    borderRadius: 10,
    padding: 10,
    lineHeight: 20,
  },
});
