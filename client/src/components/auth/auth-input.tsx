import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

type Props = TextInputProps & {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  error?: string | null;
  password?: boolean;
};

export default function AuthInput({ icon, error, password, ...props }: Props) {
  const [hidden, setHidden] = useState(true);
  const iconColor = error ? '#D94C4C' : '#546871';

  return (
    <View>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        <Ionicons name={icon} size={22} color={iconColor} />
        <TextInput
          {...props}
          style={styles.input}
          placeholderTextColor="#546871"
          secureTextEntry={password ? hidden : false}
        />
        {password && (
          <Pressable hitSlop={10} onPress={() => setHidden((h) => !h)}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={22} color="#546871" />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8FA0AC',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fieldError: { borderColor: '#D94C4C' },
  input: {
    flex: 1,
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#192C38',
    paddingVertical: 0,
  },
  error: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 11,
    color: '#D94C4C',
    marginTop: 4,
    marginLeft: 2,
  },
});