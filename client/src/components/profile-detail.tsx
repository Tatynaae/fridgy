import { StyleSheet, Text, View } from 'react-native';

type Props = {
  heading: string;
  description: string;
};

// Заготовка детального экрана профиля; заголовок и кнопка «Назад» — в хедере Stack
export function ProfileDetail({ heading, description }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    gap: 8,
  },
  heading: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 20,
    color: '#192C38',
  },
  description: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#546871',
  },
});
