import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";

const ServiceCategory = ({ icon, name, isActive }) => (
  <TouchableOpacity style={styles.category}>
    <View style={styles.categoryIcon}>
      <Image source={icon} style={styles.categoryIconImage} />
    </View>
    <Text style={[styles.categoryText, isActive && styles.activeCategory]}>
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
    backgroundColor: "#F5F5F5",
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
    color: "black",
    textAlign: "center",
  },
  activeCategory: {
    color: "black",
    fontWeight: "600",
  },
});

export default ServiceCategory;
