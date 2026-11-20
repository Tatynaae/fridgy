import { StyleSheet, Text, View } from 'react-native';

type Props = {
  description: string;
};

// Заглушка для детальных экранов профиля: содержимое появится в следующих задачах.
export default function ProfilePlaceholder({ description }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F6FAFC',
  },
  text: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#7F919F',
    textAlign: 'center',
  },
});
