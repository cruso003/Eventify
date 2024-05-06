import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import styles from "../EventsUploads/AddEventStyles";
import Back from "react-native-vector-icons/Ionicons";
import { ActivityIndicator } from "react-native-paper";
import eventCategory from "../../api/categories";
import eventTypes from "../../api/eventTypes";
import { Picker } from "@react-native-picker/picker";

const AddCategory = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventTypeData, setEventTypeData] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState(
    "Please choose an event type"
  );

  const addEventCategory = async () => {
    try {
      setLoading(true);

      // Check if name is empty or selected event type is not valid
      if (!name || selectedEventType === "Please choose an event type") {
        Toast.show({
          type: "error",
          text1: "No name or event type selected",
          visibilityTime: 3000,
        });
        setLoading(false);
        return; // Exit the function
      }

      const eventCategoryData = {
        name,
        eventType: selectedEventType,
      };
      const response = await eventCategory.addCategory(eventCategoryData);

      if (response.ok === true) {
        Toast.show({
          type: "success",
          text1: "Event category added successfully",
          visibilityTime: 3000,
        });
        setName("");
        setSelectedEventType("Please choose an event type");
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message,
          visibilityTime: 3000,
        });
      }

      setLoading(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "An error occurred while adding the event category",
        visibilityTime: 3000,
      });
      setLoading(false);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const response = await eventTypes.getEventtypes();
      const eventTypesArray = response.data.map((eventType) => ({
        value: eventType._id, // assuming each event type object has an id
        label: eventType.name,
      }));
      setEventTypeData(eventTypesArray);
    } catch (error) {
      console.error("Error fetching event types:", error);
    }
  };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  useEffect(() => {}, [eventTypeData]);

  useEffect(() => {
    // Call addEventCategory only when the component mounts and loading is initially true
    if (loading) {
      addEventCategory();
    }
  }, []);

  return (
    <ScrollView
      keyboardShouldPersistTaps={"always"}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      style={{ backgroundColor: "black" }}
    >
      <View>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Back name="arrow-back" size={30} style={styles.backIcon} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 3 }}>
            <Text style={styles.nameText}>Add Event Category</Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
        <View
          style={{
            marginTop: 50,
            marginHorizontal: 22,
          }}
        >
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Event category Title</Text>
            <TextInput
              placeholder="Event category Name"
              placeholderTextColor={"#999797"}
              style={styles.infoEditSecond_text}
              onChange={(e) => setName(e.nativeEvent.text)}
              value={name} // Use value prop instead of defaultValue
            />
          </View>
          <View>
            <Text style={styles.text}>Select Event Type:</Text>
            <Picker
              selectedValue={selectedEventType}
              onValueChange={(itemValue) => setSelectedEventType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select an event type" value="" />
              {eventTypeData.map((eventType) => (
                <Picker.Item
                  key={eventType.value}
                  label={eventType.label}
                  value={eventType.value}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.button}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity onPress={addEventCategory} style={styles.inBut}>
              <View>
                <Text style={styles.textSign}>Upload Event Category</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default AddCategory;
