import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { userOperations } from "../Components/DatabaseService";
import { useAuth } from "../Components/AuthContext";

const UserManagement = ({ navigation }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'client', 'provider'

  // Check if the current user is admin
  if (!user || user.userType !== "admin") {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Access Denied: Admin privileges required
        </Text>
      </View>
    );
  }

  // Fetch all users
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users when search query or filter changes
  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, filter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await userOperations.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Error", "Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...users];

    // Apply type filter
    if (filter === "client") {
      result = result.filter((user) => user.userType === "client");
    } else if (filter === "provider") {
      result = result.filter((user) => user.userType === "provider");
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((user) =>
        user.username?.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(result);
  };

  const handleDeleteUser = (userId, username) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${username}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const success = await userOperations.deleteUser(userId);

              if (success) {
                // Update local state to reflect deletion
                setUsers((prevUsers) =>
                  prevUsers.filter((u) => u.id !== userId)
                );
                Alert.alert("Success", "User has been deleted successfully.");
              } else {
                Alert.alert("Error", "User not found or could not be deleted.");
              }
            } catch (error) {
              console.error("Error deleting user:", error);
              Alert.alert("Error", "Failed to delete user. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleToggleSuspension = async (userId, username, currentStatus) => {
    const action = currentStatus ? "unsuspend" : "suspend";

    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      `Are you sure you want to ${action} ${username}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: currentStatus ? "default" : "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const success = await userOperations.toggleUserSuspension(userId);

              if (success) {
                // Update local state to reflect suspension status change
                setUsers((prevUsers) =>
                  prevUsers.map((u) =>
                    u.id === userId ? { ...u, suspended: !u.suspended } : u
                  )
                );
                Alert.alert(
                  "Success",
                  `User has been ${action}ed successfully.`
                );
              } else {
                Alert.alert("Error", "User not found or could not be updated.");
              }
            } catch (error) {
              console.error("Error toggling user suspension:", error);
              Alert.alert(
                "Error",
                `Failed to ${action} user. Please try again.`
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={[styles.userCard, item.suspended && styles.suspendedUserCard]}>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <View style={styles.userMetadata}>
          <Text style={styles.userType}>
            {item.userType.charAt(0).toUpperCase() + item.userType.slice(1)}
          </Text>
          {item.suspended && (
            <View style={styles.suspendedBadge}>
              <Text style={styles.suspendedText}>Suspended</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.userActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.suspendButton,
            item.suspended && styles.unsuspendButton,
          ]}
          onPress={() =>
            handleToggleSuspension(item.id, item.username, item.suspended)
          }
        >
          <Ionicons
            name={item.suspended ? "play-circle" : "pause-circle"}
            size={20}
            color="white"
          />
          <Text style={styles.actionText}>
            {item.suspended ? "Unsuspend" : "Suspend"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteUser(item.id, item.username)}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>User Management</Text>

      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.activeFilterButton,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "client" && styles.activeFilterButton,
          ]}
          onPress={() => setFilter("client")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "client" && styles.activeFilterText,
            ]}
          >
            Clients
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "provider" && styles.activeFilterButton,
          ]}
          onPress={() => setFilter("provider")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "provider" && styles.activeFilterText,
            ]}
          >
            Providers
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity onPress={loadUsers} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A5ACD" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people" size={50} color="#ccc" />
              <Text style={styles.emptyText}>
                {searchQuery ? "No users match your search" : "No users found"}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  backButton: {
    padding: 5,
  },
  refreshButton: {
    padding: 5,
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "#f0f0f0",
  },
  activeFilterButton: {
    backgroundColor: "#6A5ACD",
  },
  filterText: {
    color: "#666",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "white",
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  suspendedUserCard: {
    backgroundColor: "#f8f8f8",
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
  },
  userInfo: {
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  userMetadata: {
    flexDirection: "row",
    alignItems: "center",
  },
  userType: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  suspendedBadge: {
    backgroundColor: "#ff9800",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  suspendedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  userActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  suspendButton: {
    backgroundColor: "#ff9800",
  },
  unsuspendButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});

export default UserManagement;
