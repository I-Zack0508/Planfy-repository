import React, { useState, useEffect } from "react";
import { router } from 'expo-router';
import { Modal, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InfoPerfil() {
    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedField, setSelectedField] = useState("");
    const [fieldValue, setFieldValue] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

    // Estado para exclusão de conta
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deletePassword1, setDeletePassword1] = useState("");
    const [deletePassword2, setDeletePassword2] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            const userData = await AsyncStorage.getItem('user');
            if (userData && userData !== "undefined") {
                setUser(JSON.parse(userData));
            }
        }
        fetchUser();
    }, []);

    const handleEdit = (field, value) => {
        setSelectedField(field);
        setFieldValue(value);
        setModalVisible(true);
    };

    const handleSave = async () => {
        await updateUserData(selectedField, fieldValue, currentPassword);
        setModalVisible(false);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setLogoutConfirmVisible(false);
        router.replace('/'); // Redireciona para a tela de login
    };

    const updateUserData = async (field, value, currentPassword = "") => {
        try {
            const token = await AsyncStorage.getItem('token');
            let url = "http://localhost:3000/api/user/profile";
            let body = {};

            if (field === "Nome") {
                body = { name: value };
            } else if (field === "Email") {
                body = { email: value };
            } else if (field === "Senha") {
                url = "http://localhost:3000/api/user/password";
                body = { currentPassword, newPassword: value };
            }

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                // Atualiza o AsyncStorage se não for senha
                if (field !== "Senha") {
                    const userData = await AsyncStorage.getItem('user');
                    let userObj = userData ? JSON.parse(userData) : {};
                    if (field === "Nome") userObj.nome = value;
                    if (field === "Email") userObj.email = value;
                    await AsyncStorage.setItem('user', JSON.stringify(userObj));
                    setUser(userObj);
                }
                alert("Dados atualizados com sucesso!");
            } else {
                alert(data.error || data.message || "Erro ao atualizar dados");
            }
        } catch (e) {
            alert("Erro ao atualizar dados");
        }
    };

    // Função para excluir conta
    const handleDeleteAccount = async () => {
        if (deletePassword1 !== deletePassword2) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }
        setDeleting(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch("http://localhost:3000/api/user/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password: deletePassword1 }),
            });
            const data = await response.json();
            if (response.ok) {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user');
                setDeleteModalVisible(false);
                Alert.alert("Conta excluída", "Sua conta foi excluída com sucesso.");
                router.replace('/');
            } else {
                Alert.alert("Erro", data.error || data.message || "Erro ao excluir conta");
            }
        } catch (e) {
            Alert.alert("Erro", "Erro ao excluir conta");
        }
        setDeleting(false);
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Carregando informações do perfil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <View style={styles.item}>
                    <Text style={styles.text}>
                        <Text style={styles.bold}>Nome:</Text> {user.nome || user.name}
                    </Text>
                    <TouchableOpacity onPress={() => handleEdit("Nome", user.nome || user.name)}>
                        <Text style={styles.edit}>Editar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.item}>
                    <Text style={styles.text}>
                        <Text style={styles.bold}>Email:</Text> {user.email}
                    </Text>
                    <TouchableOpacity onPress={() => handleEdit("Email", user.email)}>
                        <Text style={styles.edit}>Editar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.item}>
                <Text style={styles.text}>
                    <Text style={styles.bold}>Senha:</Text> ********
                </Text>
                <TouchableOpacity onPress={() => handleEdit("Senha", "")}>
                    <Text style={styles.edit}>Editar</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.exit} onPress={() => setLogoutConfirmVisible(true)}>
                <Text style={[styles.textExit, styles.bold]}>Sair da Conta</Text>
            </TouchableOpacity>

            {/* Botão de excluir conta */}
            <TouchableOpacity
                style={[styles.exit, { marginTop: 10 }]}
                onPress={() => setDeleteModalVisible(true)}
            >
                <Text style={[styles.textExit, styles.bold, { color: "#c00" }]}>Excluir Conta</Text>
            </TouchableOpacity>

            {/* Modal para edição */}
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={[styles.modalValue, styles.bold]}>Alterar {selectedField}</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder={
                                selectedField === "Senha"
                                    ? "Digite a nova senha"
                                    : `Digite o novo ${selectedField.toLowerCase()}`
                            }
                            onChangeText={setFieldValue}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Digite sua senha atual"
                            secureTextEntry={true}
                            onChangeText={setCurrentPassword}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleSave}
                            >
                                <Text style={styles.modalButtonText}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de confirmação de Logout */}
            <Modal
                transparent={true}
                visible={logoutConfirmVisible}
                animationType="fade"
                onRequestClose={() => setLogoutConfirmVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Deseja mesmo sair da conta?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleLogout}
                            >
                                <Text style={styles.modalButtonText}>Sim</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setLogoutConfirmVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de confirmação de exclusão de conta */}
            <Modal
                transparent={true}
                visible={deleteModalVisible}
                animationType="fade"
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Excluir Conta</Text>
                        <Text style={{ marginBottom: 10, textAlign: "center" }}>
                            Digite sua senha duas vezes para confirmar a exclusão da conta.
                        </Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Digite sua senha"
                            secureTextEntry={true}
                            value={deletePassword1}
                            onChangeText={setDeletePassword1}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Confirme sua senha"
                            secureTextEntry={true}
                            value={deletePassword2}
                            onChangeText={setDeletePassword2}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleDeleteAccount}
                                disabled={deleting}
                            >
                                <Text style={styles.modalButtonText}>
                                    {deleting ? "Excluindo..." : "Excluir"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setDeleteModalVisible(false)}
                                disabled={deleting}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20, // Adicionado espaçamento interno no container
        alignItems: 'flex-start',
        width: '85%',
        borderRadius: 10,
        boxShadow: '1px 2px 6px #999999',
        backgroundColor: '#ffffff',
        gap: 10,
    },
    info: {
        gap: 20, // Espaçamento entre os itens
    },
    item: {
        width: '100%',
    },
    text: {
        fontSize: 16,
        marginBottom: 5, // Espaçamento entre o texto e o botão "Editar"
    },
    bold: {
        fontWeight: 'bold', // Indicações em negrito
    },
    edit: {
        color: '#6381A8',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left', // Alinha o botão "Editar" à esquerda
    },
    exit: {
        marginTop: 20,
        alignItems: 'center',
    },
    textExit: {
        color: '#DC3545',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        gap: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#6381A8',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
    },
    cancelButton: {
        backgroundColor: '#DC3545',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
    },
    uttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modalValue: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    modalButton: {
        backgroundColor: '#6381A8',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});