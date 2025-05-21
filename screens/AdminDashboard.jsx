import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../Components/AuthContext";

const AdminDashboard = ({ navigation }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Auth" }],
    });
  };

  // Sample data for dashboard metrics
  const metrics = [
    { title: "Total Users", value: "124", icon: "people" },
    { title: "Service Providers", value: "47", icon: "briefcase" },
    { title: "Clients", value: "77", icon: "person" },
    { title: "Services", value: "15", icon: "construct" },
    { title: "Pending Requests", value: "12", icon: "time" },
    { title: "Completed Services", value: "342", icon: "checkmark-circle" },
  ];

  // Sample data for recent activities
  const recentActivities = [
    {
      id: "1",
      type: "New User",
      description: "John Doe registered as a client",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "Service Request",
      description: "Plumbing service requested by Alice",
      time: "5 hours ago",
    },
    {
      id: "3",
      type: "Completed",
      description: "Electrical repair service completed",
      time: "Yesterday",
    },
    {
      id: "4",
      type: "New Provider",
      description: "Mike joined as Carpentry service provider",
      time: "2 days ago",
    },
  ];

  // Render a metric card
  const renderMetricCard = ({ title, value, icon }) => (
    <View style={styles.metricCard} key={title}>
      <View style={styles.metricIconContainer}>
        <Ionicons name={icon} size={24} color="#6A5ACD" />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
  );

  // Render an activity item
  const renderActivityItem = ({ id, type, description, time }) => (
    <TouchableOpacity style={styles.activityItem} key={id}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityType}>{type}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
      <Text style={styles.activityDescription}>{description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage your platform</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#6A5ACD" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Metrics</Text>
          <View style={styles.metricsContainer}>
            {metrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="person-add" size={24} color="white" />
              <Text style={styles.actionText}>Add User</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="construct" size={24} color="white" />
              <Text style={styles.actionText}>Add Service</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="newspaper" size={24} color="white" />
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="settings" size={24} color="white" />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activitiesContainer}>
            {recentActivities.map(renderActivityItem)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  section: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    width: "48%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  metricIconContainer: {
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  metricTitle: {
    fontSize: 14,
    color: "#666",
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#6A5ACD",
    borderRadius: 12,
    padding: 15,
    width: "48%",
    marginBottom: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  activitiesContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activityItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  activityType: {
    fontWeight: "bold",
    color: "#6A5ACD",
  },
  activityTime: {
    fontSize: 12,
    color: "#999",
  },
  activityDescription: {
    color: "#666",
  },
});

export default AdminDashboard;
