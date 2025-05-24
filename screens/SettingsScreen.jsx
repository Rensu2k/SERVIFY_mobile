import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../Components/ThemeContext";

const SettingsScreen = ({ navigation }) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  const settingsOptions = [
    {
      title: "Account",
      icon: "person-circle-outline",
      actions: [
        {
          name: "Edit Profile",
          icon: "create-outline",
          onPress: () => handleNavigation("EditProfile"),
        },
        {
          name: "Change Password",
          icon: "key-outline",
          onPress: () => handleNavigation("EditPassword"),
        },
        {
          name: "Privacy Settings",
          icon: "shield-checkmark-outline",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Preferences",
      icon: "options-outline",
      actions: [
        {
          name: "Dark Mode",
          icon: isDarkMode ? "moon" : "sunny-outline",
          isToggle: true,
          toggleValue: isDarkMode,
          onToggle: toggleTheme,
        },
        {
          name: "Notifications",
          icon: "notifications-outline",
          onPress: () => {},
        },
        {
          name: "Language",
          icon: "language-outline",
          value: "English",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Help & Support",
      icon: "help-circle-outline",
      actions: [
        {
          name: "Contact Us",
          icon: "mail-outline",
          onPress: () => {},
        },
        {
          name: "FAQ",
          icon: "help-outline",
          onPress: () => {},
        },
        {
          name: "Report a Problem",
          icon: "warning-outline",
          onPress: () => {},
        },
      ],
    },
    {
      title: "About",
      icon: "information-circle-outline",
      actions: [
        {
          name: "App Version",
          icon: "code-outline",
          value: "1.0.0",
        },
        {
          name: "Terms of Service",
          icon: "document-text-outline",
          onPress: () => {},
        },
        {
          name: "Privacy Policy",
          icon: "shield-outline",
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsOptions.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon} size={20} color={theme.accent} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {section.title}
              </Text>
            </View>

            <View
              style={[styles.sectionContent, { backgroundColor: theme.card }]}
            >
              {section.actions.map((action, actionIndex) => (
                <TouchableOpacity
                  key={actionIndex}
                  style={[
                    styles.settingItem,
                    actionIndex !== section.actions.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.border,
                    },
                  ]}
                  onPress={action.isToggle ? undefined : action.onPress}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons
                      name={action.icon}
                      size={22}
                      color={theme.accent}
                    />
                    <Text style={[styles.settingText, { color: theme.text }]}>
                      {action.name}
                    </Text>
                  </View>
                  <View style={styles.settingRight}>
                    {action.isToggle ? (
                      <Switch
                        value={action.toggleValue}
                        onValueChange={action.onToggle}
                        trackColor={{ false: "#767577", true: "#9F7AEA" }}
                        thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
                      />
                    ) : action.value ? (
                      <Text
                        style={[styles.settingValue, { color: theme.text }]}
                      >
                        {action.value}
                      </Text>
                    ) : (
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color={theme.text}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
  section: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 14,
    marginRight: 8,
  },
});

export default SettingsScreen;
