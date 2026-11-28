import { useState } from 'react';

import { authApi } from '@/api/auth';
import { humanizeError } from '@/api/errors';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthFooterLink } from '@/components/auth/auth-footer-link';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormError } from '@/components/auth/form-error';
import { StatusView } from '@/components/auth/status-view';
import { validateEmail } from '@/lib/validation';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationError = validateEmail(email);
  const emailError = submitted ? validationError : undefined;

  const submit = async () => {
    if (loading) return;
    setSubmitted(true);
    setFormError(null);
    if (validationError) return;

    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (e) {
      setFormError(humanizeError(e, 'Не удалось отправить письмо'));
    } finally {
      setLoading(false);
    }
  };

  // Экран «Проверьте почту!» (кнопка отправляет ссылку повторно)
  if (sent) {
    return (
      <AuthLayout
        bottom={
          <AuthButton title="Отправить ссылку" onPress={submit} loading={loading} />
        }
      >
        <StatusView
          kind="mail"
          title="Проверьте почту!"
          text={`Мы отправили ссылку для сброса пароля на ${email.trim().toLowerCase()}`}
        />
        <FormError message={formError} />
        <AuthFooterLink text="Вспомнили пароль?" link="Войти" href="/login" />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Забыли пароль?"
      hint="Введите email, и мы пришлём ссылку для создания нового пароля."
      bottom={
        <>
          <FormError message={formError} />
          <AuthButton
            title="Отправить ссылку"
            onPress={submit}
            loading={loading}
            disabled={!!emailError}
          />
        </>
      }
    >
      <AuthInput
        icon="mail-open-outline"
        placeholder="Email"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          setFormError(null);
        }}
        error={emailError}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        onSubmitEditing={submit}
      />
      <AuthFooterLink text="Вспомнили пароль?" link="Войти" href="/login" />
    </AuthLayout>
  );
}
