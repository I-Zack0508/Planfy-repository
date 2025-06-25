import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Image } from 'expo-image'
import TaskCreator from '../../../components/CrieTask';
import 'react-native-gesture-handler';
import Header from '../../../components/Header';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TarefasScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await AsyncStorage.getItem('user');
      if (userData && userData !== "undefined") {
        setUser(JSON.parse(userData));
      }
    }
    fetchUser();
  }, []);

  if (!user) {
    return (
      <ScrollView>
        <Header />
        <View style={styles.container}>
          <Text>Carregando perfil...</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView>
      <Header profilePic={user.profilePic}/>
      <View style={styles.container}>

        <View style={styles.task}>
          <TaskCreator/>
        </View>
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  task: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    margin: 20,
    marginTop: 150,
  },

  bordaContainer: {
    marginTop: -60,
    paddingBottom: 0,
    zIndex: '-1'
  },
  borda2: {
    width: 180,
    height: 180
  },
  adc: {
    paddingTop:810,
    position: 'fixed'
  },
});
