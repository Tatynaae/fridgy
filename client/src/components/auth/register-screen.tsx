import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/auth';
import { authErrorMessage } from '@/lib/api';
import AuthInput from './auth-input';
import { AuthLayout, authColors, ErrorBanner, PrimaryButton } from './auth-layout';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ onSwitch }: { onSwitch: () => void }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const errors = {
    name: name.trim().length < 2 ? 'Некорректное имя' : null,
    email: !EMAIL_RE.test(email.trim()) ? 'Некорректный email' : null,
    password:
      password.length < 8 ? 'Минимум 8 символов' : confirm !== password ? 'Пароли не совпадают' : null,
    confirm: confirm !== password ? 'Пароли не совпадают' : null,
    terms: !accepted ? 'Необходимо согласие с условиями' : null,
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const shown = submitted ? errors : { name: null, email: null, password: null, confirm: null, terms: null };

  const onSubmit = async () => {
    setSubmitted(true);
    setServerError(null);
    if (hasErrors) return;
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (e) {
      setServerError(authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Создать аккаунт">
      <View style={styles.aiCard}>
        <Text style={styles.aiLabel}>AI-помощник</Text>
        <Text style={styles.aiText}>Сохраняй рецепты и получай идеи для себя.</Text>
      </View>

      {serverError ? <ErrorBanner message={serverError} /> : null}

      <View style={styles.fields}>
        <AuthInput icon="person-outline" placeholder="Имя" value={name} onChangeText={setName} error={shown.name} />
        <AuthInput
          icon="mail-open-outline"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          error={shown.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <AuthInput
          icon="lock-closed-outline"
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          error={shown.password}
          password
          autoCapitalize="none"
        />
        <AuthInput
          icon="lock-closed-outline"
          placeholder="Повторить пароль"
          value={confirm}
          onChangeText={setConfirm}
          error={shown.confirm}
          password
          autoCapitalize="none"
        />
      </View>

      <Pressable style={styles.terms} onPress={() => setAccepted((a) => !a)}>
        <View style={[styles.checkbox, accepted && styles.checkboxOn]}>
          {accepted && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </View>
        <Text style={styles.termsText}>
          Я принимаю <Text style={styles.link}>условия</Text> и{' '}
          <Text style={styles.link}>политику конфиденциальности</Text>
        </Text>
      </Pressable>
      {shown.terms ? <Text style={styles.termsError}>{shown.terms}</Text> : null}

      <View style={{ marginTop: 14 }}>
        <PrimaryButton
          label="Зарегистрироваться"
          onPress={onSubmit}
          loading={loading}
          faded={submitted && hasErrors}
        />
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Или</Text>
        <View style={styles.line} />
      </View>

      {/* Вход через Google/Apple на бэкенде не реализован, кнопки только по дизайну */}
      <View style={styles.socials}>
        <View style={styles.social}>
          <Text style={styles.socialText}>Google</Text>
        </View>
        <View style={styles.social}>
          <Text style={styles.socialText}>Apple</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Уже есть аккаунт?{' '}
        <Text style={styles.link} onPress={onSwitch}>
          Войти
        </Text>
      </Text>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  aiCard: { backgroundColor: '#E7F5FE', borderRadius: 20, padding: 14, gap: 8, marginBottom: 12 },
  aiLabel: { fontFamily: 'Manrope_600SemiBold', fontSize: 12, color: authColors.link },
  aiText: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: authColors.muted },
  fields: { gap: 12 },
  terms: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#8FA0AC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: authColors.primary, borderColor: authColors.primary },
  termsText: { flex: 1, fontFamily: 'Manrope_400Regular', fontSize: 11, color: authColors.muted },
  termsError: { fontFamily: 'Manrope_400Regular', fontSize: 11, color: '#D94C4C', marginTop: 4 },
  link: { color: authColors.link },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#B5C2CB' },
  dividerText: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: authColors.muted },
  socials: { flexDirection: 'row', gap: 20, marginTop: 20 },
  social: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDF2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: { fontFamily: 'Manrope_500Medium', fontSize: 14, color: authColors.text },
  footer: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: authColors.muted,
    textAlign: 'center',
    marginTop: 20,
  },
});