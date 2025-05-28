import { serviceOperations } from "./DatabaseService";
import { userOperations } from "./DatabaseService";

const SERVICES_STORAGE_KEY = "servify_provider_services";
const USERS_STORAGE_KEY = "servify_users";

export const SERVICE_CATEGORIES = [
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

const getAllUsers = async () => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getAllServices = async () => {
  try {
    return await serviceOperations.getAllServices();
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const getServicesByCategory = async (categoryId) => {
  try {
    return await serviceOperations.getServicesByCategory(categoryId);
  } catch (error) {
    console.error("Error fetching services by category:", error);
    return [];
  }
};

export const getServicesGroupedByCategory = async () => {
  try {
    const allServices = await getAllServices();
    const groupedServices = {};

    SERVICE_CATEGORIES.forEach((category) => {
      groupedServices[category.id] = allServices.filter(
        (service) => service.category === category.id
      );
    });

    return groupedServices;
  } catch (error) {
    console.error("Error grouping services by category:", error);
    return {};
  }
};

export const getProvidersByCategory = async (categoryId) => {
  try {
    const services = await getServicesByCategory(categoryId);
    const users = await userOperations.getAllUsers();
    const providers = new Map();

    services.forEach((service) => {
      if (!providers.has(service.providerId)) {
        const userInfo = users.find((user) => user.id === service.providerId);

        providers.set(service.providerId, {
          id: userInfo?.id || service.providerId,
          name: userInfo?.username || "Unknown Provider",
          email: userInfo?.email || "",
          userType: userInfo?.userType || "provider",
          profileImage: userInfo?.profileImage || null,
          rating: "4.5",
          reviews: "0",
          services: [],
          userInfo: userInfo,
        });
      }
      providers.get(service.providerId).services.push(service);
    });

    return Array.from(providers.values());
  } catch (error) {
    console.error("Error fetching providers by category:", error);
    return [];
  }
};

export const getAllProviders = async () => {
  try {
    const allServices = await getAllServices();
    const users = await userOperations.getAllUsers();
    const providers = new Map();

    allServices.forEach((service) => {
      if (!providers.has(service.providerId)) {
        const userInfo = users.find((user) => user.id === service.providerId);

        providers.set(service.providerId, {
          id: userInfo?.id || service.providerId,
          name: userInfo?.username || "Unknown Provider",
          email: userInfo?.email || "",
          userType: userInfo?.userType || "provider",
          profileImage: userInfo?.profileImage || null,
          rating: "4.5",
          reviews: "0",
          services: [],
          userInfo: userInfo,
        });
      }
      providers.get(service.providerId).services.push(service);
    });

    return Array.from(providers.values());
  } catch (error) {
    console.error("Error fetching all providers:", error);
    return [];
  }
};

export const getAvailableCategories = async () => {
  try {
    const allServices = await getAllServices();
    const availableCategories = new Set();

    allServices.forEach((service) => {
      if (service.category) {
        availableCategories.add(service.category);
      }
    });

    return SERVICE_CATEGORIES.filter((category) =>
      availableCategories.has(category.id)
    );
  } catch (error) {
    console.error("Error fetching available categories:", error);
    return [];
  }
};

export const getCategoryInfo = (categoryId) => {
  return (
    SERVICE_CATEGORIES.find((cat) => cat.id === categoryId) ||
    SERVICE_CATEGORIES[0]
  );
};

export const getServicesWithProviders = async () => {
  try {
    const allServices = await getAllServices();
    const users = await userOperations.getAllUsers();
    const servicesWithProviders = [];

    allServices.forEach((service) => {
      const userInfo = users.find((user) => user.id === service.providerId);

      if (userInfo) {
        servicesWithProviders.push({
          service,
          provider: {
            id: service.providerId,
            name: userInfo.username || "Unknown Provider",
            email: userInfo.email || "",
            userType: userInfo.userType || "provider",
            profileImage: userInfo.profileImage || null,
            rating: "4.5",
            reviews: "0",
            userInfo: userInfo,
          },
        });
      }
    });

    return servicesWithProviders;
  } catch (error) {
    console.error("Error fetching services with providers:", error);
    return [];
  }
};

export const getServicesByCategoryWithProviders = async (categoryId) => {
  try {
    const allServicesWithProviders = await getServicesWithProviders();
    return allServicesWithProviders.filter(
      (item) => item.service.category === categoryId
    );
  } catch (error) {
    console.error("Error fetching services by category with providers:", error);
    return [];
  }
};
