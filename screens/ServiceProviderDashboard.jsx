import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../Components/AuthContext";
import { CommonActions } from "@react-navigation/native";
import { bookingOperations } from "../Components/DatabaseService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ServiceProviderDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [providerBookings, setProviderBookings] = useState({
    pending: [],
    completed: [],
    cancelled: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [lastCheckedBookings, setLastCheckedBookings] = useState([]);

  // Load provider bookings when component mounts or user changes
  useEffect(() => {
    if (user && user.userType === "provider") {
      loadProviderBookings();
      loadNotificationData();
    }
  }, [user]);

  // Check for new bookings and update notifications
  useEffect(() => {
    if (providerBookings.pending.length > 0) {
      checkForNewBookings();
    }
  }, [providerBookings]);

  // Set up periodic checking for new bookings
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && user.userType === "provider") {
        loadProviderBookings();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Load bookings for the current service provider
  const loadProviderBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Use the provider's username or id to get their bookings
      const bookings = await bookingOperations.getProviderBookings(
        user.username
      );

      if (bookings) {
        setProviderBookings(bookings);
      } else {
        setProviderBookings({
          pending: [],
          completed: [],
          cancelled: [],
        });
      }
    } catch (error) {
      console.error("Error loading provider bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh bookings
  const onRefresh = async () => {
    setRefreshing(true);
    await loadProviderBookings();
    setRefreshing(false);
  };

  // Load notification data from storage
  const loadNotificationData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(`notifications_${user.id}`);
      if (storedData) {
        const { lastChecked, count } = JSON.parse(storedData);
        setLastCheckedBookings(lastChecked || []);
        setNotificationCount(count || 0);
      }
    } catch (error) {
      console.error("Error loading notification data:", error);
    }
  };

  // Save notification data to storage
  const saveNotificationData = async (lastChecked, count) => {
    try {
      const data = {
        lastChecked,
        count,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        `notifications_${user.id}`,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error("Error saving notification data:", error);
    }
  };

  // Check for new bookings
  const checkForNewBookings = () => {
    const currentBookingIds = providerBookings.pending.map(
      (booking) => booking.id
    );
    const newBookings = currentBookingIds.filter(
      (id) => !lastCheckedBookings.includes(id)
    );

    if (newBookings.length > 0) {
      const newCount = notificationCount + newBookings.length;
      setNotificationCount(newCount);
      saveNotificationData(currentBookingIds, newCount);

      // Show notification alert for new bookings
      if (lastCheckedBookings.length > 0) {
        // Only show if not initial load
        Alert.alert(
          "New Booking Alert! 🔔",
          `You have ${newBookings.length} new booking${
            newBookings.length > 1 ? "s" : ""
          } request${newBookings.length > 1 ? "s" : ""}!`,
          [
            {
              text: "View Now",
              onPress: () => setActiveTab("requests"),
            },
            {
              text: "Later",
              style: "cancel",
            },
          ]
        );
      }
    }
  };

  // Clear notifications
  const clearNotifications = () => {
    const allBookingIds = [
      ...providerBookings.pending.map((b) => b.id),
      ...providerBookings.completed.map((b) => b.id),
      ...providerBookings.cancelled.map((b) => b.id),
    ];
    setNotificationCount(0);
    setLastCheckedBookings(allBookingIds);
    saveNotificationData(allBookingIds, 0);
  };

  // Handle notification bell press
  const handleNotificationPress = () => {
    clearNotifications();
    setActiveTab("requests");
  };

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

  // Calculate stats from real booking data
  const calculateStats = () => {
    const completed = providerBookings.completed.length;
    const pending = providerBookings.pending.length;
    const cancelled = providerBookings.cancelled.length;

    // Calculate earnings (you can modify this based on your pricing structure)
    const earnings = providerBookings.completed.reduce((total, booking) => {
      const price = booking.details?.service?.price || 0;
      return (
        total + (typeof price === "number" ? price : parseFloat(price) || 0)
      );
    }, 0);

    return {
      completed,
      pending,
      cancelled,
      earnings: earnings.toFixed(2),
    };
  };

  const stats = calculateStats();

  // Get all bookings combined for rendering
  const getAllBookings = () => {
    return [
      ...providerBookings.pending,
      ...providerBookings.completed,
      ...providerBookings.cancelled,
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const renderServiceRequest = ({ item }) => {
    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case "pending":
        case "confirmed":
          return "#FFC107";
        case "accepted":
          return "#4CAF50";
        case "completed":
          return "#2196F3";
        case "pending payment":
          return "#FF9800";
        case "pending confirmation":
          return "#FF9800";
        case "paid":
          return "#4CAF50";
        case "cancelled":
        case "declined":
          return "#F44336";
        default:
          return "#757575";
      }
    };

    // Format booking data to match the expected structure
    const formattedBooking = {
      id: item.id,
      customer:
        item.details?.clientName ||
        item.details?.provider?.name ||
        "Unknown Client",
      service: item.details?.service?.name || item.service || "Service",
      date: item.details?.date
        ? new Date(item.details.date).toDateString()
        : "N/A",
      time: item.details?.time || "N/A",
      status: item.status.toLowerCase(),
      address: item.details?.address || "Address not provided",
      clientEmail: item.details?.clientEmail || "",
      clientPhone: item.details?.clientPhone || "",
      paymentMethod: item.details?.paymentMethod || null,
    };

    return (
      <TouchableOpacity
        style={styles.requestCard}
        onPress={() =>
          navigation.navigate("RequestDetails", { request: formattedBooking })
        }
      >
        <View style={styles.requestHeader}>
          <Text style={styles.customerName}>{formattedBooking.customer}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(formattedBooking.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {formattedBooking.status.charAt(0).toUpperCase() +
                formattedBooking.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.requestDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="construct-outline" size={16} color="#555" />
            <Text style={styles.detailText}>{formattedBooking.service}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#555" />
            <Text style={styles.detailText}>
              {formattedBooking.date} at {formattedBooking.time}
            </Text>
          </View>

          {formattedBooking.address && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color="#555" />
              <Text style={styles.detailText}>{formattedBooking.address}</Text>
            </View>
          )}

          {item.details?.service?.price && (
            <View style={styles.detailRow}>
              <MaterialIcons name="attach-money" size={16} color="#555" />
              <Text style={styles.detailText}>
                ₱
                {typeof item.details.service.price === "number"
                  ? item.details.service.price.toFixed(2)
                  : item.details.service.price}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.requestActions}>
          {formattedBooking.status === "pending" && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate("RequestDetails", {
                  request: formattedBooking,
                })
              }
            >
              <MaterialIcons name="visibility" size={24} color="#6A5ACD" />
              <Text style={[styles.actionText, { color: "#6A5ACD" }]}>
                View Details
              </Text>
            </TouchableOpacity>
          )}

          {formattedBooking.status === "confirmed" && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate("RequestDetails", {
                  request: formattedBooking,
                })
              }
            >
              <MaterialIcons name="visibility" size={24} color="#6A5ACD" />
              <Text style={[styles.actionText, { color: "#6A5ACD" }]}>
                Accept/Decline
              </Text>
            </TouchableOpacity>
          )}

          {formattedBooking.status === "accepted" && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate("RequestDetails", {
                  request: formattedBooking,
                })
              }
            >
              <MaterialIcons name="visibility" size={24} color="#6A5ACD" />
              <Text style={[styles.actionText, { color: "#6A5ACD" }]}>
                Mark Complete
              </Text>
            </TouchableOpacity>
          )}

          {formattedBooking.status === "completed" && (
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              <Text style={[styles.actionText, { color: "#4CAF50" }]}>
                Completed
              </Text>
            </TouchableOpacity>
          )}

          {formattedBooking.status === "pending confirmation" && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate("RequestDetails", {
                  request: formattedBooking,
                })
              }
            >
              <MaterialIcons name="payment" size={24} color="#FF9800" />
              <Text style={[styles.actionText, { color: "#FF9800" }]}>
                Confirm Payment
              </Text>
            </TouchableOpacity>
          )}

          {formattedBooking.status === "paid" && (
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              <Text style={[styles.actionText, { color: "#4CAF50" }]}>
                Payment Confirmed
              </Text>
            </TouchableOpacity>
          )}
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

        <View
          style={[
            styles.statCard,
            notificationCount > 0 && styles.statCardHighlight,
          ]}
        >
          <Text style={styles.statValue}>{stats.pending}</Text>
          <View style={styles.statLabelContainer}>
            <Text style={styles.statLabel}>Pending</Text>
            {notificationCount > 0 && (
              <View style={styles.statNotificationBadge}>
                <Text style={styles.statNotificationText}>NEW</Text>
              </View>
            )}
          </View>
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
        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        <TouchableOpacity onPress={() => setActiveTab("requests")}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A5ACD" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : getAllBookings().length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={50} color="#CCC" />
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubText}>
            Bookings from clients will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={getAllBookings().slice(0, 2)}
          renderItem={renderServiceRequest}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
    </>
  );

  const renderRequestsContent = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bookings</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A5ACD" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : getAllBookings().length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={50} color="#CCC" />
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubText}>
            Bookings from clients will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={getAllBookings()}
          renderItem={renderServiceRequest}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
    </>
  );

  const renderSettingsContent = () => (
    <View style={styles.settingsContainer}>
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              user?.profileImage
                ? { uri: user.profileImage }
                : require("../assets/images/Profile.jpg")
            }
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
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "requests" && "Bookings"}
            {activeTab === "settings" && "Settings"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotificationPress}
        >
          <Ionicons name="notifications-outline" size={24} color="white" />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {notificationCount > 99 ? "99+" : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {getContent()}
      </ScrollView>

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
            Bookings
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#F44336",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
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
  statCardHighlight: {
    backgroundColor: "#FFF3E0",
    borderColor: "#FF9800",
    borderWidth: 2,
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
  statLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statNotificationBadge: {
    backgroundColor: "#F44336",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 5,
  },
  statNotificationText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#6A5ACD",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#757575",
    fontSize: 16,
    marginBottom: 10,
  },
  emptySubText: {
    color: "#CCC",
    fontSize: 14,
  },
});

export default ServiceProviderDashboard;
