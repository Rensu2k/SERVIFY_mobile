import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../Components/AuthContext";
import { CommonActions } from "@react-navigation/native";

const ServiceProviderDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Handle logout function
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          const result = await logout();
          if (result.success) {
            // Navigate back to the auth screen and reset navigation
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Auth" }],
              })
            );
          } else {
            Alert.alert("Error", "Failed to log out. Please try again.");
          }
        },
      },
    ]);
  };

  // Placeholder data for service requests
  const serviceRequests = [
    {
      id: "1",
      customer: "John Doe",
      service: "Plumbing",
      date: "2023-06-10",
      time: "10:00 AM",
      status: "pending",
      address: "123 Main St, Surigao City",
    },
    {
      id: "2",
      customer: "Jane Smith",
      service: "Plumbing",
      date: "2023-06-11",
      time: "2:30 PM",
      status: "confirmed",
      address: "456 Park Ave, Surigao City",
    },
    {
      id: "3",
      customer: "Mike Johnson",
      service: "Plumbing",
      date: "2023-06-12",
      time: "9:15 AM",
      status: "completed",
      address: "789 Ocean Blvd, Surigao City",
    },
  ];

  const stats = {
    completed: 15,
    pending: 3,
    cancelled: 2,
    earnings: 12500,
  };

  const renderServiceRequest = ({ item }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "pending":
          return "#FFC107";
        case "confirmed":
          return "#4CAF50";
        case "completed":
          return "#2196F3";
        case "cancelled":
          return "#F44336";
        default:
          return "#757575";
      }
    };

    return (
      <TouchableOpacity
        style={styles.requestCard}
        onPress={() => navigation.navigate("RequestDetails", { request: item })}
      >
        <View style={styles.requestHeader}>
          <Text style={styles.customerName}>{item.customer}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.requestDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="construct-outline" size={16} color="#555" />
            <Text style={styles.detailText}>{item.service}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#555" />
            <Text style={styles.detailText}>
              {item.date} at {item.time}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#555" />
            <Text style={styles.detailText}>{item.address}</Text>
          </View>
        </View>

        <View style={styles.requestActions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="cancel" size={24} color="#F44336" />
            <Text style={[styles.actionText, { color: "#F44336" }]}>
              Decline
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDashboardContent = () => (
    <>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.nameText}>
          {user?.username || "Service Provider"}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.cancelled}</Text>
          <Text style={styles.statLabel}>Cancelled</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>₱{stats.earnings}</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Service Requests</Text>
        <TouchableOpacity onPress={() => setActiveTab("requests")}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={serviceRequests.slice(0, 2)}
        renderItem={renderServiceRequest}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </>
  );

  const renderRequestsContent = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Service Requests</Text>
      </View>

      <FlatList
        data={serviceRequests}
        renderItem={renderServiceRequest}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </>
  );

  const renderSettingsContent = () => (
    <View style={styles.settingsContainer}>
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require("../assets/images/Profile.jpg")}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Ionicons name="pencil" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>
          {user?.username || "Service Provider"}
        </Text>
        <Text style={styles.profileEmail}>Service Provider Account</Text>
      </View>

      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => navigation.navigate("ManageServices")}
      >
        <FontAwesome5 name="briefcase" size={20} color="#6A5ACD" />
        <Text style={styles.settingText}>Manage Services</Text>
        <MaterialIcons name="chevron-right" size={24} color="#757575" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <FontAwesome5 name="bell" size={20} color="#6A5ACD" />
        <Text style={styles.settingText}>Notifications</Text>
        <MaterialIcons name="chevron-right" size={24} color="#757575" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => navigation.navigate("Availability")}
      >
        <FontAwesome5 name="calendar-alt" size={20} color="#6A5ACD" />
        <Text style={styles.settingText}>Availability</Text>
        <MaterialIcons name="chevron-right" size={24} color="#757575" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <FontAwesome5 name="credit-card" size={20} color="#6A5ACD" />
        <Text style={styles.settingText}>Payment Methods</Text>
        <MaterialIcons name="chevron-right" size={24} color="#757575" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <FontAwesome5 name="user-edit" size={20} color="#6A5ACD" />
        <Text style={styles.settingText}>Edit Profile</Text>
        <MaterialIcons name="chevron-right" size={24} color="#757575" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.settingItem, styles.logoutItem]}
        onPress={handleLogout}
      >
        <FontAwesome5 name="sign-out-alt" size={20} color="#F44336" />
        <Text style={[styles.settingText, { color: "#F44336" }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const getContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent();
      case "requests":
        return renderRequestsContent();
      case "settings":
        return renderSettingsContent();
      default:
        return renderDashboardContent();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeTab === "dashboard" && "Dashboard"}
          {activeTab === "requests" && "Service Requests"}
          {activeTab === "settings" && "Settings"}
        </Text>
      </View>

      <ScrollView style={styles.content}>{getContent()}</ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "dashboard" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("dashboard")}
        >
          <Ionicons
            name={activeTab === "dashboard" ? "grid" : "grid-outline"}
            size={24}
            color={activeTab === "dashboard" ? "#6A5ACD" : "#757575"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "dashboard" && styles.activeTabLabel,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === "requests" && styles.activeTab]}
          onPress={() => setActiveTab("requests")}
        >
          <Ionicons
            name={activeTab === "requests" ? "list" : "list-outline"}
            size={24}
            color={activeTab === "requests" ? "#6A5ACD" : "#757575"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "requests" && styles.activeTabLabel,
            ]}
          >
            Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === "settings" && styles.activeTab]}
          onPress={() => setActiveTab("settings")}
        >
          <Ionicons
            name={activeTab === "settings" ? "settings" : "settings-outline"}
            size={24}
            color={activeTab === "settings" ? "#6A5ACD" : "#757575"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "settings" && styles.activeTabLabel,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
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
    padding: 15,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: "#757575",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "white",
    width: "48%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6A5ACD",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#757575",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    color: "#6A5ACD",
    fontSize: 14,
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  requestDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 8,
    color: "#555",
    fontSize: 14,
  },
  requestActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#4CAF50",
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    backgroundColor: "white",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: "#6A5ACD",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#757575",
  },
  activeTabLabel: {
    color: "#6A5ACD",
    fontWeight: "bold",
  },
  settingsContainer: {
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#757575",
  },
  editProfileButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 5,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  logoutItem: {
    marginTop: 20,
  },
});

export default ServiceProviderDashboard;
