import AsyncStorage from '@react-native-async-storage/async-storage';

export async function upDateLocalStorageUser(token) {
    try {
        const response = await fetch('http://localhost:3000/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const user = await response.json();
            await AsyncStorage.setItem('user', JSON.stringify(user));
            return user;
        }
    } catch (e) {
        // Trate o erro se necessário
    }
    return null;
}