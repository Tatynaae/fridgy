import { StyleSheet, View, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar />
      <SafeAreaView 
      style={styles.container}>
        <View>
          <Image style={styles.logo} source={require("../../assets/img/logo.png")}/>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: 24

  },
  container: {
    flex: 1,
  },
  logo: {
    width: 65,
    height: 52,
    marginLeft: 4
  }
});
