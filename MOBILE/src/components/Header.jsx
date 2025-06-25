import { StyleSheet, View } from "react-native"
import { Image } from "expo-image"

export default function Header({ profilePic }) {
    let profilePicUrl = null;
    if (profilePic) {
        // Troque 'localhost' pelo IP do seu PC se estiver testando no celular físico
        profilePicUrl = `http://localhost:3000${profilePic}`;
    }

    return (
        <View style={styles.container}>
            <View>
                <Image
                    style={styles.logo}
                    source={require("../../assets/Logo.png")}
                />
            </View>

            <View>
                <Image
                    style={styles.perfil}
                    source={
                        profilePicUrl
                            ? { uri: profilePicUrl }
                            : require("../../assets/User.png")
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        boxShadow: '5px 2px 6px #999999',
        backgroundColor: 'white'
    },
    logo: {
        width: 60,
        height: 60,
        marginLeft: 10,
    },
    perfil: {
        width:  38,
        height: 38,
        borderRadius: 100,
        marginRight: 10,
    }
})