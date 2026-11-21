import { forwardRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useAuthTheme } from '@/hooks/use-auth-theme';
import { EyeIcon } from './auth-icons';

type Props = TextInputProps & {
  /** Иконка слева: получает цвет (серый / красный при ошибке) */
  icon: (color: string) => ReactNode;
  /** Поле пароля: скрывает ввод и показывает «глаз» справа */
  password?: boolean;
  /** Текст ошибки под полем (10px) */
  error?: string;
  /** Подсветить поле красным без текста (ошибка сервера) */
  invalid?: boolean;
};

// Поле ввода по макету: высота 50, радиус 16, рамка 0.5, иконка 24 слева, текст 12/500.
export const AuthInput = forwardRef<TextInput, Props>(function AuthInput(
  { icon, password, error, invalid, style, ...rest },
  ref,
) {
  const t = useAuthTheme();
  const [hidden, setHidden] = useState(true);
  const hasError = !!error || !!invalid;
  const accent = hasError ? t.danger : t.icon;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.field,
          { backgroundColor: t.inputBg, borderColor: hasError ? t.danger : t.inputBorder },
        ]}
      >
        {icon(accent)}

        <TextInput
          ref={ref}
          placeholderTextColor={t.placeholder}
          style={[styles.input, { color: t.text }, style]}
          secureTextEntry={password ? hidden : undefined}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />

        {password ? (
          <Pressable
            onPress={() => setHidden((v) => !v)}
            hitSlop={10}
            accessibilityLabel={hidden ? 'Показать пароль' : 'Скрыть пароль'}
          >
            <EyeIcon color={t.icon} hidden={hidden} />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={[styles.error, { color: t.danger }]}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { gap: 4 },
  field: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 0.5,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
  },
  error: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 10,
    lineHeight: 14,
  },
});
