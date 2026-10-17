import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  useFonts, 
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold
} from '@expo-google-fonts/manrope';

export default function HomeScreen() {
  let [fontsLoaded] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../../assets/img/logo.png")}/>
        
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Добрый вечер</Text>
          <Text style={styles.heading}>Что приготовим сегодня?</Text>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerLabel}>AI-помощник</Text>
          
          <View style={styles.bannerTextGroup}>
            <Text style={styles.bannerTitle}>
              Покажи холодильник -{'\n'}найду ужин за минуту
            </Text>
            <Text style={styles.bannerSubtitle}>
              Сфотографируй продукты, и Fridgy предложит простые рецепты из того, что уже есть.
            </Text>
          </View>

          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Сканировать продукты</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  logo: {
    width: 65,
    height: 52,
  },
  headerText: {
    marginTop: 24, 
    gap: 8,
    width: 334,
  },
  greeting: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#8A8A8E',
  },
  heading: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 26,
    lineHeight: 26,
    color: '#1C1C1E',
  },
 
banner: {
  width: '100%',
  alignSelf: 'stretch',
  backgroundColor: '#E8F6FC',
  borderRadius: 24,
  marginTop: 24,
  paddingHorizontal: 24,
  paddingTop: 20,
  paddingBottom: 20,
  gap: 10,
},

bannerLabel: {
  fontFamily: 'Manrope_600SemiBold',
  fontSize: 12,
  color: '#168CE1',
},

bannerTextGroup: {
  width: '100%',
  gap: 10,
},

bannerTitle: {
  fontFamily: 'Manrope_700Bold',
  fontSize: 20,
  lineHeight: 32,
  color: '#1C1C1E',
},

bannerSubtitle: {
  fontFamily: 'Manrope_400Regular',
  fontSize: 12,
  lineHeight: 21,
  color: '#546871',
},

button: {
  width: '100%',
  height: 48,
  backgroundColor: '#1479C9',
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 8,
  marginTop: 6,
},

buttonText: {
  fontFamily: 'Manrope_600SemiBold',
  fontSize: 13,
  color: '#FFFFFF',
  textAlign: 'center',
},

});