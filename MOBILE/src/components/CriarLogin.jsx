import { StyleSheet, View, Text, TextInput, ScrollView, Alert } from "react-native";
import { Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from "react";

export default function CriarLogin() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nascimento, setNascimento] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleRegister() {
        if (!nome || !email || !senha || !nascimento) {
            Alert.alert("Preencha todos os campos!");
            return;
        }
        // Validação simples de data
        if (!/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) {
            Alert.alert("Data de nascimento deve estar no formato YYYY-MM-DD");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nome,
                    email,
                    password: senha,
                    birthDate: nascimento
                })
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
                router.replace('/'); // Redireciona para o login
            } else {
                Alert.alert("Erro", data.error || "Erro ao cadastrar usuário.");
            }
        } catch (e) {
            Alert.alert("Erro", "Erro de conexão com o servidor.");
        }
        setLoading(false);
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.criar}>
                    <Text style={styles.titulo}>CRIE UMA CONTA</Text>

                    <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
                    <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
                    <TextInput style={styles.input} placeholder="Nascimento (YYYY-MM-DD)" value={nascimento} onChangeText={setNascimento} />

                    <View style={styles.botao}>
                        <Pressable style={styles.botaoLogar} onPress={handleRegister} disabled={loading}>
                            <Text style={styles.textBotao}>{loading ? "Criando..." : "Criar Conta"}</Text>
                        </Pressable>
                    </View>
                    <Text style={styles.text_link}>
                        Caso já tenha uma conta volte para <Link style={styles.destaque_text} href={'/'}>Login</Link>
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        width: '100%',
        borderRadius: 20,
        backgroundColor: '#F3F3F3'
    },
    criar: {
        backgroundColor: '#E9DBDF',
        alignItems: 'center',
        borderRadius: 20,
        padding: 20,
        boxShadow: '5px 5px 5px #999999',
    },
    titulo: {
        fontWeight: 'bold',
        fontSize: 21,
        padding: 11
    },
    input: {
        width: '95%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        backgroundColor: 'white',
        color: '#7A7A7A',
        fontWeight: 'bold'
    },
    botao: {
        padding: 10
    },
    botaoLogar: {
        width: 140,
        backgroundColor: '#6381A8',
        borderRadius: 35,
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBotao: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 3,
    },
    textCriar: {
        marginTop: 0,
        fontWeight: 'bold',
        fontSize: 13,
        padding: 5,
        textAlign: 'center'
    },

    destaque_text: {
        color: '#6381A8',
        fontWeight: 'bold',
        fontSize: 13,
        padding: 5,
        textAlign: 'center'
    },

    text_link: {
        marginTop: 4,
        fontWeight: 'bold',
        fontSize: 14,
        padding: 5,
        textAlign: 'center'
    },
});
