import { Stack } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Layout() {
    useEffect(() => {
        async function checkLogin() {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                router.replace('/'); // Redireciona para a tela de login
            }
        }
        checkLogin();
    }, []);

    return (
        <Stack>
            <Stack.Screen name="OpScreens" options={{ title: "Index de usuário", headerShown: false }} />
        </Stack>
    );
}