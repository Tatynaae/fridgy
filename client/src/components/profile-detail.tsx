import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title: string;
  description: string;
  items: { label: string; value: string }[];
};

export function ProfileDetail({ title, description, items }: Props) {
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.card}>
          {items.map((item) => (
            <View key={item.label} style={styles.row}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6FAFC' },
  content: { padding: 20, paddingBottom: 110, gap: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#192C38' },
  description: { fontSize: 16, lineHeight: 24, color: '#546871' },
  card: { padding: 20, borderRadius: 22, backgroundColor: '#FFFFFF', gap: 24 },
  row: { gap: 6 },
  label: { fontSize: 14, color: '#546871' },
  value: { fontSize: 16, lineHeight: 24, color: '#192C38' },
});
