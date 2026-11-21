import { Pressable, StyleSheet, Text, View } from 'react-native';

// Вход через Google/Apple на сервере пока не реализован — кнопки по макету, нажатие сообщает об этом
export function SocialButtons({ onPress }: { onPress: (provider: string) => void }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>Или</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.row}>
        {['Google', 'Apple'].map((name) => (
          <Pressable
            key={name}
            onPress={() => onPress(name)}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>{name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16, marginTop: 4 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: 1, backgroundColor: '#C9D3D8' },
  or: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: '#546871' },
  row: { flexDirection: 'row', gap: 20 },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#EEF1F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  buttonText: { fontFamily: 'Manrope_600SemiBold', fontSize: 14, color: '#192C38' },
});
