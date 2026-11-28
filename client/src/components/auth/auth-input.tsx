import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = TextInputProps & {
  icon: IconName;
  error?: string;
  /** Показывает «глаз» для скрытия/показа пароля */
  password?: boolean;
};

const ERROR = '#C8374D';

export function AuthInput({ icon, error, password, style, ...props }: Props) {
  const [hidden, setHidden] = useState(true);
  const color = error ? ERROR : '#546871';

  return (
    <View style={styles.field}>
      <View style={[styles.inputWrap, !!error && styles.inputWrapError]}>
        <Ionicons name={icon} size={24} color={color} />
        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholderTextColor="#546871"
          secureTextEntry={password ? hidden : props.secureTextEntry}
          autoCapitalize={props.autoCapitalize ?? 'none'}
          autoCorrect={false}
        />
        {password && (
          <Pressable onPress={() => setHidden((v) => !v)} hitSlop={10}>
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color={color}
            />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 4 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#7C8488',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
  },
  inputWrapError: { borderColor: ERROR },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: '#192C38',
  },
  error: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 11,
    color: ERROR,
  },
});
