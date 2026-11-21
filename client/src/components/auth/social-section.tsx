import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuthTheme } from '@/hooks/use-auth-theme';

// Разделитель «Или» и кнопки Google / Apple (в макете есть, на сервере входа через них пока нет).
export function SocialSection() {
  const t = useAuthTheme();
  const soon = (provider: string) => {
    const message = 'Вход через этот сервис появится позже.';
    // Alert.alert в react-native-web ничего не показывает.
    if (Platform.OS === 'web') window.alert(`${provider}: ${message}`);
    else Alert.alert(provider, message);
  };

  return (
    <>
      <View style={styles.divider}>
        <View style={[styles.line, { backgroundColor: t.divider }]} />
        <Text style={[styles.or, { color: t.secondary }]}>Или</Text>
        <View style={[styles.line, { backgroundColor: t.divider }]} />
      </View>

      <View style={styles.row}>
        {['Google', 'Apple'].map((name) => (
          <Pressable
            key={name}
            onPress={() => soon(name)}
            style={({ pressed }) => [styles.button, { backgroundColor: t.socialBg }, pressed && styles.pressed]}
          >
            <Text style={[styles.label, { color: t.text }]}>{name}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: { flex: 1, height: 1 },
  or: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 11,
    lineHeight: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
  label: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    lineHeight: 18,
  },
});
