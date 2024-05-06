import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import styles from "./AddEventStyles";
import Back from "react-native-vector-icons/Ionicons";
import { ActivityIndicator, Card } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import uuid from "react-native-uuid";
import eventTypes from "../../api/eventTypes";
import colors from "../../config/colors";
import events from "../../api/events";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddEvent = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eventTypeData, setEventTypeData] = useState([]);
  const [startingTime, setStartingTime] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [tickets, setTickets] = useState([]);
  const [ticketName, setTicketName] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketVariations, setTicketVariations] = useState([]);
  const [user, setUser] = useState(false);

  const getData = async () => {
    const userData = await AsyncStorage.getItem("userData");

    setUser(JSON.parse(userData));
  };
  useEffect(() => {
    getData();
  }, []);

  const userId = user._id;
  const handleStartingTimeChange = (text) => {
    setStartingTime(text);
  };

  const addEvent = async () => {
    try {
      setLoading(true);

      // Construct the event object
      const eventData = {
        type: selectedEventType,
        category: selectedCategory,
        title: name,
        startingTime: new Date(startingTime),
        description: description,
        image: image,
        location: location,
        tickets: tickets,
        owner: userId,
      };

      // Call the API to add the event
      const response = await events.createEvent(eventData);

      // Handle success
      console.log("Event added successfully:", response);

      // Reset form fields
      setImage("");
      setName("");
      setDescription("");
      setStartingTime("");
      setLocation("");
      setSelectedCategory("");
      setSelectedEventType("");
      setTickets([]);

      Toast.show({
        type: "success",
        text1: "Uploaded successfully",
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Error adding event:", error);
      Toast.show({
        type: "error",
        text1: "Error adding event:",
        error,
        visibilityTime: 3000,
      });
      // Handle error, show error message, etc.
    } finally {
      setLoading(false);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const response = await eventTypes.getEventtypes();
      setEventTypeData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching event types:", error);
    }
  };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const handleEventTypeChange = (itemValue) => {
    setSelectedEventType(itemValue);
    setSelectedCategory(""); // Reset selected category when event type changes
  };

  useEffect(() => {}, [eventTypeData]);

  const addTicket = () => {
    // Generate a random QR identifier
    const qrCode = uuid.v4();
    // Add a new ticket to the tickets array
    setTickets([
      ...tickets,
      {
        name: ticketName,
        description: ticketDescription,
        price: ticketPrice,
        variations: ticketVariations,
        category: selectedCategory,
        qrCode: qrCode,
      },
    ]);
    // Reset ticket fields
    setTicketName("");
    setTicketDescription("");
    setTicketPrice(0);
    setTicketVariations([]);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      let newFile = {
        uri: result.assets[0].uri,
        type: `file/${result.assets[0].uri.split(".")[1]}`,
        name: `file.${result.assets[0].uri.split(".")[1]}`,
      };
      uploadToCloud(newFile);
    }
  };

  const uploadToCloud = (image) => {
    setLoading(true); // Set loading state to true
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Eventify");
    data.append("cloud_name", "dl43pywkr");

    fetch("https://api.cloudinary.com/v1_1/dl43pywkr/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to upload image to cloud");
        }
        return res.json();
      })
      .then((data) => {
        setImage(data.url);
        setLoading(false); // Set loading state to false after image is uploaded
      })
      .catch((error) => {
        setLoading(false); // Set loading state to false in case of error
        Toast.show({
          type: "error",
          text1: "Failed to upload image",
          visibilityTime: 5000,
        });
      });
  };
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
            <Text style={styles.nameText}>Add Event</Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
        <View style={styles.camDiv}>
          <TouchableOpacity style={styles.camIconDiv} onPress={pickImage}>
            <Back name="camera" size={22} style={styles.cameraIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={pickImage}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Card.Cover
                size={140}
                style={styles.avatar}
                source={{
                  uri:
                    image == "" || image == null
                      ? "data:image/jpeg;base64,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"
                      : image,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 50,
            marginHorizontal: 22,
          }}
        >
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Event Title</Text>
            <TextInput
              placeholder="Event Name"
              placeholderTextColor={"#999797"}
              style={styles.infoEditSecond_text}
              onChange={(e) => setName(e.nativeEvent.text)}
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

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Location</Text>
            <TextInput
              placeholder="Event Location"
              placeholderTextColor={"#999797"}
              style={styles.infoEditSecond_text}
              onChange={(e) => setLocation(e.nativeEvent.text)}
              numberOfLines={2}
            />
          </View>
          <View>
            <Text>Select Event Type:</Text>
            <Picker
              selectedValue={selectedEventType}
              onValueChange={handleEventTypeChange}
              style={styles.picker}
            >
              <Picker.Item label="Select an event type" value="" />
              {eventTypeData.map((eventType) => (
                <Picker.Item
                  key={eventType._id}
                  label={eventType.name}
                  value={eventType._id}
                />
              ))}
            </Picker>
            <View>
              <Text>Select Category:</Text>
              {selectedEventType && (
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a category" value="" />
                  {eventTypeData
                    .find((eventType) => eventType._id === selectedEventType)
                    .categories.map((category) => (
                      <Picker.Item
                        key={category._id}
                        label={category.name}
                        value={category._id}
                      />
                    ))}
                </Picker>
              )}
            </View>
          </View>
          <View>
            <Text style={styles.text}>Enter Starting Time:</Text>
            <TextInput
              placeholder="YYYY/MM/DD HH:mm AM/PM"
              placeholderTextColor={"#999797"}
              value={startingTime}
              onChangeText={handleStartingTimeChange}
              style={{
                borderWidth: 1,
                borderColor: "gray",
                padding: 10,
                color: "white",
              }}
            />
          </View>
          {/* Render existing tickets */}
          {tickets.map((ticket, index) => (
            <View key={index} style={styles.pickerContainer}>
              <Text style={{ color: "black" }}>{`Ticket ${index + 1}`}</Text>
              <Text style={{ color: "black" }}>Name: {ticket.name}</Text>
              <Text style={{ color: "black" }}>
                Description: {ticket.description}
              </Text>
              <Text style={{ color: "black" }}>Price: {ticket.price}</Text>
              {/* Render variations here if needed */}
            </View>
          ))}

          {/* Add a new ticket */}
          <View>
            <Text style={styles.text}>Add Ticket:</Text>
            <TextInput
              placeholder="Ticket Name"
              placeholderTextColor={"#999797"}
              style={styles.infoEditSecond_text}
              value={ticketName}
              onChangeText={setTicketName}
            />
            <TextInput
              placeholder="Ticket Description"
              placeholderTextColor={"#999797"}
              style={styles.infoEditSecond_text}
              value={ticketDescription}
              onChangeText={setTicketDescription}
            />
            <TextInput
              placeholder="Ticket Price"
              placeholderTextColor={"#999797"}
              style={styles.infoEditSecond_text}
              value={ticketPrice.toString()}
              onChangeText={(text) => setTicketPrice(parseFloat(text))}
            />
            {/* Add variation fields if needed */}
            <TouchableOpacity
              onPress={addTicket}
              style={{
                width: "30%",
                backgroundColor: colors.secondary,
                alignItems: "center",
                paddingHorizontal: 15,
                paddingVertical: 15,
                borderRadius: 50,
              }}
            >
              <Text style={{ color: "white" }}>Add Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.button}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity onPress={addEvent} style={styles.inBut}>
              <View>
                <Text style={styles.textSign}>Add Event</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default AddEvent;
