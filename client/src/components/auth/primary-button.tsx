import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useAuthTheme } from '@/hooks/use-auth-theme';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

// Основная кнопка: высота 50, радиус 12, Manrope 13/600 белым. Неактивная — полупрозрачная (как в макете).
export function PrimaryButton({ title, onPress, loading, disabled }: Props) {
  const t = useAuthTheme();
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: t.primary },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.label}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
  label: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 13,
    lineHeight: 18,
    color: '#FFFFFF',
  },
});
