import { useState } from 'react';

import { humanizeError } from '@/api/errors';
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
  // Ошибки показываем после первой попытки отправки и дальше пересчитываем на каждый ввод,
  // поэтому красная рамка гаснет, как только поле исправлено
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validation = {
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
    confirm: confirm !== password ? 'Пароли не совпадают' : undefined,
    terms: accepted ? undefined : 'Примите условия, чтобы продолжить',
  };
  const isValid = !Object.values(validation).some(Boolean);
  const errors: Partial<typeof validation> = submitted ? validation : {};

  // Обёртка: при любом изменении убираем серверную ошибку
  const edit =
    <T,>(setter: (v: T) => void) =>
    (value: T) => {
      setter(value);
      setFormError(null);
    };

  const submit = async () => {
    if (loading) return;
    setSubmitted(true);
    setFormError(null);
    if (!isValid) return;

    setLoading(true);
    try {
      await signUp({
        email: email.trim().toLowerCase(),
        password,
        displayName: name.trim() || undefined,
      });
    } catch (e) {
      setFormError(humanizeError(e, 'Не удалось зарегистрироваться'));
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
        onChangeText={edit(setName)}
        error={errors.name}
        autoCapitalize="words"
        textContentType="name"
        maxLength={100}
      />
      <AuthInput
        icon="mail-open-outline"
        placeholder="Email"
        value={email}
        onChangeText={edit(setEmail)}
        error={errors.email}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <AuthInput
        icon="lock-closed-outline"
        placeholder="Пароль"
        value={password}
        onChangeText={edit(setPassword)}
        error={errors.password}
        password
        textContentType="newPassword"
        maxLength={128}
      />
      <AuthInput
        icon="lock-closed-outline"
        placeholder="Повторить пароль"
        value={confirm}
        onChangeText={edit(setConfirm)}
        error={errors.confirm}
        password
        textContentType="newPassword"
        maxLength={128}
        onSubmitEditing={submit}
      />
      <TermsCheckbox
        checked={accepted}
        onToggle={() => edit(setAccepted)(!accepted)}
        error={errors.terms}
      />
      <FormError message={formError} />
      <AuthButton
        title="Зарегистрироваться"
        onPress={submit}
        loading={loading}
        disabled={submitted && !isValid}
      />
      <SocialButtons onPress={(p) => setFormError(`Вход через ${p} скоро появится`)} />
      <AuthFooterLink text="Уже есть аккаунт?" link="Войти" href="/login" />
    </AuthLayout>
  );
}
