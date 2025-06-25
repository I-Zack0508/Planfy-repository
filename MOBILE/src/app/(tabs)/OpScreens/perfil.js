import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../../../components/Header";
import User from "../../../components/User";
import InfoPerfil from "../../../components/InfoPerfil";
import DesempenhoCard from '../../../components/DesempenhoCard';
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from '@react-navigation/native';
import { upDateLocalStorageUser } from "../../../services/upDateLocalStorage";


export default function PerfilScreen() {
    const [user, setUser] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            let intervalId;
            let isActive = true;

            async function syncUser() {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    await upDateLocalStorageUser(token);
                }
                const userData = await AsyncStorage.getItem('user');
                if (userData && userData !== "undefined" && isActive) {
                    setUser(JSON.parse(userData));
                }
            }

            syncUser();
            intervalId = setInterval(syncUser, 60000); // Atualiza a cada 1 minuto

            return () => {
                isActive = false;
                clearInterval(intervalId);
            };
        }, [])
    );

    if (!user) {
        return (
            <View style={styles.container}>
                <Header />
                <Text>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <Header profilePic={user.profilePic} />
            <View style={styles.container}>
                
                <User profilePic={user.profilePic} />

                <View style={styles.statsContainer}>
                    <View style={styles.perfil}>
                        <InfoPerfil />
                    </View>
                   
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
    },
    perfil: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center', // centraliza eixo Y
        alignItems: 'center',     // centraliza eixo X
    },
})