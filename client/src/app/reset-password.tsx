import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { authApi } from '@/api/auth';
import { humanizeError } from '@/api/errors';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormError } from '@/components/auth/form-error';
import { StatusView } from '@/components/auth/status-view';
import { validatePassword } from '@/lib/validation';

// Открывается по ссылке из письма: <FRONTEND_URL>/reset-password?token=...
export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Те же правила, что при регистрации (включая «не только пробелы»)
  const validation = {
    password: validatePassword(password),
    confirm: confirm !== password ? 'Пароли не совпадают' : undefined,
  };
  const isValid = !validation.password && !validation.confirm;
  const errors: { password?: string; confirm?: string } = submitted ? validation : {};

  const submit = async () => {
    if (loading) return;
    setSubmitted(true);
    setFormError(null);
    if (!isValid) return;

    if (!token) {
      setFormError('Ссылка недействительна. Запросите сброс пароля заново.');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch (e) {
      setFormError(humanizeError(e, 'Не удалось сменить пароль'));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout
        bottom={<AuthButton title="Войти" onPress={() => router.replace('/login')} />}
      >
        <StatusView
          kind="success"
          title="Пароль обновлён!"
          text="Теперь можно войти с новым паролем."
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Новый пароль"
      hint="Придумайте пароль не короче 8 символов."
      bottom={
        <>
          <FormError message={formError} />
          <AuthButton
            title="Сохранить пароль"
            onPress={submit}
            loading={loading}
            disabled={submitted && !isValid}
          />
        </>
      }
    >
      <AuthInput
        icon="lock-closed-outline"
        placeholder="Новый пароль"
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          setFormError(null);
        }}
        error={errors.password}
        password
        textContentType="newPassword"
      />
      <AuthInput
        icon="lock-closed-outline"
        placeholder="Повторить пароль"
        value={confirm}
        onChangeText={(v) => {
          setConfirm(v);
          setFormError(null);
        }}
        error={errors.confirm}
        password
        textContentType="newPassword"
        onSubmitEditing={submit}
      />
    </AuthLayout>
  );
}
