import { Text, View, StatusBar, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  useFonts, 
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold
} from '@expo-google-fonts/manrope';

export default function ProfileScreen() {
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
      <StatusBar hidden={false} />
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../../assets/img/logo.png")}/>
        
        {/* Карточка профиля с аватаркой, именем и почтой */}
        <View style={styles.info}>
          <Image style={styles.avatar} source={require("../../assets/img/user.png")} />
          <Text style={styles.name}>Naima</Text>
          <Text style={styles.email}>user@example.com</Text>
        </View>

        <Text style={styles.greeting}>Hello, Profile</Text>
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
    backgroundColor: '#F6FAFC'
  },
  logo: {
    width: 65,
    height: 52,
    marginBottom: 16,
  },
  info: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    marginTop: 10,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32, 
  },
  name: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 24,
    color: '#192C38',
    marginTop: 12
  },
  email: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#7f919f'
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
    marginTop: 16,
  },
  heading: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 26,
    lineHeight: 26,
    color: '#1C1C1E',
  },
  banner: {
    width: 350,
    height: 220,
    backgroundColor: '#F4F9FD', 
    borderRadius: 24,
    marginTop: 24,
    paddingTop: 20,
    paddingRight: 25,
    paddingBottom: 16,
    paddingLeft: 30,
    gap: 10,
  },
  bannerLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: '#168CE1',
  },
  bannerTextGroup: {
    width: 295,
    gap: 10,
  },
  bannerTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
    color: '#1C1C1E',
  },
  bannerSubtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: '#546871',
  },
  button: {
    width: 295,
    height: 40,
    backgroundColor: '#1479C9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  filters: {
    width: '100%',
    marginTop: 24,
    gap: 14
  },
  filtersHeading: {
    color: '#0A141A',
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
  },
  filterItems: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterItem: {
    textAlign: 'center',
    width: '30%',
    backgroundColor: '#EDF2F5',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  activeFilterItem: {
    backgroundColor: '#1479C9'
  },
  ideas: {
    width: '100%',
    marginTop: 24,
    gap: 14
  },
  ideasHeading: {
    color: '#0A141A',
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
  },
  ideasList: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18
  },
  idea: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'column',
    borderRadius: 20,
  },
  ideaTitle: {
    color: '#0A141A',
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
    marginTop: 12
  },
  ideaDesc: {
    color: '#546871',
    fontFamily: 'Manrope_400Regular',
    fontSize: 11,
    marginTop: 8
  }
});