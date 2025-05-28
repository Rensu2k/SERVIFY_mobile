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
import { serviceOperations } from "../Components/DatabaseService";

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
    category: "plumbing",
  });

  useEffect(() => {
    loadServices();
  }, []);

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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const closeModal = () => {
    dismissKeyboard();
    setModalVisible(false);
    setKeyboardVisible(false);
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const providerServices = await serviceOperations.getServicesByProvider(
        user.id
      );
      setServices(providerServices);
    } catch (error) {
      console.error("Error loading services:", error);
      Alert.alert("Error", "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    try {
      if (
        !formData.name ||
        !formData.description ||
        !formData.price ||
        !formData.duration
      ) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const newService = {
        ...formData,
        providerId: user.id,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
      };

      await serviceOperations.addService(newService);
      await loadServices();
      closeModal();
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        category: "plumbing",
      });
    } catch (error) {
      console.error("Error adding service:", error);
      Alert.alert("Error", "Failed to add service");
    }
  };

  const handleEditService = async () => {
    try {
      if (
        !formData.name ||
        !formData.description ||
        !formData.price ||
        !formData.duration
      ) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const updates = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
      };

      await serviceOperations.updateService(currentService.id, updates);
      await loadServices();
      closeModal();
      setCurrentService(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        category: "plumbing",
      });
    } catch (error) {
      console.error("Error updating service:", error);
      Alert.alert("Error", "Failed to update service");
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this service?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await serviceOperations.deleteService(serviceId);
              await loadServices();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting service:", error);
      Alert.alert("Error", "Failed to delete service");
    }
  };

  const openEditModal = (service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
    });
    setModalVisible(true);
  };

  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceItem}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
        <View style={styles.serviceDetails}>
          <Text style={styles.servicePrice}>₱{item.price}</Text>
          <Text style={styles.serviceDuration}>{item.duration} mins</Text>
        </View>
      </View>
      <View style={styles.serviceActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="pencil" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteService(item.id)}
        >
          <Ionicons name="trash" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Services</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {currentService ? "Edit Service" : "Add New Service"}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.formContainer}>
                <Text style={styles.label}>Service Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholder="Enter service name"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                  placeholder="Enter service description"
                  multiline
                  numberOfLines={4}
                />

                <Text style={styles.label}>Price (₱)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(text) =>
                    setFormData({ ...formData, price: text })
                  }
                  placeholder="Enter price"
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Duration (minutes)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.duration}
                  onChangeText={(text) =>
                    setFormData({ ...formData, duration: text })
                  }
                  placeholder="Enter duration"
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryContainer}>
                  {SERVICE_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        formData.category === category.id &&
                          styles.selectedCategory,
                        { backgroundColor: category.color },
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, category: category.id })
                      }
                    >
                      <FontAwesome5
                        name={category.icon}
                        size={16}
                        color="white"
                      />
                      <Text style={styles.categoryText}>{category.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={currentService ? handleEditService : handleAddService}
              >
                <Text style={styles.submitButtonText}>
                  {currentService ? "Update Service" : "Add Service"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  serviceItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginRight: 12,
  },
  serviceDuration: {
    fontSize: 14,
    color: "#666",
  },
  serviceActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  formContainer: {
    maxHeight: "70%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 20,
    margin: 4,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: "white",
  },
  categoryText: {
    color: "white",
    marginLeft: 4,
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ManageServicesScreen;
