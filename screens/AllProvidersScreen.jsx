import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "../Components/ThemeContext";
import {
  getProvidersByCategory,
  getAllProviders,
  getCategoryInfo,
} from "../Components/ServicesHelper";

const AllProvidersScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const category = route.params?.category;
  const categoryInfo = category ? getCategoryInfo(category) : null;

  useEffect(() => {
    loadProviders();
  }, [category]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      let providersList = [];

      if (category) {
        // Get providers for specific category
        providersList = await getProvidersByCategory(category);
      } else {
        // Get all providers
        providersList = await getAllProviders();
      }

      setProviders(providersList);
    } catch (error) {
      console.error("Error loading providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderPress = (provider) => {
    navigation.navigate("ProviderDetails", { provider });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProviders();
    setRefreshing(false);
  };

  const renderProvider = ({ item }) => (
    <TouchableOpacity
      style={[styles.providerCard, { backgroundColor: theme.card }]}
      onPress={() => handleProviderPress(item)}
    >
      <Image
        source={
          item?.profileImage
            ? { uri: item.profileImage }
            : item?.userInfo?.profileImage
            ? { uri: item.userInfo.profileImage }
            : require("../assets/images/Profile.jpg")
        }
        style={styles.providerImage}
      />
      <View style={styles.providerInfo}>
        {/* Service Names */}
        {item.services.length > 0 && (
          <View style={styles.serviceNamesContainer}>
            {item.services.slice(0, 3).map((service, index) => (
              <Text
                key={service.id}
                style={[styles.serviceNameText, { color: theme.accent }]}
                numberOfLines={1}
              >
                {service.name}
                {index < Math.min(item.services.length, 3) - 1 && ", "}
              </Text>
            ))}
            {item.services.length > 3 && (
              <Text style={[styles.moreServicesInline, { color: theme.text }]}>
                +{item.services.length - 3} more
              </Text>
            )}
          </View>
        )}

        <View style={styles.nameContainer}>
          <Text style={[styles.providerName, { color: theme.text }]}>
            {item.name}
          </Text>
          {/* Availability Badge */}
          <View
            style={[
              styles.availabilityBadge,
              {
                backgroundColor:
                  item.userInfo?.isAvailable !== false ? "#4CAF50" : "#F44336",
              },
            ]}
          >
            <Ionicons
              name={
                item.userInfo?.isAvailable !== false
                  ? "checkmark-circle"
                  : "close-circle"
              }
              size={10}
              color="white"
            />
            <Text style={styles.availabilityBadgeText}>
              {item.userInfo?.isAvailable !== false
                ? "Available"
                : "Unavailable"}
            </Text>
          </View>
        </View>

        {/* Show provider's services */}
        <View style={styles.servicesContainer}>
          {item.services.slice(0, 2).map((service, index) => {
            const serviceCategoryInfo = getCategoryInfo(service.category);
            return (
              <View
                key={service.id}
                style={[
                  styles.serviceBadge,
                  { backgroundColor: serviceCategoryInfo.color },
                ]}
              >
                <FontAwesome5
                  name={serviceCategoryInfo.icon}
                  size={10}
                  color="white"
                />
                <Text style={styles.serviceBadgeText}>{service.name}</Text>
              </View>
            );
          })}
          {item.services.length > 2 && (
            <Text style={[styles.moreServices, { color: theme.text }]}>
              +{item.services.length - 2} more
            </Text>
          )}
        </View>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={[styles.rating, { color: theme.text }]}>
            {item.rating}
          </Text>
          <Text style={[styles.reviews, { color: theme.text }]}>
            ({item.reviews} reviews)
          </Text>
        </View>

        <Text style={[styles.serviceCount, { color: theme.accent }]}>
          {item.services.length} service{item.services.length !== 1 ? "s" : ""}{" "}
          available
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.text}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {categoryInfo ? categoryInfo.label : "All Providers"}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading providers...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {categoryInfo ? categoryInfo.label : "All Providers"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {providers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="users-slash" size={64} color="#CCCCCC" />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No providers found
          </Text>
          <Text style={[styles.emptySubText, { color: theme.text }]}>
            {categoryInfo
              ? `No providers are offering ${categoryInfo.label.toLowerCase()} services yet`
              : "No service providers are available yet"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={providers}
          renderItem={renderProvider}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.providersList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.accent]}
              tintColor={theme.accent}
              progressBackgroundColor={theme.card}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  providersList: {
    padding: 16,
  },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerInfo: { flex: 1 },
  serviceNamesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  serviceNameText: { fontSize: 12, fontWeight: "600" },
  moreServicesInline: { fontSize: 10, fontStyle: "italic", opacity: 0.7 },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  providerName: { fontSize: 16, fontWeight: "bold", flex: 1 },
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  availabilityBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 4,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    alignItems: "center",
  },
  serviceBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  serviceBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  moreServices: {
    fontSize: 12,
    fontStyle: "italic",
    opacity: 0.7,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.7,
  },
  serviceCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  chevron: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
    opacity: 0.7,
  },
});

export default AllProvidersScreen;
