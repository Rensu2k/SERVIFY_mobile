import React, { useState } from "react";
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
import { useTheme } from "../Components/ThemeContext";

const HomeScreenContent = ({ navigation }) => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryPress = (categoryName) => {
    setActiveCategory(categoryName);
    navigation.navigate("AllProviders", { category: categoryName });
  };

  const handleSeeAll = (category) => {
    navigation.navigate("AllProviders", { category });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={
          theme.background === "#FFFFFF" ? "dark-content" : "light-content"
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.inputBackground },
          ]}
        >
          <Ionicons name="search" size={20} color={theme.text} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search"
            placeholderTextColor={
              theme.text === "#FFFFFF" ? "#AAAAAA" : "#A9A9A9"
            }
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
            theme={theme}
            isActive={activeCategory === "Laundry"}
            onPress={() => handleCategoryPress("Laundry")}
          />
          <ServiceCategory
            icon={require("../assets/images/Jointpipes.jpg")}
            name="Plumbing"
            theme={theme}
            isActive={activeCategory === "Plumbing"}
            onPress={() => handleCategoryPress("Plumbing")}
          />
          <ServiceCategory
            icon={require("../assets/images/Broom.png")}
            name="Cleaning"
            theme={theme}
            isActive={activeCategory === "Cleaning"}
            onPress={() => handleCategoryPress("Cleaning")}
          />
          <ServiceCategory
            icon={require("../assets/images/NailCutter.png")}
            name="Manicure"
            theme={theme}
            isActive={activeCategory === "Manicure"}
            onPress={() => handleCategoryPress("Manicure")}
          />
          <ServiceCategory
            icon={require("../assets/images/Massage.png")}
            name="Massage"
            theme={theme}
            isActive={activeCategory === "Massage"}
            onPress={() => handleCategoryPress("Massage")}
          />
          <ServiceCategory
            icon={require("../assets/images/Technician.jpg")}
            name="Technician"
            theme={theme}
            isActive={activeCategory === "Technician"}
            onPress={() => handleCategoryPress("Technician")}
          />
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Laundry
          </Text>
          <TouchableOpacity onPress={() => handleSeeAll("Laundry")}>
            <Text style={[styles.seeAllText, { color: theme.accent }]}>
              See all
            </Text>
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
            theme={theme}
          />
          <ServiceProvider
            name="Hazel Marie Navarro"
            rating="4.8"
            reviews="287"
            image={require("../assets/images/laundry/Hazel-Marie-Navarro.png")}
            theme={theme}
          />
          <ServiceProvider
            name="Janel Reyes"
            rating="4.8"
            reviews="287"
            image={require("../assets/images/laundry/Janelle-Mae-Reyes.png")}
            theme={theme}
          />
          <ServiceProvider
            name="Maria Angelica Cruz"
            rating="4.8"
            reviews="287"
            image={require("../assets/images/laundry/Maria-Angelica-Cruz.png")}
            theme={theme}
          />
          <ServiceProvider
            name="Marites Chismosa Dalisay"
            rating="4.8"
            reviews="287"
            image={require("../assets/images/laundry/Marites-Chismosa-Dalisay.png")}
            theme={theme}
          />
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Plumbing
          </Text>
          <TouchableOpacity onPress={() => handleSeeAll("Plumbing")}>
            <Text style={[styles.seeAllText, { color: theme.accent }]}>
              See all
            </Text>
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
            theme={theme}
          />
          <ServiceProvider
            name="Joseph Villanueva"
            rating="4.7"
            reviews="203"
            image={require("../assets/images/plumbing/Joseph-Villanueva.png")}
            theme={theme}
          />
          <ServiceProvider
            name="Joshua Miguel Santos"
            rating="4.7"
            reviews="203"
            image={require("../assets/images/plumbing/Joshua-Miguel-Santos.png")}
            theme={theme}
          />
          <ServiceProvider
            name="Mark Angelo Reyes"
            rating="4.7"
            reviews="203"
            image={require("../assets/images/plumbing/Mark-Angelo-Reyes.png")}
            theme={theme}
          />
          <ServiceProvider
            name="Nathaniel Cruz"
            rating="4.7"
            reviews="203"
            image={require("../assets/images/plumbing/Nathaniel-Cruz.png")}
            theme={theme}
          />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    margin: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
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
  },
  seeAllText: {
    fontSize: 14,
  },
  providersContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
});

export default HomeScreenContent;
