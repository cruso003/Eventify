import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import styles from "../EventsUploads/AddEventStyles";
import Back from "react-native-vector-icons/Ionicons";
import { ActivityIndicator } from "react-native-paper";
import eventTypes from "../../api/eventTypes";

const AddEventTypes = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const addEventTypes = async () => {
    try {
      setLoading(true);
      const eventTypesData = {
        name,
        description,
      };

      const response = await eventTypes.addEventTypes(eventTypesData);
      if (response.ok === true) {
        Toast.show({
          type: "success",
          text1: "Event type added successfully",
          visibilityTime: 3000,
        });
        // Clear the form after a successful upload
        setName("");
        setDescription("");
      }

      setLoading(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to add event types",
        visibilityTime: 3000,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    // This useEffect will execute only once when the component mounts
    // So, it will trigger the upload operation immediately
    addEventTypes();
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
            <Text style={styles.nameText}>Add Event Type</Text>
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
            <Text style={styles.infoEditFirst_text}>Event Type Title</Text>
            <TextInput
              placeholder="Event Type Name"
              placeholderTextColor={"#999797"}
              style={styles.infoEditSecond_text}
              onChange={(e) => setName(e.nativeEvent.text)}
              value={name} // Use value prop instead of defaultValue
            />
          </View>
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Description:</Text>
            <TextInput
              placeholder="Event Description"
              placeholderTextColor="#999797"
              style={[styles.descriptionText, styles.multiLineTextInput]}
              multiline={true}
              numberOfLines={4} // Adjust the number of lines as needed
              onChangeText={(text) => setDescription(text)}
              value={description}
            />
          </View>
        </View>
        <View style={styles.button}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity onPress={addEventTypes} style={styles.inBut}>
              <View>
                <Text style={styles.textSign}>Upload Event Type</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default AddEventTypes;
