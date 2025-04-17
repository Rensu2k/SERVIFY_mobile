import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";

const UserProfile = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/Profile.jpg")}
        style={styles.avatar}
      />
      <Text style={styles.name}>Rensu Buenaflor</Text>
      <Text style={styles.email}>cbuenaflor2@ssct.edu.ph</Text>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingRow}>
        <View style={styles.settingLeft}>
          <Feather name="settings" size={24} color="#9F7AEA" />
          <Text style={styles.settingText}>Settings</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton}>
        <Feather name="power" size={20} color="red" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 50,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 15,
    marginTop: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: "#EDE9FE",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 30,
  },
  editButtonText: {
    color: "black",
    fontWeight: "600",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
    marginTop: 30,
    marginBottom: 30,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1,
    marginTop: 30,
    borderColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "60%",
  },
  logoutText: {
    color: "red",
    fontSize: 16,
    marginLeft: 10,
  },
});
