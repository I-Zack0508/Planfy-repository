import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";

export default function User({ profilePic }) {
    let profilePicUrl = null;
    if (profilePic) {
        // Troque 'localhost' pelo IP do seu PC se estiver testando no celular físico
        profilePicUrl = `http://localhost:3000${profilePic}`;
    }

    return (
        <View style={styles.container}>
            <Image 
                style={styles.foto}
                source={
                    profilePicUrl
                        ? { uri: profilePicUrl }
                        : require('../../assets/User.png')
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        width: '100%',
    },
    foto: {
        width:  125,
        height: 125,
        borderRadius: 100,
    },
})