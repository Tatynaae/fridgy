import { useState } from 'react';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthFooterLink } from '@/components/auth/auth-footer-link';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormError } from '@/components/auth/form-error';
import { SocialButtons } from '@/components/auth/social-buttons';
import { TermsCheckbox } from '@/components/auth/terms-checkbox';
import { useAuth } from '@/context/auth-context';
import { validateEmail, validateName, validatePassword } from '@/lib/validation';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasErrors = Object.values(errors).some(Boolean);

  const submit = async () => {
    const next = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: confirm !== password ? 'Пароли не совпадают' : undefined,
      terms: accepted ? undefined : 'Примите условия, чтобы продолжить',
    };
    setErrors(next);
    setFormError(null);
    if (Object.values(next).some(Boolean)) return;

    setLoading(true);
    try {
      await signUp({
        email: email.trim().toLowerCase(),
        password,
        displayName: name.trim() || undefined,
      });
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Создать аккаунт" hint="Сохраняй рецепты и получай идеи для себя.">
      <AuthInput
        icon="person-outline"
        placeholder="Имя"
        value={name}
        onChangeText={setName}
        error={errors.name}
        autoCapitalize="words"
        textContentType="name"
      />
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
      <TermsCheckbox
        checked={accepted}
        onToggle={() => setAccepted((v) => !v)}
        error={errors.terms}
      />
      <FormError message={formError} />
      <AuthButton
        title="Зарегистрироваться"
        onPress={submit}
        loading={loading}
        disabled={hasErrors}
      />
      <SocialButtons onPress={(p) => setFormError(`Вход через ${p} скоро появится`)} />
      <AuthFooterLink text="Уже есть аккаунт?" link="Войти" href="/login" />
    </AuthLayout>
  );
}
