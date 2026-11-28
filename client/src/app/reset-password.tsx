import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { authApi } from '@/api/auth';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormError } from '@/components/auth/form-error';
import { StatusView } from '@/components/auth/status-view';

// Открывается по ссылке из письма: <FRONTEND_URL>/reset-password?token=...
export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const next = {
      password:
        password.length < 8
          ? 'Минимум 8 символов'
          : password.length > 128
            ? 'Максимум 128 символов'
            : undefined,
      confirm: confirm !== password ? 'Пароли не совпадают' : undefined,
    };
    setErrors(next);
    setFormError(null);
    if (next.password || next.confirm) return;

    if (!token) {
      setFormError('Ссылка недействительна. Запросите сброс пароля заново.');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Не удалось сменить пароль');
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
            disabled={!!(errors.password || errors.confirm)}
          />
        </>
      }
    >
      <AuthInput
        icon="lock-closed-outline"
        placeholder="Новый пароль"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        password
        textContentType="newPassword"
      />
      <AuthInput
        icon="lock-closed-outline"
        placeholder="Повторить пароль"
        value={confirm}
        onChangeText={setConfirm}
        error={errors.confirm}
        password
        textContentType="newPassword"
        onSubmitEditing={submit}
      />
    </AuthLayout>
  );
}
