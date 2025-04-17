import React from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BannerSlider from "../Components/BannerSlider";
import ServiceCategory from "../Components/ServiceCategory";
import ServiceProvider from "../Components/ServiceProvider";

const HomeScreenContent = () => (
  <SafeAreaView style={styles.container}>
    <StatusBar />
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#A9A9A9" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#A9A9A9"
        />
      </View>

      <BannerSlider />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        <ServiceCategory
          icon={require("../assets/images/Laundry.png")}
          name="Laundry"
        />
        <ServiceCategory
          icon={require("../assets/images/Jointpipes.jpg")}
          name="Plumbing"
        />
        <ServiceCategory
          icon={require("../assets/images/Broom.png")}
          name="Cleaning"
        />
        <ServiceCategory
          icon={require("../assets/images/NailCutter.png")}
          name="Manicure"
        />
        <ServiceCategory
          icon={require("../assets/images/Massage.png")}
          name="Massage"
        />
        <ServiceCategory
          icon={require("../assets/images/Technician.jpg")}
          name="Technician"
        />
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Laundry</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.providersContainer}
      >
        <ServiceProvider
          name="Althea Rose Bautista"
          rating="4.8"
          reviews="287"
          image={require("../assets/images/laundry/Althea-Rose-Bautista.png")}
        />
        <ServiceProvider
          name="Hazel Marie Navarro"
          rating="4.8"
          reviews="287"
          image={require("../assets/images/laundry/Hazel-Marie-Navarro.png")}
        />
        <ServiceProvider
          name="Janel Reyes"
          rating="4.8"
          reviews="287"
          image={require("../assets/images/laundry/Janelle-Mae-Reyes.png")}
        />
        <ServiceProvider
          name="Maria Angelica Cruz"
          rating="4.8"
          reviews="287"
          image={require("../assets/images/laundry/Maria-Angelica-Cruz.png")}
        />
        <ServiceProvider
          name="Marites Chismosa Dalisay"
          rating="4.8"
          reviews="287"
          image={require("../assets/images/laundry/Marites-Chismosa-Dalisay.png")}
        />
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Plumbing</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.providersContainer}
      >
        <ServiceProvider
          name="John Carlo Mendoza"
          rating="4.9"
          reviews="156"
          image={require("../assets/images/plumbing/John-Carlo-Mendoza.png")}
        />
        <ServiceProvider
          name="Joseph Villanueva"
          rating="4.7"
          reviews="203"
          image={require("../assets/images/plumbing/Joseph-Villanueva.png")}
        />
        <ServiceProvider
          name="Joshua Miguel Santos"
          rating="4.7"
          reviews="203"
          image={require("../assets/images/plumbing/Joshua-Miguel-Santos.png")}
        />
        <ServiceProvider
          name="Mark Angelo Reyes"
          rating="4.7"
          reviews="203"
          image={require("../assets/images/plumbing/Mark-Angelo-Reyes.png")}
        />
        <ServiceProvider
          name="Nathaniel Cruz"
          rating="4.7"
          reviews="203"
          image={require("../assets/images/plumbing/Nathaniel-Cruz.png")}
        />
      </ScrollView>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    margin: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "black",
  },
  categoriesContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  seeAllText: {
    fontSize: 14,
    color: "black",
  },
  providersContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
});

export default HomeScreenContent;
