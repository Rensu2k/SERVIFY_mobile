import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const BannerSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const activeIndexRef = useRef(activeIndex);

  const bannerData = [
    {
      id: "1",
      title: "Your Instant Link to the Perfect Service Provider",
      image: require("../assets/ServiceBG.png"),
      logo: true,
      backgroundColor: "#E5E2FF",
    },
    {
      id: "2",
      title: "Laundry?",
      image: require("../assets/images/Laundry.png"),
      backgroundColor: "#FFE6F5",
    },
    {
      id: "3",
      title: "Plumbing Problems?",
      image: require("../assets/images/Plumber.png"),
      backgroundColor: "#E1F9ED",
    },
  ];

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndexRef.current + 1) % bannerData.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={[styles.bannerItem, { backgroundColor: item.backgroundColor }]}
    >
      {item.logo ? (
        <View style={styles.firstBannerContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/LOGO.png")}
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

  const renderDotIndicator = () => (
    <View style={styles.dotContainer}>
      {bannerData.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === activeIndex && styles.activeDot]}
        />
      ))}
    </View>
  );

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
        onMomentumScrollEnd={(e) =>
          setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        snapToInterval={width - 32}
        decelerationRate="normal"
        contentContainerStyle={styles.sliderContentContainer}
      />
      {renderDotIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContentContainer: {
    paddingRight: 16,
  },
  bannerItem: {
    width: width - 32,
    height: 200,
    marginLeft: 16,
    borderRadius: 12,
    overflow: "hidden",
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
});

export default BannerSlider;
