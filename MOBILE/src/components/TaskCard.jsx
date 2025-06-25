import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const TaskCard = ({ id, name, category, time, date, completed, onEdit, onDelete, onToggleComplete }) => {
  const [year, month, day] = date.slice(0, 10).split("-");
  const dataFormatada = `${day}/${month}/${year}`;

  const now = new Date();
  const taskDateTime = new Date(`${date.slice(0, 10)}T${time}`);
  const podeConcluir = !completed && now >= taskDateTime;

  return (
    <View style={[styles.card, completed && styles.completedCard]}>
      <View style={styles.cardHorizontal}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.info}>Horário: {time}</Text>
          <Text style={styles.info}>Data: {dataFormatada}</Text>
          {completed && <Text style={styles.completedLabel}>Concluída</Text>}
        </View>

        <View style={styles.buttons}>
          {/* Esconde botão de editar se tarefa estiver concluída */}
          {!completed && (
            <TouchableOpacity onPress={onEdit}>
              <MaterialIcons name="edit" size={24} color="#F7D560" />  {/* amarelo ouro */}
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onDelete}>
            <MaterialIcons name="delete" size={24} color="#E5534B" />
          </TouchableOpacity>
          {podeConcluir && (
            <TouchableOpacity onPress={onToggleComplete}>
              <MaterialIcons name="check-circle" size={24} color="#43B668" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 20,
    marginHorizontal: 10,  // <--- Espaço lateral adicionado aqui
    borderLeftWidth: 6,
    borderLeftColor: "#adb8c5",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  completedCard: {
    opacity: 0.7,
  },
  cardHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    color: "#2d3e50",
    fontWeight: "bold",
    marginBottom: 2,
  },
  info: {
    fontSize: 15,
    color: "#4f5e6c",
    fontWeight: "600",
    marginBottom: 1,
  },
  completedLabel: {
    color: "green",
    fontWeight: "bold",
    marginTop: 4,
  },
  buttons: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
});

export default TaskCard;
