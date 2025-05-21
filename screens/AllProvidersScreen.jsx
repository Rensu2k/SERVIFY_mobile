import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../Components/ThemeContext";

// Mock data for service providers by category
const providersByCategory = {
  Laundry: [
    {
      id: "l1",
      name: "Althea Rose Bautista",
      rating: "4.8",
      reviews: "287",
      image: require("../assets/images/laundry/Althea-Rose-Bautista.png"),
      category: "Laundry",
    },
    {
      id: "l2",
      name: "Hazel Marie Navarro",
      rating: "4.8",
      reviews: "287",
      image: require("../assets/images/laundry/Hazel-Marie-Navarro.png"),
      category: "Laundry",
    },
    {
      id: "l3",
      name: "Janel Reyes",
      rating: "4.8",
      reviews: "287",
      image: require("../assets/images/laundry/Janelle-Mae-Reyes.png"),
      category: "Laundry",
    },
    {
      id: "l4",
      name: "Maria Angelica Cruz",
      rating: "4.8",
      reviews: "287",
      image: require("../assets/images/laundry/Maria-Angelica-Cruz.png"),
      category: "Laundry",
    },
    {
      id: "l5",
      name: "Marites Chismosa Dalisay",
      rating: "4.8",
      reviews: "287",
      image: require("../assets/images/laundry/Marites-Chismosa-Dalisay.png"),
      category: "Laundry",
    },
    {
      id: "l6",
      name: "Sarah Johnson",
      rating: "4.6",
      reviews: "176",
      image: require("../assets/images/laundry/Althea-Rose-Bautista.png"),
      category: "Laundry",
    },
    {
      id: "l7",
      name: "Emma Davis",
      rating: "4.7",
      reviews: "203",
      image: require("../assets/images/laundry/Hazel-Marie-Navarro.png"),
      category: "Laundry",
    },
    {
      id: "l8",
      name: "Jessica Wilson",
      rating: "4.9",
      reviews: "312",
      image: require("../assets/images/laundry/Janelle-Mae-Reyes.png"),
      category: "Laundry",
    },
  ],
  Plumbing: [
    {
      id: "p1",
      name: "John Carlo Mendoza",
      rating: "4.9",
      reviews: "156",
      image: require("../assets/images/plumbing/John-Carlo-Mendoza.png"),
      category: "Plumbing",
    },
    {
      id: "p2",
      name: "Joseph Villanueva",
      rating: "4.7",
      reviews: "203",
      image: require("../assets/images/plumbing/Joseph-Villanueva.png"),
      category: "Plumbing",
    },
    {
      id: "p3",
      name: "Joshua Miguel Santos",
      rating: "4.7",
      reviews: "203",
      image: require("../assets/images/plumbing/Joshua-Miguel-Santos.png"),
      category: "Plumbing",
    },
    {
      id: "p4",
      name: "Mark Angelo Reyes",
      rating: "4.7",
      reviews: "203",
      image: require("../assets/images/plumbing/Mark-Angelo-Reyes.png"),
      category: "Plumbing",
    },
    {
      id: "p5",
      name: "Nathaniel Cruz",
      rating: "4.7",
      reviews: "203",
      image: require("../assets/images/plumbing/Nathaniel-Cruz.png"),
      category: "Plumbing",
    },
    {
      id: "p6",
      name: "Robert Chen",
      rating: "4.8",
      reviews: "189",
      image: require("../assets/images/plumbing/John-Carlo-Mendoza.png"),
      category: "Plumbing",
    },
    {
      id: "p7",
      name: "David Lee",
      rating: "4.6",
      reviews: "145",
      image: require("../assets/images/plumbing/Joseph-Villanueva.png"),
      category: "Plumbing",
    },
    {
      id: "p8",
      name: "Michael Kim",
      rating: "4.5",
      reviews: "167",
      image: require("../assets/images/plumbing/Joshua-Miguel-Santos.png"),
      category: "Plumbing",
    },
  ],
  Cleaning: [
    {
      id: "c1",
      name: "Patricia Santos",
      rating: "4.9",
      reviews: "212",
      image: require("../assets/images/laundry/Althea-Rose-Bautista.png"),
      category: "Cleaning",
    },
    {
      id: "c2",
      name: "Carolina Reyes",
      rating: "4.7",
      reviews: "178",
      image: require("../assets/images/laundry/Hazel-Marie-Navarro.png"),
      category: "Cleaning",
    },
    {
      id: "c3",
      name: "Sophia Garcia",
      rating: "4.8",
      reviews: "198",
      image: require("../assets/images/laundry/Janelle-Mae-Reyes.png"),
      category: "Cleaning",
    },
    {
      id: "c4",
      name: "Angelica Lopez",
      rating: "4.6",
      reviews: "167",
      image: require("../assets/images/laundry/Maria-Angelica-Cruz.png"),
      category: "Cleaning",
    },
  ],
  Manicure: [
    {
      id: "m1",
      name: "Isabella Cruz",
      rating: "4.9",
      reviews: "231",
      image: require("../assets/images/laundry/Althea-Rose-Bautista.png"),
      category: "Manicure",
    },
    {
      id: "m2",
      name: "Samantha Tan",
      rating: "4.8",
      reviews: "189",
      image: require("../assets/images/laundry/Hazel-Marie-Navarro.png"),
      category: "Manicure",
    },
    {
      id: "m3",
      name: "Nicole Lim",
      rating: "4.7",
      reviews: "176",
      image: require("../assets/images/laundry/Janelle-Mae-Reyes.png"),
      category: "Manicure",
    },
  ],
  Massage: [
    {
      id: "ms1",
      name: "Maria Serapio",
      rating: "4.9",
      reviews: "256",
      image: require("../assets/images/laundry/Althea-Rose-Bautista.png"),
      category: "Massage",
    },
    {
      id: "ms2",
      name: "Fatima Reyes",
      rating: "4.8",
      reviews: "231",
      image: require("../assets/images/laundry/Hazel-Marie-Navarro.png"),
      category: "Massage",
    },
    {
      id: "ms3",
      name: "Jennifer Wu",
      rating: "4.7",
      reviews: "187",
      image: require("../assets/images/laundry/Janelle-Mae-Reyes.png"),
      category: "Massage",
    },
  ],
  Technician: [
    {
      id: "t1",
      name: "Marco Santos",
      rating: "4.9",
      reviews: "198",
      image: require("../assets/images/plumbing/John-Carlo-Mendoza.png"),
      category: "Technician",
    },
    {
      id: "t2",
      name: "Edwin Perez",
      rating: "4.8",
      reviews: "176",
      image: require("../assets/images/plumbing/Joseph-Villanueva.png"),
      category: "Technician",
    },
    {
      id: "t3",
      name: "Miguel Castro",
      rating: "4.7",
      reviews: "165",
      image: require("../assets/images/plumbing/Joshua-Miguel-Santos.png"),
      category: "Technician",
    },
    {
      id: "t4",
      name: "Daniel Rivera",
      rating: "4.6",
      reviews: "154",
      image: require("../assets/images/plumbing/Mark-Angelo-Reyes.png"),
      category: "Technician",
    },
  ],
};

const AllProvidersScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const { theme } = useTheme();

  const providers = providersByCategory[category] || [];

  const handleProviderPress = (provider) => {
    navigation.navigate("ProviderDetails", { provider });
  };

  const renderProvider = ({ item }) => (
    <TouchableOpacity
      style={[styles.providerCard, { backgroundColor: theme.card }]}
      onPress={() => handleProviderPress(item)}
    >
      <Image source={item.image} style={styles.providerImage} />
      <Text style={[styles.providerName, { color: theme.text }]}>
        {item.name}
      </Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={[styles.ratingText, { color: theme.text }]}>
          {item.rating} ({item.reviews})
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {category} Providers
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={providers}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No service providers available for this category.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 12,
    paddingBottom: 20,
  },
  providerCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: "47%",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default AllProvidersScreen;
