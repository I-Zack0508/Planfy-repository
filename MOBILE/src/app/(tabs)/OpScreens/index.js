import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Semana from '../../../components/Semana';
import Header from '../../../components/Header';
import TaskCard from '../../../components/TaskCard';
import DogImage from '../../../../assets/Dog.png';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [editTaskData, setEditTaskData] = useState({
    id: null,
    name: "",
    day: "",
    month: "",
    year: "",
    hour: "",
    minute: "",
  });

  useEffect(() => {
    const init = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData && userData !== "undefined") {
        setUser(JSON.parse(userData));
      }
      await fetchTasks();
    };
    init();
  }, []);

  const fetchTasks = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setTasks(await response.json());
      }
    } catch (e) {
      console.error("Erro ao buscar tarefas:", e);
    }
  };

  const handleToggleComplete = async (taskId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchTasks();
    } catch (err) {
      console.error("Erro ao concluir tarefa:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchTasks();
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
    }
  };

  const handleEditTask = (task) => {
    const [year, month, day] = task.date.slice(0, 10).split("-");
    const [hour, minute] = task.time.split(":");

    setEditTaskData({
      id: task.id,
      name: task.name,
      day,
      month,
      year,
      hour,
      minute,
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    const { id, name, day, month, year, hour, minute } = editTaskData;

    if (!name || !day || !month || !year || !hour || !minute) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    const dayStr = day.padStart(2, "0");
    const monthStr = month.padStart(2, "0");
    const hourStr = hour.padStart(2, "0");
    const minuteStr = minute.padStart(2, "0");

    const date = `${year}-${monthStr}-${dayStr}`;
    const time = `${hourStr}:${minuteStr}`;

    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, date, time }),
      });

      if (response.ok) {
        setEditModalVisible(false);
        fetchTasks();
      } else {
        Alert.alert("Erro ao salvar a tarefa");
      }
    } catch (err) {
      console.error("Erro ao editar tarefa:", err);
      Alert.alert("Erro na conexão com o servidor");
    }
  };

  const filteredTasks = tasks
    .filter(t => t.date?.slice(0, 10) === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <ScrollView>
      <Header profilePic={user?.profilePic} />
      <View style={styles.container}>
        <Semana onDateChange={setSelectedDate} />

        <View style={{ marginTop: 20 }}>
          {selectedDate ? (
            filteredTasks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Image source={DogImage} style={styles.dogImage} resizeMode="contain" />
                <Text style={styles.emptyText}>Nenhuma tarefa por aqui</Text>
              </View>
            ) : (
              filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  {...task}
                  onToggleComplete={() => handleToggleComplete(task.id)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onEdit={() => handleEditTask(task)}
                />
              ))
            )
          ) : (
            <Text style={{ color: "#888", textAlign: "center" }}>
              Selecione um dia da semana para ver as tarefas.
            </Text>
          )}
        </View>

        <Modal
          animationType="none"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, styles.bold]}>Editar Tarefa</Text>

              <TextInput
                style={styles.modalInput}
                value={editTaskData.name}
                onChangeText={(text) => setEditTaskData({ ...editTaskData, name: text })}
                placeholder="Nome da tarefa"
              />

              <View style={styles.row}>
                <TextInput
                  style={[styles.modalInput, styles.smallInput]}
                  placeholder="Dia"
                  value={editTaskData.day}
                  onChangeText={(text) => setEditTaskData({ ...editTaskData, day: text })}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.separator}>
                  /
                </Text>
                <TextInput
                  style={[styles.modalInput, styles.smallInput]}
                  placeholder="Mês"
                  value={editTaskData.month}
                  onChangeText={(text) => setEditTaskData({ ...editTaskData, month: text })}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.separator}>
                  /
                </Text>
                <TextInput
                  style={[styles.modalInput, styles.smallInput]}
                  placeholder="Ano"
                  value={editTaskData.year}
                  onChangeText={(text) => setEditTaskData({ ...editTaskData, year: text })}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              <View style={styles.row}>
                <TextInput
                  style={[styles.modalInput, styles.smallInput]}
                  placeholder="Hora"
                  value={editTaskData.hour}
                  onChangeText={(text) => setEditTaskData({ ...editTaskData, hour: text })}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.separator}>
                  :
                </Text>
                <TextInput
                  style={[styles.modalInput, styles.smallInput]}
                  placeholder="Minutos"
                  value={editTaskData.minute}
                  onChangeText={(text) => setEditTaskData({ ...editTaskData, minute: text })}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleSaveEdit}>
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
  },
  bold: {
    fontWeight: 'bold',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#f2f2f2',
    padding: 10,
    borderRadius: 30,
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#f2f2f2',
  },
  smallInput: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 0,
    padding: 10,
    borderRadius: 20,
    fontSize: 15,
    minWidth: 0,
    width: undefined,
  },
  row: {
    backgroundColor: '#f2f2f2',
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    width: '100%',
    gap: 8,
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
  cancelButton: {
    backgroundColor: '#DC3545',
    marginRight: 0,
    marginLeft: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  dogImage: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },

  separator: {
    fontSize: 24,
    fontWeight: 'semibold',
    color: "balck",
  }
  });
