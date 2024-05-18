import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  BackHandler,
  Alert,
} from "react-native";
import userApi from "../api/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../config/colors";
import eventTypes from "../api/eventTypes";
import Toast from "react-native-toast-message";

const CategorySelectionScreen = () => {
  const navigation = useNavigation();
  const [eventTypeData, setEventTypeData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchEventTypes = async () => {
    try {
      const response = await eventTypes.getEventtypes();
      setEventTypeData(response.data);
    } catch (error) {
      console.error("Error fetching event types:", error);
    }
  };

  const handleBackPress = () => {
    Alert.alert("Exit App", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Exit",
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [])
  );

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const saveCategories = async () => {
    if (selectedCategories.length >= 3) {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const user = JSON.parse(userData);

        const response = await userApi.updateUserInterests(
          user._id,
          selectedCategories
        );
        if (response.ok) {
          user.selectedInterests = selectedCategories;
          await AsyncStorage.setItem("userData", JSON.stringify(user));

          navigation.navigate("FeaturedScreen");

          // Show success toast
          Toast.show({
            type: "success",
            text1: "Categories Saved",
            position: "top",
          });
        } else {
          let errorMessage = "Error Saving Categories";
          if (response && response.data && response.data.message) {
            errorMessage = response.data.message;
          }
          // Show error toast with the error message from the response
          Toast.show({
            type: "error",
            text1: errorMessage,
            position: "top",
          });
        }
      } catch (error) {
        console.error("Error saving categories:", error);
        let errorMessage = "Error Saving Categories";
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
        // Show error toast with the error message from the response
        Toast.show({
          type: "error",
          text1: errorMessage,
          position: "top",
        });
      }
    } else {
      alert("Please select at least 3 categories");
    }
  };

  const renderCategory = (category) => {
    const isSelected = selectedCategories.includes(category);
    return (
      <TouchableOpacity
        key={category}
        style={[styles.category, isSelected && styles.selectedCategory]}
        onPress={() => toggleCategory(category)}
      >
        <Text style={styles.categoryText}>{category}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Personalize your feed</Text>
      <Text style={styles.subtitle}>Select 3 or more categories</Text>
      {eventTypeData.map((eventType) => (
        <View key={eventType._id}>
          <Text style={styles.sectionTitle}>{eventType.name}</Text>
          <View style={styles.categoryContainer}>
            {eventType.categories.map((category) =>
              renderCategory(category.name)
            )}
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={saveCategories}>
        <Text style={styles.buttonText}>
          {selectedCategories.length} selected
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.white,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
    color: colors.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: colors.white,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    color: colors.white,
  },
  category: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    margin: 5,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.white,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CategorySelectionScreen;
