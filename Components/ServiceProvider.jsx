import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ServiceProvider = ({
  name,
  rating,
  reviews,
  image,
  theme = {},
  category,
  provider,
  categoryId,
}) => {
  const navigation = useNavigation();

  // Debug logging
  console.log("ServiceProvider Debug:");
  console.log("Provider:", JSON.stringify(provider, null, 2));
  console.log("Image prop:", image);

  const handlePress = () => {
    // Create a provider object with all necessary data
    const providerData = {
      name,
      rating,
      reviews,
      image,
      category,
      ...provider,
    };

    // Navigate to provider details screen
    navigation.navigate("ProviderDetails", { provider: providerData });
  };

  const isAvailable = provider?.userInfo?.isAvailable !== false;

  // Get service names for the current category (or show first 2 services if no category specified)
  const getDisplayServices = () => {
    if (!provider?.services) return [];

    if (categoryId) {
      // Show services for specific category
      return provider.services.filter(
        (service) => service.category === categoryId
      );
    } else {
      // Show first 2 services if no category filter
      return provider.services.slice(0, 2);
    }
  };

  const displayServices = getDisplayServices();
  const hasMoreServices =
    provider?.services && provider.services.length > displayServices.length;

  return (
    <TouchableOpacity style={styles.providerCard} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={
            provider?.profileImage && provider.profileImage.trim()
              ? { uri: provider.profileImage }
              : provider?.userInfo?.profileImage &&
                provider.userInfo.profileImage.trim()
              ? { uri: provider.userInfo.profileImage }
              : image || require("../assets/images/Profile.jpg")
          }
          style={styles.providerImage}
          onError={(error) => {
            console.log(
              "ServiceProvider image error:",
              error.nativeEvent.error
            );
          }}
        />
        <View
          style={[
            styles.availabilityBadge,
            {
              backgroundColor: isAvailable ? "#4CAF50" : "#F44336",
            },
          ]}
        >
          <Ionicons
            name={isAvailable ? "checkmark-circle" : "close-circle"}
            size={10}
            color="white"
          />
        </View>
      </View>

      {/* Service Names */}
      {displayServices.length > 0 && (
        <View style={styles.servicesContainer}>
          {displayServices.map((service, index) => (
            <Text
              key={service.id}
              style={[styles.serviceName, { color: theme.accent || "#6A5ACD" }]}
              numberOfLines={1}
            >
              {service.name}
              {index < displayServices.length - 1 && ", "}
            </Text>
          ))}
          {hasMoreServices && (
            <Text
              style={[
                styles.moreServicesText,
                { color: theme.text || "black" },
              ]}
            >
              +{provider.services.length - displayServices.length} more
            </Text>
          )}
        </View>
      )}

      <Text style={[styles.providerName, { color: theme.text || "black" }]}>
        {name}
      </Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={[styles.ratingText, { color: theme.text || "black" }]}>
          {rating} ({reviews})
        </Text>
      </View>
      <Text
        style={[
          styles.availabilityText,
          {
            color: isAvailable ? "#4CAF50" : "#F44336",
          },
        ]}
      >
        {isAvailable ? "Available" : "Unavailable"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  providerCard: {
    width: 140,
    marginRight: 16,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  providerImage: {
    width: "100%",
    height: 140,
    borderRadius: 8,
  },
  availabilityBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: "600",
  },
  moreServicesText: {
    fontSize: 10,
    fontStyle: "italic",
    opacity: 0.7,
  },
  providerName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: "500",
  },
});

export default ServiceProvider;
