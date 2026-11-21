import { useState } from 'react';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthFooterLink } from '@/components/auth/auth-footer-link';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormError } from '@/components/auth/form-error';
import { SocialButtons } from '@/components/auth/social-buttons';
import { useAuth } from '@/context/auth-context';
import { validateEmail } from '@/lib/validation';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasErrors = !!(errors.email || errors.password);

  const submit = async () => {
    const next = {
      email: validateEmail(email),
      password: password ? undefined : 'Введите пароль',
    };
    setErrors(next);
    setFormError(null);
    if (next.email || next.password) return;

    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      // редирект на главную делает AuthGate в _layout
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Войти"
      hint="Войдите, чтобы сохранять рецепты и сканировать продукты."
    >
      <AuthInput
        icon="mail-open-outline"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <AuthInput
        icon="lock-closed-outline"
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        password
        autoComplete="current-password"
        textContentType="password"
        onSubmitEditing={submit}
      />
      <Link href="/forgot-password" style={styles.forgot}>
        Забыли пароль?
      </Link>
      <FormError message={formError} />
      <AuthButton title="Войти" onPress={submit} loading={loading} disabled={hasErrors} />
      <SocialButtons onPress={(p) => setFormError(`Вход через ${p} скоро появится`)} />
      <AuthFooterLink text="Нет аккаунта?" link="Зарегистрироваться" href="/register" />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  forgot: {
    alignSelf: 'flex-end',
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: '#168CE1',
    marginVertical: 4,
  },
});
