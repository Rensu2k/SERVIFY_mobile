import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ServiceProvider = ({ name, rating, reviews, image }) => (
  <TouchableOpacity style={styles.providerCard}>
    <Image source={image} style={styles.providerImage} />
    <Text style={styles.providerName}>{name}</Text>
    <View style={styles.ratingContainer}>
      <Ionicons name="star" size={16} color="#FFD700" />
      <Text style={styles.ratingText}>
        {rating} ({reviews})
      </Text>
    </View>
  </TouchableOpacity>
);

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
    color: "black",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "black",
    marginLeft: 4,
  },
});

export default ServiceProvider;
