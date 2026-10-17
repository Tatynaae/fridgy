import { StyleSheet, Image, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
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

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Image style={styles.logo} source={require("../../assets/img/logo.png")}/>
        
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Добрый вечер</Text>
          <Text style={styles.heading}>Что приготовим сегодня?</Text>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerLabel}>AI-помощник</Text>
          <View style={styles.bannerTextGroup}>
            <Text style={styles.bannerTitle}>Покажи холодильник -{'\n'}найду ужин за минуту</Text>
            <Text style={styles.bannerSubtitle}>Сфотографируй продукты, и Fridgy предложит простые рецепты из того, что уже есть.</Text>
          </View>
          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Сканировать продукты</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Под тебя сегодня</Text>
          <View style={styles.filtersRow}>
            <TouchableOpacity style={[styles.filterBtn, styles.filterBtnActive]}>
              <Text style={[styles.filterText, styles.filterTextActive]}>До 20 мин</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn}>
              <Text style={styles.filterText}>≤ 500 ккал</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn}>
              <Text style={styles.filterText}>Веган</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Быстрые идеи</Text>
          <View style={styles.cardsRow}>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardIcon}>🍝</Text>
              <Text style={styles.cardTitle}>Паста с овощами</Text>
              <Text style={styles.cardSub}>15 мин · 420 ккал</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardIcon}>🥗</Text>
              <Text style={styles.cardTitle}>Греческий салат</Text>
              <Text style={styles.cardSub}>20 мин · 380 ккал</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="home" size={24} color="#1479C9" />
          <Text style={[styles.navText, { color: '#1479C9' }]}>Главная</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="heart" size={24} color="#8A8A8E" />
          <Text style={styles.navText}>Сохраненное</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="user" size={24} color="#8A8A8E" />
          <Text style={styles.navText}>Профиль</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 100,
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
  section: {
    marginTop: 32,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: '#1C1C1E',
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 350,
  },
  filterBtn: {
    width: 104,
    height: 36,
    backgroundColor: '#EDF2F5',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#1479C9',
  },
  filterText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 13,
    color: '#1C1C1E',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 350,
    height: 110,
  },
  card: {
    width: 166,
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 12,
    paddingRight: 16,
    paddingBottom: 13,
    paddingLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: '#1C1C1E',
    marginTop: 4,
  },
  cardSub: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 11,
    color: '#8A8A8E',
  },
  navbar: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 350,
    height: 63,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 10,
    color: '#8A8A8E',
  },
});