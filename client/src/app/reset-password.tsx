import { useLocalSearchParams } from 'expo-router';

import { AuthForm } from '@/components/auth/auth-form';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  return <AuthForm key={token} mode="reset-password" resetToken={typeof token === 'string' ? token : undefined} />;
}
