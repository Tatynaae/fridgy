import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../../assets/img/logo.png")}
        />

        <Text style={styles.greeting}>Добрый вечер</Text>

        <Text style={styles.title}>
          Что приготовим сегодня?
        </Text>

        <View style={styles.aiBlock}>
          <Text style={styles.label}>AI-ПОМОЩНИК</Text>

          <Text style={styles.aiTitle}>
            Покажи холодильник -{"\n"}
            найду ужин за минуту
          </Text>

          <Text style={styles.description}>
            Сфотографируй продукты, и Fridgy предложит
            простые рецепты из того, что уже есть.
          </Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              Сканировать продукты
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5FAFC',
    paddingHorizontal: 20,
  },

  container: {
    flex: 1,
  },

  logo: {
    width: 65,
    height: 52,
    marginLeft: 4,
    marginBottom: 20,
  },

  greeting: {
    fontSize: 12,
    color: '#647784',
    marginBottom: 8,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#111C22',
    marginBottom: 30,
  },

  aiBlock: {
    width: '100%',
    height: 220,
    backgroundColor: '#EAF7FD',
    borderRadius: 24,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },

  label: {
    fontSize: 11,
    color: '#0088E8',
    marginBottom: 14,
  },

  aiTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111C22',
    lineHeight: 27,
    marginBottom: 8,
  },

  description: {
    fontSize: 12,
    color: '#647784',
    lineHeight: 17,
    marginBottom: 16,
  },

  button: {
    height: 41,
    backgroundColor: '#1479C9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
