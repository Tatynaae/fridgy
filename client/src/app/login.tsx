import { useState } from 'react';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { humanizeError } from '@/api/errors';
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
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validation = {
    email: validateEmail(email),
    password: password ? undefined : 'Введите пароль',
  };
  const isValid = !validation.email && !validation.password;
  const errors: Partial<typeof validation> = submitted ? validation : {};

  const submit = async () => {
    if (loading) return;
    setSubmitted(true);
    setFormError(null);
    if (!isValid) return;

    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      // редирект на главную делает AuthGate в _layout
    } catch (e) {
      setFormError(humanizeError(e, 'Не удалось войти'));
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
        onChangeText={(v) => {
          setEmail(v);
          setFormError(null);
        }}
        error={errors.email}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <AuthInput
        icon="lock-closed-outline"
        placeholder="Пароль"
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          setFormError(null);
        }}
        error={errors.password}
        password
        autoComplete="current-password"
        textContentType="password"
        maxLength={128}
        onSubmitEditing={submit}
      />
      <Link href="/forgot-password" style={styles.forgot}>
        Забыли пароль?
      </Link>
      <FormError message={formError} />
      <AuthButton
        title="Войти"
        onPress={submit}
        loading={loading}
        disabled={submitted && !isValid}
      />
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
