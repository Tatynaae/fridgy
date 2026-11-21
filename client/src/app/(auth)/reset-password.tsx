import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View, type TextInput } from 'react-native';

import { authApi } from '@/api/auth';
import { AiCard } from '@/components/auth/ai-card';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthScreen } from '@/components/auth/auth-screen';
import { BigCheckIcon, LockIcon, MailOpenIcon } from '@/components/auth/auth-icons';
import { ErrorBanner } from '@/components/auth/error-banner';
import { PrimaryButton } from '@/components/auth/primary-button';
import { StatusView } from '@/components/auth/status-view';
import { useAuthTheme } from '@/hooks/use-auth-theme';
import { errorMessage, isInputError, validateConfirm, validatePassword } from '@/lib/validation';

// Ссылка из письма: <FRONTEND_URL>/reset-password?token=... Экраны «Новый пароль» и «Success».
// Если токена в ссылке нет, показываем дополнительное поле для кода из письма.
export default function ResetPasswordScreen() {
  const t = useAuthTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();
  const hasLinkToken = !!params.token;
  const confirmRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [token, setToken] = useState(params.token ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({ token: false, password: false, confirm: false });
  const [serverError, setServerError] = useState('');
  // true — ошибка в данных (4xx): подсвечиваем поля и блокируем кнопку до правки
  const [blocked, setBlocked] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const tokenError = touched.token && !token.trim() ? 'Вставьте код из письма' : undefined;
  const passwordError = touched.password ? validatePassword(password) : undefined;
  const confirmError = touched.confirm ? validateConfirm(password, confirm) : undefined;
  const hasErrors = !!tokenError || !!passwordError || !!confirmError;

  const submit = async () => {
    setTouched({ token: true, password: true, confirm: true });
    if (!token.trim() || validatePassword(password) || validateConfirm(password, confirm)) return;

    setLoading(true);
    setServerError('');
    try {
      await authApi.resetPassword({ token: token.trim(), newPassword: password });
      setDone(true);
    } catch (error) {
      setBlocked(isInputError(error));
      setServerError(errorMessage(error, { 401: 'Ссылка недействительна или устарела' }));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthScreen bottom={<PrimaryButton title="Войти" onPress={() => router.replace('/sign-in')} />}>
        <StatusView
          icon={<BigCheckIcon color={t.success} />}
          title="Пароль обновлен!"
          subtitle="Теперь можно войти с новым паролем."
        />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Новый пароль"
      bottom={
        <PrimaryButton
          title="Сохранить пароль"
          onPress={submit}
          loading={loading}
          disabled={hasErrors || (!!serverError && blocked)}
        />
      }
    >
      <AiCard text="Придумайте пароль не короче 8 символов." />

      {serverError ? <ErrorBanner text={serverError} /> : null}

      <View style={styles.inputs}>
        {hasLinkToken ? null : (
          <AuthInput
            icon={(color) => <MailOpenIcon color={color} />}
            placeholder="Код из письма"
            value={token}
            onChangeText={(v) => {
              setToken(v);
              setServerError('');
            }}
            onBlur={() => setTouched((s) => ({ ...s, token: true }))}
            error={tokenError}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        )}

        <AuthInput
          ref={passwordRef}
          icon={(color) => <LockIcon color={color} />}
          placeholder="Новый пароль"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setServerError('');
          }}
          onBlur={() => setTouched((s) => ({ ...s, password: true }))}
          error={passwordError}
          password
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
        />

        <AuthInput
          ref={confirmRef}
          icon={(color) => <LockIcon color={color} />}
          placeholder="Повторить пароль"
          value={confirm}
          onChangeText={(v) => {
            setConfirm(v);
            setServerError('');
          }}
          onBlur={() => setTouched((s) => ({ ...s, confirm: true }))}
          error={confirmError}
          password
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  inputs: { gap: 12 },
});
