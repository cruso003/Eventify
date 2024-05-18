import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Platform,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import eventsApi from "../api/events";

const Search = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [category, setCategory] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const fetchEventsData = async () => {
    try {
      const eventsData = await eventsApi.getEvents();
      setEvents(eventsData.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const filterEvents = () => {
    setSearchResultsLoading(true);

    let filteredEvents = events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchText.toLowerCase()) ||
        event.category.toLowerCase().includes(searchText.toLowerCase()) ||
        event.description.toLowerCase().includes(searchText.toLowerCase())
    );

    if (category) {
      filteredEvents = filteredEvents.filter(
        (event) => event.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (dateRange.startDate && dateRange.endDate) {
      filteredEvents = filteredEvents.filter((event) => {
        const eventDate = new Date(event.startingTime);
        return (
          eventDate >= new Date(dateRange.startDate) &&
          eventDate <= new Date(dateRange.endDate)
        );
      });
    }

    setSearchResults(filteredEvents);
    setSearchResultsLoading(false);
  };

  useEffect(() => {
    filterEvents();
  }, [searchText, category, dateRange]);

  useEffect(() => {
    fetchEventsData();
  }, []);

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateRange.startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setDateRange({ ...dateRange, startDate: currentDate });
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateRange.endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    setDateRange({ ...dateRange, endDate: currentDate });
  };

  const styles = StyleSheet.create({
    centerElement: { justifyContent: "center", alignItems: "center" },
    eventContainer: {
      width: "48%",
      margin: "1%",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      width: "80%",
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      marginBottom: 15,
      fontWeight: "bold",
    },
    modalButton: {
      marginTop: 10,
      marginLeft: 10,
    },
    // Add more styles as needed
  });

  let TouchablePlatformSpecific =
    Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "black",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          marginBottom: 2,
        }}
      >
        <TouchableOpacity
          style={[styles.centerElement, { width: 50, height: 50 }]}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
        <View style={{ flexGrow: 1, height: 50, justifyContent: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              height: 35,
              borderRadius: 4,
            }}
          >
            <TextInput
              autoFocus
              style={{ paddingHorizontal: 10 }}
              placeholder="Search Events"
              value={searchText}
              onChangeText={(searchKeyword) => setSearchText(searchKeyword)}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[styles.centerElement, { width: 65, height: 50 }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={{ fontSize: 11, color: "black" }}>
            <AntDesign name="filter" size={22} color="black" />
            Filter
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        {searchResultsLoading ? (
          <View style={[styles.centerElement, { height: 300 }]}>
            <ActivityIndicator size="large" color="#ef5739" />
          </View>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {searchResults.map((event, i) => (
              <View key={i} style={styles.eventContainer}>
                <TouchablePlatformSpecific
                  onPress={() =>
                    navigation.navigate("EventDetail", {
                      selectedEvent: event,
                    })
                  }
                  background={TouchableNativeFeedback.Ripple("#888", false)}
                  useForeground={true}
                >
                  <View
                    style={{
                      backgroundColor: "#fff",
                      paddingHorizontal: 10,
                      paddingBottom: 10,
                      margin: 3,
                    }}
                  >
                    <Image
                      source={{ uri: event.imageUrl }}
                      style={[
                        styles.centerElement,
                        { height: 120, width: "100%", marginRight: 25 },
                      ]}
                      resizeMode="cover"
                    />
                    <Text
                      numberOfLines={2}
                      style={{ fontSize: 16, height: 35 }}
                    >
                      {event.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#ee4e2e",
                        marginBottom: 10,
                      }}
                    >
                      {moment(event.startingTime).format(
                        "MMMM DD, YYYY hh:mm A"
                      )}
                    </Text>
                  </View>
                </TouchablePlatformSpecific>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filter Events</Text>
                <View>
                  <Text>Category</Text>
                  <TextInput
                    style={{
                      backgroundColor: "#f0f0f0",
                      height: 35,
                      borderRadius: 4,
                      paddingHorizontal: 10,
                      marginBottom: 10,
                    }}
                    placeholder="Enter category"
                    value={category}
                    onChangeText={(text) => setCategory(text)}
                  />
                </View>
                <View>
                  <Text>Date Range</Text>
                  <TouchableOpacity
                    onPress={() => setShowStartDatePicker(true)}
                    style={{
                      backgroundColor: "#f0f0f0",
                      height: 35,
                      borderRadius: 4,
                      justifyContent: "center",
                      paddingHorizontal: 10,
                      marginBottom: 5,
                    }}
                  >
                    <Text>
                      {dateRange.startDate
                        ? moment(dateRange.startDate).format("MMMM DD, YYYY")
                        : "Start Date"}
                    </Text>
                  </TouchableOpacity>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={dateRange.startDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onStartDateChange}
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => setShowEndDatePicker(true)}
                    style={{
                      backgroundColor: "#f0f0f0",
                      height: 35,
                      borderRadius: 4,
                      justifyContent: "center",
                      paddingHorizontal: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Text>
                      {dateRange.endDate
                        ? moment(dateRange.endDate).format("MMMM DD, YYYY")
                        : "End Date"}
                    </Text>
                  </TouchableOpacity>
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={dateRange.endDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onEndDateChange}
                    />
                  )}
                </View>
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <TouchableOpacity
                    onPress={() => setFilterModalVisible(false)}
                    style={styles.modalButton}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setFilterModalVisible(false);
                      filterEvents();
                    }}
                    style={styles.modalButton}
                  >
                    <Text>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default Search;
