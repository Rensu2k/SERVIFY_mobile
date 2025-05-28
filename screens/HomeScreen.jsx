import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import BannerSlider from "../Components/BannerSlider";
import ServiceCategory from "../Components/ServiceCategory";
import ServiceProvider from "../Components/ServiceProvider";
import ServiceCard from "../Components/ServiceCard";
import { useTheme } from "../Components/ThemeContext";
import {
  getAvailableCategories,
  getProvidersByCategory,
  getServicesByCategoryWithProviders,
  SERVICE_CATEGORIES,
  getCategoryInfo,
} from "../Components/ServicesHelper";

const HomeScreenContent = ({ navigation }) => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [servicesByCategory, setServicesByCategory] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const categories = await getAvailableCategories();
      setAvailableCategories(categories);

      const servicesData = {};
      for (const category of categories.slice(0, 3)) {
        const services = await getServicesByCategoryWithProviders(category.id);
        servicesData[category.id] = services.slice(0, 8);
      }
      setServicesByCategory(servicesData);
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
    navigation.navigate("AllProviders", { category: categoryId });
  };

  const handleSeeAll = (categoryId) => {
    navigation.navigate("AllProviders", { category: categoryId });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleServicePress = (service, provider) => {
    navigation.navigate("ProviderDetails", {
      provider,
      selectedService: service,
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading services...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={
          theme.background === "#FFFFFF" ? "dark-content" : "light-content"
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.accent]}
            tintColor={theme.accent}
            progressBackgroundColor={theme.card}
          />
        }
      >
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.inputBackground },
          ]}
        >
          <Ionicons name="search" size={20} color={theme.text} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search services..."
            placeholderTextColor={
              theme.text === "#FFFFFF" ? "#AAAAAA" : "#A9A9A9"
            }
          />
        </View>

        <BannerSlider />

        {/* Available Categories */}
        {availableCategories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {availableCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  activeCategory === category.id && styles.activeCategoryCard,
                ]}
                onPress={() => handleCategoryPress(category.id)}
              >
                <FontAwesome5
                  name={category.icon}
                  size={24}
                  color={
                    activeCategory === category.id ? "white" : category.color
                  }
                />
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        activeCategory === category.id ? "white" : theme.text,
                    },
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Services by Category */}
        {Object.keys(servicesByCategory).length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="tools" size={64} color="#CCCCCC" />
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No services available yet
            </Text>
            <Text style={[styles.emptySubText, { color: theme.text }]}>
              Service providers haven't added any services yet
            </Text>
          </View>
        ) : (
          Object.entries(servicesByCategory).map(([categoryId, services]) => {
            const categoryInfo = getCategoryInfo(categoryId);

            if (services.length === 0) return null;

            return (
              <View key={categoryId}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    {categoryInfo.label}
                  </Text>
                  <TouchableOpacity onPress={() => handleSeeAll(categoryId)}>
                    <Text style={[styles.seeAllText, { color: theme.accent }]}>
                      See all
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.servicesContainer}
                >
                  {services.map((item, index) => (
                    <ServiceCard
                      key={`${item.service.id}-${index}`}
                      service={item.service}
                      provider={item.provider}
                      theme={theme}
                    />
                  ))}
                </ScrollView>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  categoryCard: {
    alignItems: "center",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
    minWidth: 80,
  },
  activeCategoryCard: {
    backgroundColor: "#6A5ACD",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 5,
    textAlign: "center",
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
  servicesContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
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

export default HomeScreenContent;
