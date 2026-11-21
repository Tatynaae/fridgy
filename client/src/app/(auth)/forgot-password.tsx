import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { authApi } from '@/api/auth';
import { AiCard } from '@/components/auth/ai-card';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthScreen } from '@/components/auth/auth-screen';
import { BigMailIcon, MailOpenIcon } from '@/components/auth/auth-icons';
import { ErrorBanner } from '@/components/auth/error-banner';
import { PrimaryButton } from '@/components/auth/primary-button';
import { StatusView } from '@/components/auth/status-view';
import { useAuthTheme } from '@/hooks/use-auth-theme';
import { errorMessage, isInputError, validateEmail } from '@/lib/validation';

// «Забыли пароль?» → ввод почты → «Проверьте почту!» (экраны Восстановление пароля / Ввод почты, Error, Mail).
export default function ForgotPasswordScreen() {
  const t = useAuthTheme();

  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [serverError, setServerError] = useState('');
  // true — ошибка в данных (4xx): подсвечиваем поля и блокируем кнопку до правки
  const [blocked, setBlocked] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailError = touched ? validateEmail(email) : undefined;

  const submit = async () => {
    setTouched(true);
    if (validateEmail(email)) return;

    setLoading(true);
    setServerError('');
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (error) {
      setBlocked(isInputError(error));
      setServerError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthScreen
        bottom={
          <PrimaryButton title="Отправить ссылку" onPress={submit} loading={loading} />
        }
      >
        <StatusView
          icon={<BigMailIcon color={t.link} />}
          title="Проверьте почту!"
          subtitle={`Мы отправили ссылку для сброса пароля на ${email.trim()}`}
        />
        <Link href="/reset-password" style={[styles.haveCode, { color: t.link }]}>
          У меня есть код из письма
        </Link>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Забыли пароль?"
      bottom={
        <PrimaryButton
          title="Отправить ссылку"
          onPress={submit}
          loading={loading}
          disabled={!!emailError || (!!serverError && blocked)}
        />
      }
    >
      <AiCard text="Введите email, и мы пришлём ссылку для создания нового пароля." />

      {serverError ? <ErrorBanner text={serverError} /> : null}

      <AuthInput
        icon={(color) => <MailOpenIcon color={color} />}
        placeholder="Email"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          setServerError('');
        }}
        onBlur={() => setTouched(true)}
        error={emailError}
        invalid={!!serverError && blocked}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="go"
        onSubmitEditing={submit}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  haveCode: {
    alignSelf: 'center',
    marginTop: 8,
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
});
