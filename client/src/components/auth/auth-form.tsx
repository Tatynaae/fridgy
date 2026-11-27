import { router, useNavigation } from 'expo-router';
import { useRef, useState } from 'react';
import { View } from 'react-native';

import { AuthRequestError, authApi, authErrorMessage } from '@/auth/api';
import { SessionStorageError, useAuthSession } from '@/auth/session';

import {
  AuthAlternatives,
  AuthButton,
  AuthConfirmation,
  AuthConsent,
  AuthError,
  AuthField,
  AuthHint,
  AuthLink,
  AuthPage,
  AuthTitle,
  authLayout,
} from './auth-ui';

type Mode = 'sign-in' | 'register' | 'forgot-password' | 'reset-password';
type FormValues = { name: string; email: string; password: string; repeated: string; consent: boolean };
type FormErrors = Partial<Record<keyof FormValues, string>>;
type RequestFailure = { message: string; field?: 'email' };
type Stage = 'form' | 'mail' | 'registered' | 'reset';

const copy = {
  'sign-in': {
    title: 'Войти',
    hint: 'Войдите, чтобы сохранять рецепты и сканировать продукты.',
    submit: 'Войти',
  },
  register: {
    title: 'Создать аккаунт',
    hint: 'Сохраняй рецепты и получай идеи для себя.',
    submit: 'Зарегистрироваться',
  },
  'forgot-password': {
    title: 'Забыли пароль?',
    hint: 'Введите email, и мы пришлём ссылку для создания нового пароля.',
    submit: 'Отправить ссылку',
  },
  'reset-password': {
    title: 'Новый пароль',
    hint: 'Придумайте пароль не короче 8 символов.',
    submit: 'Сохранить пароль',
  },
};

function validate(mode: Mode, values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (mode !== 'reset-password' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Некорректный email';
  }
  if (mode === 'register') {
    if (values.name.trim().length < 2) errors.name = 'Некорректное имя';
    if (!values.consent) errors.consent = 'Примите условия и политику конфиденциальности';
  }
  if (mode === 'sign-in' && !values.password) errors.password = 'Введите пароль';
  if (mode === 'register' || mode === 'reset-password') {
    if (!values.password.trim() || values.password.length < 8) {
      errors.password = 'Введите не менее 8 символов';
    }
    if (!values.repeated) {
      errors.repeated = 'Повторите пароль';
    } else if (values.password !== values.repeated) {
      errors.password ??= 'Пароли не совпадают';
      errors.repeated = 'Пароли не совпадают';
    }
  }
  return errors;
}

export function AuthForm({ mode, resetToken }: { mode: Mode; resetToken?: string }) {
  const navigation = useNavigation();
  const { signIn: signInAccount, register: registerAccount } = useAuthSession();
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [values, setValues] = useState<FormValues>({
    name: '', email: '', password: '', repeated: '', consent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [failure, setFailure] = useState<RequestFailure>();
  const [stage, setStage] = useState<Stage>('form');

  const register = mode === 'register';
  const signIn = mode === 'sign-in';
  const forgot = mode === 'forgot-password';
  const reset = mode === 'reset-password';
  const email = values.email.trim().toLowerCase();
  const issues = submitted ? validate(mode, values) : {};
  const missingToken = reset && !resetToken;
  const message = missingToken ? 'Ссылка для сброса недействительна. Запросите новую ссылку.' : failure?.message;
  const { title, hint, submit } = copy[mode];

  function change<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setFailure(undefined);
  }

  async function run(
    action: () => Promise<void>,
    onError: (error: unknown) => RequestFailure = (error) => ({ message: authErrorMessage(error) }),
  ) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setFailure(undefined);
    try {
      await action();
    } catch (error) {
      setFailure(error instanceof SessionStorageError ? { message: error.message } : onError(error));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  async function enterApp() {
    await signInAccount(email, values.password, () => navigation.isFocused());
  }

  function goBack() {
    if (busy) return;
    if (stage === 'mail') {
      setFailure(undefined);
      setStage('form');
    } else if (stage === 'registered' || stage === 'reset') {
      router.dismissTo('/sign-in');
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/sign-in');
    }
  }

  function submitForm() {
    setSubmitted(true);
    if (missingToken || Object.keys(validate(mode, values)).length > 0) return;

    void run(async () => {
      switch (mode) {
        case 'sign-in':
          await enterApp();
          break;
        case 'register':
          await registerAccount(email, values.password, values.name.trim());
          setStage('registered');
          break;
        case 'forgot-password':
          await authApi.sendResetLink(email);
          setStage('mail');
          break;
        case 'reset-password':
          if (!resetToken) return;
          await authApi.resetPassword(resetToken, values.password);
          setStage('reset');
          break;
      }
    }, (error) => {
      if (error instanceof AuthRequestError) {
        if (signIn && error.status === 401) {
          return { message: 'Неверный email или пароль', field: 'email' };
        }
        if (register && error.status === 409) {
          return { message: 'Этот email уже зарегистрирован. Войдите или восстановите пароль.' };
        }
        if (reset && error.status === 401) {
          return { message: 'Ссылка для сброса недействительна или устарела. Запросите новую ссылку.' };
        }
      }
      return { message: authErrorMessage(error) };
    });
  }

  const formButton = (
    <AuthButton onPress={submitForm} disabled={busy || missingToken} faded={Boolean(failure || Object.keys(issues).length)}>
      {busy ? 'Подождите…' : submit}
    </AuthButton>
  );

  if (stage !== 'form') {
    let confirmation;
    switch (stage) {
      case 'mail':
        confirmation = {
          title: 'Проверьте почту!',
          description: `Если аккаунт существует, мы отправим ссылку для сброса пароля на ${email}.`,
          label: 'Отправить ссылку',
          onPress: () => void run(async () => { await authApi.sendResetLink(email); }),
        };
        break;
      case 'registered':
        confirmation = {
          title: 'Аккаунт создан!',
          description: 'Добро пожаловать в Fridgy. Давай найдём, что приготовить сегодня.',
          label: 'Начать',
          onPress: () => void run(enterApp),
        };
        break;
      case 'reset':
        confirmation = {
          title: 'Пароль обновлен!',
          description: 'Теперь можно войти с новым паролем.',
          label: 'Войти',
          onPress: () => router.dismissTo('/sign-in'),
        };
        break;
    }
    return (
      <AuthPage onBack={goBack}>
        <AuthConfirmation
          title={confirmation.title}
          description={confirmation.description}
          icon={stage === 'mail' ? 'mail' : 'check'}
          footer={
            <>
              {failure && <AuthError>{failure.message}</AuthError>}
              <AuthButton onPress={confirmation.onPress} disabled={busy}>
                {busy ? 'Подождите…' : confirmation.label}
              </AuthButton>
            </>
          }
        />
      </AuthPage>
    );
  }

  return (
    <AuthPage onBack={signIn ? undefined : goBack}>
      <AuthTitle>{title}</AuthTitle>
      <View style={authLayout.form}>
        <AuthHint>{hint}</AuthHint>
        {message && <AuthError>{message}</AuthError>}
        <View style={authLayout.fields}>
          {register && (
            <AuthField label="Имя" icon="name" autoComplete="name" maxLength={100}
              editable={!busy} value={values.name} error={issues.name}
              onChangeText={(value) => change('name', value)} />
          )}
          {!reset && (
            <AuthField label="Email" icon="email" keyboardType="email-address" autoComplete="email"
              editable={!busy} value={values.email} error={issues.email} invalid={failure?.field === 'email'}
              onChangeText={(value) => change('email', value)}
              onSubmitEditing={forgot ? submitForm : undefined} />
          )}
          {!forgot && (
            <AuthField label={reset ? 'Новый пароль' : 'Пароль'} icon="password" maxLength={128}
              autoComplete={signIn ? 'current-password' : 'new-password'}
              editable={!busy && !missingToken} value={values.password} error={issues.password}
              onChangeText={(value) => change('password', value)}
              onSubmitEditing={signIn ? submitForm : undefined} />
          )}
          {(register || reset) && (
            <AuthField label="Повторить пароль" icon="password" maxLength={128} autoComplete="new-password"
              editable={!busy && !missingToken} value={values.repeated} error={issues.repeated}
              onChangeText={(value) => change('repeated', value)}
              onSubmitEditing={reset ? submitForm : undefined} />
          )}
        </View>
        {signIn && (
          <View style={authLayout.alignRight}>
            <AuthLink disabled={busy} onPress={() => router.push('/forgot-password')}>Забыли пароль?</AuthLink>
          </View>
        )}
        {register && <AuthConsent checked={values.consent} error={issues.consent}
          onPress={() => { if (!busy) change('consent', !values.consent); }} />}
        {(register || signIn) && (
          <>
            {formButton}
            <AuthAlternatives registration={register} disabled={busy}
              onSwitch={() => register ? router.dismissTo('/sign-in') : router.push('/register')} />
          </>
        )}
      </View>
      {(forgot || reset) && (
        <View style={authLayout.stickyFooter}>
          {reset && message && (
            <AuthLink disabled={busy} onPress={() => router.dismissTo('/forgot-password')}>Запросить новую ссылку</AuthLink>
          )}
          {formButton}
        </View>
      )}
    </AuthPage>
  );
}
