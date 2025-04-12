import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import BookingsScreen from "./BookingsScreen";
import ProfileScreen from "./ProfileScreen";

const { width } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

const BannerSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  // Ref to store the latest active index for interval usage.
  const activeIndexRef = useRef(activeIndex);

  const bannerData = [
    {
      id: "1",
      title: "Your Instant Link to the Perfect Service Provider",
      image: require("../../assets/ServiceBG.png"),
      logo: true,
      backgroundColor: "#E5E2FF",
    },
    {
      id: "2",
      title: "Laundry?",
      image: require("../../assets/images/Laundry.png"),
      backgroundColor: "#FFE6F5",
    },
    {
      id: "3",
      title: "Plumbing Problems?",
      image: require("../../assets/images/Plumber.png"),
      backgroundColor: "#E1F9ED",
    },
  ];

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndexRef.current + 1) % bannerData.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, []); // Empty dependency ensures the timer is set only once

  // Render each banner item
  const renderItem = ({ item }) => {
    return (
      <View
        style={[
          styles.bannerItem,
          item.backgroundColor && { backgroundColor: item.backgroundColor },
        ]}
      >
        {item.logo ? (
          <View style={styles.firstBannerContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/LOGO.png")}
                style={styles.logo}
              />
            </View>
            <Text style={styles.tagline}>{item.title}</Text>
            <Image source={item.image} style={styles.bannerImage} />
          </View>
        ) : (
          <View style={styles.serviceBannerContainer}>
            <Text style={styles.serviceBannerTitle}>{item.title}</Text>
            <Image source={item.image} style={styles.serviceBannerImage} />
          </View>
        )}
      </View>
    );
  };

  // Render dot indicators for banner slides
  const renderDotIndicator = () => {
    return (
      <View style={styles.dotContainer}>
        {bannerData.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={bannerData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setActiveIndex(newIndex);
        }}
        snapToInterval={width - 32}
        decelerationRate="normal"
        contentContainerStyle={styles.sliderContentContainer}
      />
      {renderDotIndicator()}
    </View>
  );
};

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

function HomeScreenContent() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#A9A9A9" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#A9A9A9"
          />
        </View>

        {/* Slider Banner */}
        <BannerSlider />

        {/* Service Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          <ServiceCategory
            icon={require("../../assets/images/Laundry.png")}
            name="Laundry"
          />
          <ServiceCategory
            icon={require("../../assets/images/Jointpipes.jpg")}
            name="Plumbing"
          />
          <ServiceCategory
            icon={require("../../assets/images/Broom.png")}
            name="Cleaning"
          />
          <ServiceCategory
            icon={require("../../assets/images/NailCutter.png")}
            name="Manicure"
          />
          <ServiceCategory
            icon={require("../../assets/images/Massage.png")}
            name="Massage"
          />
          <ServiceCategory
            icon={require("../../assets/images/Technician.jpg")}
            name="Technician"
          />
        </ScrollView>

        {/* Laundry Section */}
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
            image={require("../../assets/images/laundry/Althea-Rose-Bautista.png")}
          />
          <ServiceProvider
            name="Hazel Marie Navarro"
            rating="4.8"
            reviews="287"
            image={require("../../assets/images/laundry/Hazel-Marie-Navarro.png")}
          />
          <ServiceProvider
            name="Janel Reyes"
            rating="4.8"
            reviews="287"
            image={require("../../assets/images/laundry/Janelle-Mae-Reyes.png")}
          />
          <ServiceProvider
            name="Maria Angelica Cruz"
            rating="4.8"
            reviews="287"
            image={require("../../assets/images/laundry/Maria-Angelica-Cruz.png")}
          />
          <ServiceProvider
            name="Marites Chismosa Dalisay"
            rating="4.8"
            reviews="287"
            image={require("../../assets/images/laundry/Marites-Chismosa-Dalisay.png")}
          />
        </ScrollView>

        {/* Plumbing Section */}
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
            image={require("../../assets/images/plumbing/John-Carlo-Mendoza.png")}
          />
          <ServiceProvider
            name="Joseph Villanueva"
            rating="4.7"
            reviews="203"
            image={require("../../assets/images/plumbing/Joseph-Villanueva.png")}
          />
          <ServiceProvider
            name="Joshua Miguel Santos"
            rating="4.7"
            reviews="203"
            image={require("../../assets/images/plumbing/Joshua-Miguel-Santos.png")}
          />
          <ServiceProvider
            name="Mark Angelo Reyes"
            rating="4.7"
            reviews="203"
            image={require("../../assets/images/plumbing/Mark-Angelo-Reyes.png")}
          />
          <ServiceProvider
            name="Nathaniel Cruz"
            rating="4.7"
            reviews="203"
            image={require("../../assets/images/plumbing/Nathaniel-Cruz.png")}
          />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ServifyApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Bookings") {
              iconName = focused ? "document-text" : "document-text-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#6A5ACD",
          tabBarInactiveTintColor: "gray",
          // Use a static style here; for dynamic behavior consider a custom tab bar component.
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: "gray",
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreenContent} />
        <Tab.Screen name="Bookings" component={BookingsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

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
  sliderContentContainer: {
    paddingRight: 16,
  },
  bannerItem: {
    width: width - 32,
    height: 200,
    marginLeft: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  firstBannerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    flexDirection: "column",
    flexWrap: "wrap",
  },
  logoContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  tagline: {
    fontSize: 16,
    color: "#8072FF",
    width: "50%",
    marginTop: 10,
    marginBottom: 60,
  },
  bannerImage: {
    width: "50%",
    height: 150,
    resizeMode: "cover",
  },
  serviceBannerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  serviceBannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    width: "40%",
  },
  serviceBannerImage: {
    width: "60%",
    height: "100%",
    resizeMode: "contain",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CCCCCC",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#6A5ACD",
  },
  categoriesContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop: 10,
  },
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
