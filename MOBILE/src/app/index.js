import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image'
import Login from '../components/Login';
import { ScrollView } from 'react-native-web';

export default function Logar() {
  return (
    <ScrollView>
      <View style={styles.container}>

        <View style={styles.bordaContainer}>
          <Image
            style={styles.borda2}
            source={require("../../assets/bordas2.png")} />
        </View>

        <View style={styles.login}>
          <Login />
        </View>

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  login: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: 80,
  },
  bordaContainer: {
    marginTop: -60,
    paddingBottom: 86,
    zIndex: '-1'
  },
  borda2: {
    width: 180,
    height: 180
  },
  bordaContainer2: {
    paddingTop: 60,
    alignItems: 'flex-end',
    zIndex: -1
  },
  borda4: {
    width: 180,
    height: 130
  },
  borda: {
    width: 130,
    height: 130
  },
  adc: {
    paddingTop: 810,
    position: 'fixed'
  },

});
