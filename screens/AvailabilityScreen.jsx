import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../Components/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AVAILABILITY_STORAGE_KEY = "servify_provider_availability";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeSlots = [
  "Morning (8AM - 12PM)",
  "Afternoon (12PM - 5PM)",
  "Evening (5PM - 9PM)",
];

const AvailabilityScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingChanges, setSavingChanges] = useState(false);
  const [generalAvailability, setGeneralAvailability] = useState(
    user?.isAvailable !== false
  );
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      setLoading(true);

      const storedAvailability = await AsyncStorage.getItem(
        AVAILABILITY_STORAGE_KEY
      );
      let parsedAvailability = storedAvailability
        ? JSON.parse(storedAvailability)
        : {};

      const providerAvailability = parsedAvailability[user.id] || {};

      if (Object.keys(providerAvailability).length === 0) {
        const defaultAvailability = {};
        daysOfWeek.forEach((day) => {
          defaultAvailability[day] = {
            enabled: day !== "Sunday",
            timeSlots: {
              "Morning (8AM - 12PM)": true,
              "Afternoon (12PM - 5PM)": true,
              "Evening (5PM - 9PM)": false,
            },
          };
        });
        setAvailability(defaultAvailability);
      } else {
        setAvailability(providerAvailability);
      }
    } catch (error) {
      console.error("Error loading availability:", error);
      Alert.alert("Error", "Failed to load availability settings");
    } finally {
      setLoading(false);
    }
  };

  const saveAvailability = async () => {
    try {
      setSavingChanges(true);

      const storedAvailability = await AsyncStorage.getItem(
        AVAILABILITY_STORAGE_KEY
      );
      let parsedAvailability = storedAvailability
        ? JSON.parse(storedAvailability)
        : {};

      parsedAvailability[user.id] = availability;
      await AsyncStorage.setItem(
        AVAILABILITY_STORAGE_KEY,
        JSON.stringify(parsedAvailability)
      );

      const updatedUser = {
        ...user,
        isAvailable: generalAvailability,
      };

      const result = await updateUser(updatedUser);

      if (result.success) {
        Alert.alert("Success", "Availability settings saved successfully");
      } else {
        Alert.alert("Error", "Failed to update general availability");
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      Alert.alert("Error", "Failed to save availability settings");
    } finally {
      setSavingChanges(false);
    }
  };

  const toggleDayEnabled = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const toggleTimeSlot = (day, timeSlot) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: {
          ...prev[day].timeSlots,
          [timeSlot]: !prev[day].timeSlots[timeSlot],
        },
      },
    }));
  };

  const toggleGeneralAvailability = (value) => {
    setGeneralAvailability(value);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Availability</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A5ACD" />
          <Text style={styles.loadingText}>
            Loading availability settings...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Availability</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.generalAvailabilityCard}>
          <View style={styles.generalAvailabilityRow}>
            <View>
              <Text style={styles.generalAvailabilityTitle}>
                General Availability
              </Text>
              <Text style={styles.generalAvailabilityDescription}>
                Toggle to set your overall availability status
              </Text>
            </View>
            <Switch
              value={generalAvailability}
              onValueChange={toggleGeneralAvailability}
              trackColor={{ false: "#767577", true: "#6A5ACD" }}
              thumbColor="#f4f3f4"
            />
          </View>
          <Text style={styles.availabilityStatus}>
            You are currently{" "}
            <Text
              style={{
                fontWeight: "bold",
                color: generalAvailability ? "#4CAF50" : "#F44336",
              }}
            >
              {generalAvailability ? "AVAILABLE" : "UNAVAILABLE"}
            </Text>{" "}
            for bookings
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>
          <Text style={styles.sectionSubtitle}>
            Set your available days and times
          </Text>
        </View>

        {daysOfWeek.map((day) => (
          <View key={day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>{day}</Text>
              <Switch
                value={availability[day]?.enabled}
                onValueChange={() => toggleDayEnabled(day)}
                trackColor={{ false: "#767577", true: "#6A5ACD" }}
                thumbColor="#f4f3f4"
              />
            </View>

            {availability[day]?.enabled && (
              <View style={styles.timeSlots}>
                {timeSlots.map((timeSlot) => (
                  <View key={timeSlot} style={styles.timeSlotRow}>
                    <Text style={styles.timeSlotText}>{timeSlot}</Text>
                    <Switch
                      value={availability[day]?.timeSlots[timeSlot]}
                      onValueChange={() => toggleTimeSlot(day, timeSlot)}
                      trackColor={{ false: "#767577", true: "#6A5ACD" }}
                      thumbColor="#f4f3f4"
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveAvailability}
          disabled={savingChanges}
        >
          {savingChanges ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save Availability</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#6A5ACD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  generalAvailabilityCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  generalAvailabilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  generalAvailabilityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  generalAvailabilityDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  availabilityStatus: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  dayCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timeSlots: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
  },
  timeSlotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  timeSlotText: {
    fontSize: 14,
    color: "#666",
  },
  saveButton: {
    backgroundColor: "#6A5ACD",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AvailabilityScreen;
