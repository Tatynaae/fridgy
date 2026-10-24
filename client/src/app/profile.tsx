import { View,Text, StatusBar, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  useFonts, 
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold
} from '@expo-google-fonts/manrope';

export default function ProfileScreen(){
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
            <StatusBar hidden={false}/>
            <View style={styles.container}> 
                <Image style={styles.logo} source={require("../../assets/img/logo.png")}/>
                <View style={styles.info}>
                    <Image style={styles.avatar} source={require("../../assets/img/profile.png")}/>
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
    backgroundColor: '#F6FAFC'
  },
  logo: {
    width: 65,
    height: 52,
  },
  info: {
    backgroundColor:'#ffffff',
    borderRadius: 22,
    paddingBottom: 30,
    paddingTop: 30,
    alignItems: "center"
  },

  avatar: {
    width: 80,
    height: 80
  },
  name: {
    fontFamily: 'Manrope_6005SemiBold',
    fontSize: 24,
    color:'#120909ff',
    marginTop: 12,
  },
  email: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#7a7171ff',
  }

});