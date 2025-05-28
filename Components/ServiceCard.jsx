import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getCategoryInfo } from "./ServicesHelper";

const ServiceCard = ({ service, provider, theme = {} }) => {
  const navigation = useNavigation();

  console.log("ServiceCard Debug:");
  console.log("Provider:", JSON.stringify(provider, null, 2));
  console.log("Provider profileImage:", provider?.profileImage);
  console.log(
    "Provider userInfo profileImage:",
    provider?.userInfo?.profileImage
  );

  const handlePress = () => {
    navigation.navigate("ProviderDetails", {
      provider: provider,
      selectedService: service,
    });
  };

  const isAvailable = provider?.userInfo?.isAvailable !== false;
  const categoryInfo = getCategoryInfo(service.category);

  return (
    <TouchableOpacity
      style={[styles.serviceCard, { backgroundColor: theme.card || "white" }]}
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={
            provider?.profileImage && provider.profileImage.trim()
              ? { uri: provider.profileImage }
              : provider?.userInfo?.profileImage &&
                provider.userInfo.profileImage.trim()
              ? { uri: provider.userInfo.profileImage }
              : require("../assets/images/Profile.jpg")
          }
          style={styles.serviceImage}
          onError={(error) => {
            console.log("Service card image error:", error.nativeEvent.error);
          }}
        />

        {/* Category Icon Badge */}
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: categoryInfo.color },
          ]}
        >
          <FontAwesome5 name={categoryInfo.icon} size={12} color="white" />
        </View>

        {/* Availability Badge */}
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

      <View style={styles.contentContainer}>
        {/* Service Name */}
        <Text
          style={[styles.serviceName, { color: theme.text || "black" }]}
          numberOfLines={2}
        >
          {service.name}
        </Text>

        {/* Provider Name */}
        <Text
          style={[styles.providerName, { color: theme.accent || "#6A5ACD" }]}
          numberOfLines={1}
        >
          by {provider.name}
        </Text>

        {/* Rating Container */}
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={[styles.ratingText, { color: theme.text || "black" }]}>
            {provider.rating} ({provider.reviews})
          </Text>
        </View>

        {/* Price (if available) */}
        {service.price && (
          <Text
            style={[styles.priceText, { color: theme.accent || "#6A5ACD" }]}
          >
            ₱{service.price}
          </Text>
        )}

        {/* Availability Status */}
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  serviceCard: {
    width: 160,
    height: 240,
    marginRight: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 120,
  },
  serviceImage: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
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
  contentContainer: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 11,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: "500",
  },
});

export default ServiceCard;
