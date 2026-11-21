import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';

export default function Support() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Если что-то пошло не так, напишите нам, и мы постараемся помочь.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={() => Linking.openURL('mailto:support@fridgy.app')}
      >
        <Text style={styles.buttonText}>Написать в поддержку</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    backgroundColor: '#F6FAFC',
  },
  text: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#546871',
  },
  button: {
    height: 48,
    backgroundColor: '#1479C9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.7,
  },
});
