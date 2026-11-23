import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/auth';
import { authErrorMessage } from '@/lib/api';
import AuthInput from './auth-input';
import { AuthLayout, authColors, ErrorBanner, PrimaryButton } from './auth-layout';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ onSwitch }: { onSwitch: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const emailError = !EMAIL_RE.test(email.trim()) ? 'Некорректный email' : null;
  const passwordError = password.length === 0 ? 'Введите пароль' : null;
  const hasErrors = Boolean(emailError || passwordError);

  const onSubmit = async () => {
    setSubmitted(true);
    setServerError(null);
    if (hasErrors) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setServerError(authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Войти">
      {serverError ? <ErrorBanner message={serverError} /> : null}

      <View style={styles.fields}>
        <AuthInput
          icon="mail-open-outline"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          error={submitted ? emailError : null}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <AuthInput
          icon="lock-closed-outline"
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          error={submitted ? passwordError : null}
          password
          autoCapitalize="none"
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <PrimaryButton label="Войти" onPress={onSubmit} loading={loading} faded={submitted && hasErrors} />
      </View>

      <Text style={styles.footer}>
        Нет аккаунта?{' '}
        <Text style={styles.link} onPress={onSwitch}>
          Зарегистрироваться
        </Text>
      </Text>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  fields: { gap: 12 },
  link: { color: authColors.link },
  footer: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: authColors.muted,
    textAlign: 'center',
    marginTop: 20,
  },
});