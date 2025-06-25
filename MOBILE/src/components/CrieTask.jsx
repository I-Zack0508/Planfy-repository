import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskCreator = ({ onTaskAdded }) => {
  const [taskName, setTaskName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  const addTask = async () => {
    if (!taskName || !day || !month || !year || !hour || !minute) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    const dayStr = day.padStart(2, "0");
    const monthStr = month.padStart(2, "0");
    const hourStr = hour.padStart(2, "0");
    const minuteStr = minute.padStart(2, "0");

    // O backend espera date (YYYY-MM-DD) e time (HH:mm)
    const date = `${year}-${monthStr}-${dayStr}`;
    const time = `${hourStr}:${minuteStr}`;

    // Categoria padrão
    const category = "Mobile";

    // Recupera o token salvo no login
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: taskName,
          date,
          time,
          category,
        }),
      });

      if (response.ok) {
        Alert.alert("Tarefa adicionada!");
        setTaskName(""); setDay(""); setMonth(""); setYear(""); setHour(""); setMinute("");
        if (onTaskAdded) onTaskAdded();
      } else {
        const data = await response.json();
        Alert.alert("Erro ao adicionar tarefa", data.error || "Erro desconhecido");
      }
    } catch (e) {
      Alert.alert("Erro de conexão com o servidor!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ADICIONE UMA NOVA TAREFA</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da tarefa"
        value={taskName}
        onChangeText={setTaskName}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Dia"
          value={day}
          onChangeText={setDay}
          keyboardType="numeric"
          maxLength={2}
        />
        <Text style={styles.separator}>
          /
        </Text>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Mês"
          value={month}
          onChangeText={setMonth}
          keyboardType="numeric"
          maxLength={2}
        />
        <Text style={styles.separator}>
          /
        </Text>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Ano"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          maxLength={4}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Hora"
          value={hour}
          onChangeText={setHour}
          keyboardType="numeric"
          maxLength={2}
        />
        <Text style={styles.separator}>
          :
        </Text>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Minutos"
          value={minute}
          onChangeText={setMinute}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>Adicionar tarefa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    alignSelf: "center",
    width: "90%",
    elevation: 2,
  },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#f2f2f2",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 30,
    marginBottom: 25,
    textAlign: "center",
    fontSize: 14,
    width: "100%",
  },
  smallInput: {
    flex: 1, // faz ocupar o espaço disponível
    marginHorizontal: 5,
    marginBottom: 0,
    padding: 10,
    borderRadius: 20,
    fontSize: 15,
    minWidth: 0, // evita overflow
    width: undefined, // remove largura fixa
  },
  row: {
    backgroundColor: "#f2f2f2",
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
    gap: 8, // se suportado, para espaçamento entre inputs
  },
  addButton: { backgroundColor: "#6381A8", padding: 12, borderRadius: 8, marginTop: 15, alignItems: "center" },
  addButtonText: { color: "white", fontSize: 15, fontWeight: "bold" },

  separator: {
    fontSize: 24,
    fontWeight: 'semibold',
    color: "balck",
  },
});

export default TaskCreator;
