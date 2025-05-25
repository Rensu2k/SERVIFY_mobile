import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../Components/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVICES_STORAGE_KEY = "servify_provider_services";

const SERVICE_CATEGORIES = [
  { id: "plumbing", label: "Plumbing", icon: "wrench", color: "#3F51B5" },
  { id: "electrical", label: "Electrical", icon: "bolt", color: "#FF9800" },
  {
    id: "aircon",
    label: "Aircon Cleaning",
    icon: "snowflake",
    color: "#2196F3",
  },
  { id: "laundry", label: "Laundry", icon: "tshirt", color: "#9C27B0" },
  { id: "housekeeping", label: "Housekeeping", icon: "home", color: "#4CAF50" },
  { id: "gardening", label: "Gardening", icon: "seedling", color: "#8BC34A" },
  { id: "automotive", label: "Automotive", icon: "car", color: "#607D8B" },
  {
    id: "tutoring",
    label: "Tutoring",
    icon: "graduation-cap",
    color: "#795548",
  },
  { id: "beauty", label: "Beauty & Wellness", icon: "cut", color: "#E91E63" },
  { id: "carpentry", label: "Carpentry", icon: "hammer", color: "#5D4037" },
  { id: "painting", label: "Painting", icon: "paint-brush", color: "#FF5722" },
  {
    id: "delivery",
    label: "Delivery Service",
    icon: "truck",
    color: "#009688",
  },
  {
    id: "cooking",
    label: "Cooking/Catering",
    icon: "utensils",
    color: "#FF6F00",
  },
  { id: "other", label: "Other", icon: "ellipsis-h", color: "#9E9E9E" },
];

const ManageServicesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "plumbing", // Default category
  });

  useEffect(() => {
    loadServices();
  }, []);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Function to dismiss keyboard
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Function to close modal and dismiss keyboard
  const closeModal = () => {
    dismissKeyboard();
    setModalVisible(false);
    setKeyboardVisible(false);
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const storedServices = await AsyncStorage.getItem(SERVICES_STORAGE_KEY);
      let parsedServices = storedServices ? JSON.parse(storedServices) : {};

      // Get services for current provider
      const providerServices = parsedServices[user.id] || [];
      setServices(providerServices);
    } catch (error) {
      console.error("Error loading services:", error);
      Alert.alert("Error", "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const saveServices = async (updatedServices) => {
    try {
      const storedServices = await AsyncStorage.getItem(SERVICES_STORAGE_KEY);
      let parsedServices = storedServices ? JSON.parse(storedServices) : {};

      // Update services for current provider
      parsedServices[user.id] = updatedServices;

      await AsyncStorage.setItem(
        SERVICES_STORAGE_KEY,
        JSON.stringify(parsedServices)
      );
      setServices(updatedServices);
      return true;
    } catch (error) {
      console.error("Error saving services:", error);
      Alert.alert("Error", "Failed to save services");
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Service name is required");
      return false;
    }
    if (!formData.price.trim()) {
      Alert.alert("Error", "Price is required");
      return false;
    }
    if (isNaN(parseFloat(formData.price))) {
      Alert.alert("Error", "Price must be a number");
      return false;
    }
    if (!formData.category) {
      Alert.alert("Error", "Service category is required");
      return false;
    }
    return true;
  };

  const handleAddService = () => {
    setCurrentService(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      category: "plumbing", // Default category
    });
    setModalVisible(true);
  };

  const handleEditService = (service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration: service.duration || "",
      category: service.category || "plumbing", // Default to plumbing if not set
    });
    setModalVisible(true);
  };

  const handleDeleteService = (serviceId) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedServices = services.filter((s) => s.id !== serviceId);
            const success = await saveServices(updatedServices);
            if (success) {
              Alert.alert("Success", "Service deleted successfully");
            }
          },
        },
      ]
    );
  };

  const handleSaveService = async () => {
    if (!validateForm()) return;

    const updatedServices = [...services];
    const serviceData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: formData.duration,
      category: formData.category,
    };

    if (currentService) {
      // Edit existing service
      const index = updatedServices.findIndex(
        (s) => s.id === currentService.id
      );
      if (index !== -1) {
        updatedServices[index] = {
          ...updatedServices[index],
          ...serviceData,
        };
      }
    } else {
      // Add new service
      updatedServices.push({
        id: Date.now().toString(),
        ...serviceData,
        createdAt: new Date().toISOString(),
      });
    }

    const success = await saveServices(updatedServices);
    if (success) {
      closeModal();
      Alert.alert(
        "Success",
        currentService
          ? "Service updated successfully"
          : "Service added successfully"
      );
    }
  };

  const getCategoryInfo = (categoryId) => {
    return (
      SERVICE_CATEGORIES.find((cat) => cat.id === categoryId) ||
      SERVICE_CATEGORIES[0]
    );
  };

  const renderServiceItem = ({ item }) => {
    const categoryInfo = getCategoryInfo(item.category);

    return (
      <View style={styles.serviceCard}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceNameContainer}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: categoryInfo.color },
              ]}
            >
              <FontAwesome5
                name={categoryInfo.icon}
                size={12}
                color="white"
                style={styles.categoryIcon}
              />
              <Text style={styles.categoryText}>{categoryInfo.label}</Text>
            </View>
          </View>
          <Text style={styles.servicePrice}>₱{item.price.toFixed(2)}</Text>
        </View>

        {item.description ? (
          <Text style={styles.serviceDescription}>{item.description}</Text>
        ) : null}

        {item.duration ? (
          <View style={styles.serviceDetail}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.serviceDetailText}>{item.duration}</Text>
          </View>
        ) : null}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditService(item)}
          >
            <Ionicons name="create-outline" size={18} color="white" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteService(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="white" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Services</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
          <Ionicons name="add-circle-outline" size={20} color="white" />
          <Text style={styles.addButtonText}>Add New Service</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6A5ACD" />
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        ) : services.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="construct-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>
              You haven't added any services yet
            </Text>
            <Text style={styles.emptySubtext}>
              Start by adding services in categories like Plumbing, Laundry,
              etc.
            </Text>
          </View>
        ) : (
          <FlatList
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.servicesList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalKeyboardView}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
              >
                <View
                  style={[
                    styles.modalContent,
                    keyboardVisible && styles.modalContentKeyboardVisible,
                  ]}
                >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {currentService ? "Edit Service" : "Add New Service"}
                </Text>
                <TouchableOpacity
                      onPress={closeModal}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

                  <ScrollView
                    style={styles.modalForm}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Service Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Basic Plumbing Repair"
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                        returnKeyType="next"
                        onSubmitEditing={dismissKeyboard}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Category *</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScrollView}
                  >
                    <View style={styles.categoryOptionsContainer}>
                      {SERVICE_CATEGORIES.map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          style={[
                            styles.categoryOption,
                            formData.category === category.id &&
                              styles.categoryOptionSelected,
                            { borderColor: category.color },
                          ]}
                          onPress={() =>
                            handleInputChange("category", category.id)
                          }
                        >
                          <FontAwesome5
                            name={category.icon}
                            size={16}
                            color={
                              formData.category === category.id
                                ? "white"
                                : category.color
                            }
                            style={styles.categoryOptionIcon}
                          />
                          <Text
                            style={[
                              styles.categoryOptionText,
                              formData.category === category.id &&
                                styles.categoryOptionTextSelected,
                            ]}
                          >
                            {category.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe what this service includes"
                    value={formData.description}
                    onChangeText={(text) =>
                      handleInputChange("description", text)
                    }
                    multiline
                    numberOfLines={4}
                        returnKeyType="next"
                        onSubmitEditing={dismissKeyboard}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Price (₱) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 500"
                    value={formData.price}
                        onChangeText={(text) =>
                          handleInputChange("price", text)
                        }
                    keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={dismissKeyboard}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Duration</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 1-2 hours"
                    value={formData.duration}
                        onChangeText={(text) =>
                          handleInputChange("duration", text)
                        }
                        returnKeyType="done"
                        onSubmitEditing={dismissKeyboard}
                  />
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveService}
                >
                  <Text style={styles.saveButtonText}>
                    {currentService ? "Save Changes" : "Add Service"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#6A5ACD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  addButton: {
    backgroundColor: "#6A5ACD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  servicesList: {
    paddingBottom: 20,
  },
  serviceCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  serviceNameContainer: {
    flex: 1,
    marginRight: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6A5ACD",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    lineHeight: 20,
  },
  serviceDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  serviceDetailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  actionButtonText: {
    color: "white",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalKeyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalForm: {
    paddingHorizontal: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  categoryScrollView: {
    marginBottom: 10,
  },
  categoryOptionsContainer: {
    flexDirection: "row",
    paddingRight: 20,
  },
  categoryOption: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginRight: 10,
    borderWidth: 2,
    minWidth: 100,
  },
  categoryOptionSelected: {
    backgroundColor: "#6A5ACD",
    borderColor: "#6A5ACD",
  },
  categoryOptionIcon: {
    marginBottom: 5,
  },
  categoryOptionText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  categoryOptionTextSelected: {
    color: "white",
  },
  saveButton: {
    backgroundColor: "#6A5ACD",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContentKeyboardVisible: {
    maxHeight: "70%",
  },
});

export default ManageServicesScreen;
