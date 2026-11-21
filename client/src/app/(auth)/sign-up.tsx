import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { authApi } from '@/api/auth';
import { AiCard } from '@/components/auth/ai-card';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthScreen } from '@/components/auth/auth-screen';
import { ErrorBanner } from '@/components/auth/error-banner';
import { LockIcon, MailOpenIcon, UserIcon } from '@/components/auth/auth-icons';
import { PrimaryButton } from '@/components/auth/primary-button';
import { SocialSection } from '@/components/auth/social-section';
import { useAuth } from '@/context/auth-context';
import { useAuthTheme } from '@/hooks/use-auth-theme';
import {
  errorMessage,
  isInputError,
  validateConfirm,
  validateEmail,
  validateName,
  validatePassword,
} from '@/lib/validation';

type Field = 'name' | 'email' | 'password' | 'confirm' | 'terms';

export default function SignUpScreen() {
  const t = useAuthTheme();
  const { signIn } = useAuth();
  const registeredFor = useRef<string | null>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    name: false,
    email: false,
    password: false,
    confirm: false,
    terms: false,
  });
  const [serverError, setServerError] = useState('');
  // true — ошибка в данных (4xx): подсвечиваем поля и блокируем кнопку до правки
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const touch = (field: Field) => setTouched((s) => ({ ...s, [field]: true }));
  const edit = () => setServerError('');

  const allErrors = {
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
    confirm: validateConfirm(password, confirm),
    terms: accepted ? undefined : 'Необходимо согласие с условиями',
  };
  const shown = {
    name: touched.name ? allErrors.name : undefined,
    email: touched.email ? allErrors.email : undefined,
    password: touched.password ? allErrors.password : undefined,
    confirm: touched.confirm ? allErrors.confirm : undefined,
    terms: touched.terms ? allErrors.terms : undefined,
  };
  const hasErrors = Object.values(shown).some(Boolean);

  const submit = async () => {
    setTouched({ name: true, email: true, password: true, confirm: true, terms: true });
    if (Object.values(allErrors).some(Boolean)) return;

    setLoading(true);
    setServerError('');
    try {
      // register токен не возвращает → после него логинимся. Если аккаунт уже создан,
      // а вход упал (нет сети), повторное нажатие только логинит, а не ловит 409.
      if (registeredFor.current !== email.trim()) {
        await authApi.register({ email: email.trim(), password, displayName: name.trim() });
        registeredFor.current = email.trim();
      }
      await signIn(email.trim(), password);
    } catch (error) {
      setBlocked(isInputError(error));
      setServerError(errorMessage(error, { 409: 'Аккаунт с таким email уже существует' }));
      setLoading(false);
    }
  };

  return (
    <AuthScreen title="Создать аккаунт">
      <AiCard text="Сохраняй рецепты и получай идеи для себя." />

      {serverError ? <ErrorBanner text={serverError} /> : null}

      <View style={styles.inputs}>
        <AuthInput
          icon={(color) => <UserIcon color={color} />}
          placeholder="Имя"
          value={name}
          onChangeText={(v) => {
            setName(v);
            edit();
          }}
          onBlur={() => touch('name')}
          error={shown.name}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />

        <AuthInput
          ref={emailRef}
          icon={(color) => <MailOpenIcon color={color} />}
          placeholder="Email"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            edit();
          }}
          onBlur={() => touch('email')}
          error={shown.email}
          invalid={!!serverError && blocked}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <AuthInput
          ref={passwordRef}
          icon={(color) => <LockIcon color={color} />}
          placeholder="Пароль"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            edit();
          }}
          onBlur={() => touch('password')}
          error={shown.password}
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
            edit();
          }}
          onBlur={() => touch('confirm')}
          error={shown.confirm}
          password
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </View>

      <View style={styles.termsWrapper}>
        <Pressable
          style={styles.terms}
          onPress={() => {
            setAccepted((v) => !v);
            touch('terms');
            edit();
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: shown.terms ? t.danger : t.inputBorder },
              accepted && { backgroundColor: t.primary, borderColor: t.primary },
            ]}
          >
            {accepted ? <Ionicons name="checkmark" size={12} color="#FFFFFF" /> : null}
          </View>
          <Text style={[styles.termsText, { color: t.secondary }]}>
            Я принимаю <Text style={{ color: t.link }}>условия</Text> и{' '}
            <Text style={{ color: t.link }}>политику конфиденциальности</Text>
          </Text>
        </Pressable>
        {shown.terms ? <Text style={[styles.error, { color: t.danger }]}>{shown.terms}</Text> : null}
      </View>

      <PrimaryButton title="Зарегистрироваться" onPress={submit} loading={loading} disabled={hasErrors || (!!serverError && blocked)} />

      <SocialSection />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: t.secondary }]}>Уже есть аккаунт?</Text>
        <Link href="/sign-in" replace style={[styles.footerLink, { color: t.link }]}>
          Войти
        </Link>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  inputs: { gap: 12 },
  termsWrapper: { gap: 4 },
  terms: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    marginTop: 1,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    flex: 1,
    fontFamily: 'Manrope_400Regular',
    fontSize: 10,
    lineHeight: 14,
  },
  error: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 10,
    lineHeight: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  footerText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  footerLink: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
});
