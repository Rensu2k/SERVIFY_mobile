import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";

const ServiceCategory = ({ icon, name, isActive, theme = {}, onPress }) => (
  <TouchableOpacity style={styles.category} onPress={onPress}>
    <View
      style={[
        styles.categoryIcon,
        { backgroundColor: theme.card || "#F5F5F5" },
      ]}
    >
      <Image source={icon} style={styles.categoryIconImage} />
    </View>
    <Text
      style={[
        styles.categoryText,
        { color: theme.text || "black" },
        isActive && styles.activeCategory,
        isActive && { color: theme.accent || "black", fontWeight: "600" },
      ]}
    >
      {name}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  category: {
    alignItems: "center",
    width: 60,
    marginRight: 20,
    marginLeft: 10,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIconImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  categoryText: {
    fontSize: 12,
    textAlign: "center",
  },
  activeCategory: {
    fontWeight: "600",
  },
});

export default ServiceCategory;
