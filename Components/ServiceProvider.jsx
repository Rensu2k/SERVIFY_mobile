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
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Create a provider object with all necessary data
    const provider = {
      name,
      rating,
      reviews,
      image,
      category,
    };

    // Navigate to provider details screen
    navigation.navigate("ProviderDetails", { provider });
  };

  return (
    <TouchableOpacity style={styles.providerCard} onPress={handlePress}>
      <Image source={image} style={styles.providerImage} />
      <Text style={[styles.providerName, { color: theme.text || "black" }]}>
        {name}
      </Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={[styles.ratingText, { color: theme.text || "black" }]}>
          {rating} ({reviews})
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  providerCard: {
    width: 140,
    marginRight: 16,
  },
  providerImage: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  providerName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default ServiceProvider;
