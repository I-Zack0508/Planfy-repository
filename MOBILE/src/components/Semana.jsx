import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Semana = ({ onDateChange }) => {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(new Date().getDay());

  const baseDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + weekOffset * 7);
    return date;
  }, [weekOffset]);

  const formatToYMD = (date) => {
    return date
      .toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }) // força timezone BR
      .split("/")
      .reverse()
      .join("-");
  };

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const newDate = new Date(baseDate);
      const currentDay = baseDate.getDay();
      newDate.setDate(baseDate.getDate() - currentDay + i);

      return {
        label: days[i],
        date: formatToYMD(newDate), // ✅ usa local date corrigido
        dayNumber: newDate.getDate(),
        fullDate: newDate,
      };
    });
  }, [baseDate]);

  useEffect(() => {
    if (onDateChange) {
      onDateChange(weekDates[selectedIndex].date);
    }
  }, [selectedIndex, weekDates]);

  const currentMonth = weekDates[0].fullDate.toLocaleString("pt-BR", {
    month: "long",
  });
  const currentYear = weekDates[0].fullDate.getFullYear();
  const isCurrentWeek = weekOffset === 0;

  const voltarHoje = () => {
    setWeekOffset(0);
    setSelectedIndex(new Date().getDay());
  };

  // Hoje formatado no mesmo estilo
  const hoje = formatToYMD(new Date());

  return (
    <View style={[styles.container, styles.shadowBox]}>
      <View style={styles.header}>
        <Text style={styles.month}>{currentMonth}</Text>

        <View style={styles.middleContainer}>
          {!isCurrentWeek && (
            <TouchableOpacity style={styles.botaoHoje} onPress={voltarHoje}>
              <Text style={styles.textoHoje}>Hoje</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.year}>{currentYear}</Text>
      </View>

      <View style={styles.rowWrapper}>
        <TouchableOpacity onPress={() => setWeekOffset(weekOffset - 1)}>
          <MaterialIcons name="arrow-back-ios" size={28} color="#333" />
        </TouchableOpacity>

        <View style={styles.daysRow}>
          {weekDates.map((item, index) => {
            const isToday = item.date === hoje;
            const isSelected = index === selectedIndex;

            return (
              <TouchableOpacity
                key={index}
                style={styles.dayWrapper}
                onPress={() => setSelectedIndex(index)}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    (isToday || isSelected) && styles.dayLabelToday,
                  ]}
                >
                  {item.label}
                </Text>
                <View
                  style={[
                    styles.dayCircle,
                    (isToday || isSelected) && styles.dayCircleToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      (isToday || isSelected) && styles.dayNumberToday,
                    ]}
                  >
                    {item.dayNumber}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity onPress={() => setWeekOffset(weekOffset + 1)}>
          <MaterialIcons name="arrow-forward-ios" size={28} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CBD5E1",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  shadowBox: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  middleContainer: {
    flex: 1,
    alignItems: "center",
  },
  month: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C2C2C",
    textTransform: "capitalize",
  },
  year: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C2C2C",
  },
  botaoHoje: {
    backgroundColor: "#718EAD",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  textoHoje: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  daysRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  dayWrapper: {
    alignItems: "center",
    width: 40,
  },
  dayLabel: {
    fontSize: 15,
    color: "#9E9E9E",
    marginBottom: 10,
  },
  dayLabelToday: {
    color: "#000000",
    fontWeight: "bold",
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#B1C1D2",
    justifyContent: "center",
    alignItems: "center",
  },
  dayCircleToday: {
    backgroundColor: "#718EAD",
    borderWidth: 2,
    borderColor: "#718EAD",
  },
  dayNumber: {
    fontSize: 15,
    color: "#3D3D3D",
  },
  dayNumberToday: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Semana;
