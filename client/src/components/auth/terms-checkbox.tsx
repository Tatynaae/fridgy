import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { checked: boolean; onToggle: () => void; error?: string };

export function TermsCheckbox({ checked, onToggle, error }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onToggle} style={styles.row} hitSlop={6}>
        <View style={[styles.box, checked && styles.boxChecked, !!error && styles.boxError]}>
          {checked && <Ionicons name="checkmark" size={13} color="#fff" />}
        </View>
        <Text style={styles.text}>
          Я принимаю <Text style={styles.link}>условия</Text> и{' '}
          <Text style={styles.link}>политику конфиденциальности</Text>
        </Text>
      </Pressable>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 2 },
  box: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#7C8488',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  boxChecked: { backgroundColor: '#1479C9', borderColor: '#1479C9' },
  boxError: { borderColor: '#C8374D' },
  text: { flex: 1, fontFamily: 'Manrope_400Regular', fontSize: 11, lineHeight: 15, color: '#7C8488' },
  link: { color: '#168CE1' },
  error: { fontFamily: 'Manrope_400Regular', fontSize: 11, color: '#C8374D' },
});
