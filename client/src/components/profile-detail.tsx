import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useProfileColors } from '@/hooks/use-profile-colors';

type Props = {
  title: string;
  description: string;
};

export function ProfileDetail({ title, description }: Props) {
  const c = useProfileColors();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: c.card }]}>
        <Text style={[styles.title, { color: c.title }]}>{title}</Text>
        <Text style={[styles.description, { color: c.secondary }]}>{description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  card: {
    borderRadius: 22,
    padding: 20,
    gap: 8,
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
  },
  description: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
  },
});
