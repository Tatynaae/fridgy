import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View, type TextInput } from 'react-native';

import { AiCard } from '@/components/auth/ai-card';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthScreen } from '@/components/auth/auth-screen';
import { ErrorBanner } from '@/components/auth/error-banner';
import { LockIcon, MailOpenIcon } from '@/components/auth/auth-icons';
import { PrimaryButton } from '@/components/auth/primary-button';
import { SocialSection } from '@/components/auth/social-section';
import { useAuth } from '@/context/auth-context';
import { useAuthTheme } from '@/hooks/use-auth-theme';
import { errorMessage, isInputError, validateEmail } from '@/lib/validation';

export default function SignInScreen() {
  const t = useAuthTheme();
  const { signIn } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [serverError, setServerError] = useState('');
  // true — ошибка в данных (4xx): подсвечиваем поля и блокируем кнопку до правки
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailError = touched.email ? validateEmail(email) : undefined;
  const passwordError = touched.password && !password ? 'Введите пароль' : undefined;
  const hasErrors = !!emailError || !!passwordError;

  const submit = async () => {
    setTouched({ email: true, password: true });
    if (validateEmail(email) || !password) return;

    setLoading(true);
    setServerError('');
    try {
      await signIn(email.trim(), password);
      // Дальше навигацию делает Stack.Protected в корневом layout.
    } catch (error) {
      setBlocked(isInputError(error));
      setServerError(errorMessage(error, { 401: 'Неверный email или пароль' }));
      setLoading(false);
    }
  };

  return (
    <AuthScreen title="Войти">
      <AiCard text="Войдите, чтобы сохранять рецепты и сканировать продукты." />

      {serverError ? <ErrorBanner text={serverError} /> : null}

      <View style={styles.inputs}>
        <AuthInput
          icon={(color) => <MailOpenIcon color={color} />}
          placeholder="Email"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setServerError('');
          }}
          onBlur={() => setTouched((s) => ({ ...s, email: true }))}
          error={emailError}
          invalid={!!serverError && blocked}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <AuthInput
          ref={passwordRef}
          icon={(color) => <LockIcon color={color} />}
          placeholder="Пароль"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setServerError('');
          }}
          onBlur={() => setTouched((s) => ({ ...s, password: true }))}
          error={passwordError}
          invalid={!!serverError && blocked}
          password
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </View>

      <Link href="/forgot-password" style={[styles.forgot, { color: t.link }]}>
        Забыли пароль?
      </Link>

      <PrimaryButton
        title="Войти"
        onPress={submit}
        loading={loading}
        disabled={hasErrors || (!!serverError && blocked)}
      />

      <SocialSection />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: t.secondary }]}>Нет аккаунта?</Text>
        <Link href="/sign-up" style={[styles.footerLink, { color: t.link }]}>
          Зарегистрироваться
        </Link>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  inputs: { gap: 12 },
  forgot: {
    alignSelf: 'flex-end',
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  footerText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  footerLink: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
});
