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
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { dummyData } from "../constants";
import moment from "moment";

const Search = ({ navigation }) => {
  // State variables for managing search functionality
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Function to fetch events based on search text
  const fetchEvents = () => {
    // Reset search results if search text is empty or less than 3 characters
    if (searchText.trim().length < 3) {
      setSearchResults([]);
      return;
    }
    setSearchResultsLoading(true);
    try {
      // Filter events based on searchText in title, type, or description
      const filteredEvents = dummyData.Events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchText.toLowerCase()) ||
          event.type.toLowerCase().includes(searchText.toLowerCase()) ||
          (event.description &&
            event.description.toLowerCase().includes(searchText.toLowerCase()))
      );

      // Update search results with filtered events
      setSearchResults(filteredEvents);
      setSearchResultsLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setSearchResultsLoading(false);
    }
  };

  // Fetch events whenever search text changes
  useEffect(() => {
    fetchEvents();
  }, [searchText]);

  // Styles for components
  const styles = StyleSheet.create({
    centerElement: { justifyContent: "center", alignItems: "center" },
    // Add more styles as needed
  });

  // Determine platform-specific touchable component
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
      {/* Search bar and filter options */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          marginBottom: 2,
        }}
      >
        {/* Back button */}
        <TouchableOpacity
          style={[styles.centerElement, { width: 50, height: 50 }]}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
        {/* Search input */}
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
              onChangeText={(searchKeyword) => {
                setSearchText(searchKeyword);
              }}
            />
          </View>
        </View>
        {/* Filter button (currently inactive) */}
        <TouchableOpacity
          style={[styles.centerElement, { width: 65, height: 50 }]}
          onPress={() => {}}
        >
          <Text style={{ fontSize: 11, color: "black" }}>
            <AntDesign name="filter" size={22} color="black" />
            Filter
          </Text>
        </TouchableOpacity>
      </View>
      {/* Display search results */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {searchResultsLoading ? (
          <View style={[styles.centerElement, { height: 300 }]}>
            <ActivityIndicator size="large" color="#ef5739" />
          </View>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {/* Map through search results and display event cards */}
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
                    {/* Display event image, title, and starting time */}
                    <Image
                      source={event.image}
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
                      {event.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#ee4e2e",
                        marginBottom: 10,
                      }}
                    >
                      {moment(event.startingTime, "YYYY/MM/DD hh:mm A").format(
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
    </SafeAreaView>
  );
};

export default Search;
