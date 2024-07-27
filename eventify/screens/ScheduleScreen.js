import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook from React Navigation
import { dummyData } from "../constants";
import moment from "moment";
import eventsApi from "../api/events";

const ScheduleScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);
  const fetchEvents = async () => {
    try {
      // Fetch events from the API
      const eventsData = await eventsApi.getEvents();

      // Set the fetched events in state
      setEvents(
        eventsData.data.map((event) => ({
          ...event,
          date: moment(event.startingTime).format("YYYY-MM-DD"), // Extracting date in YYYY-MM-DD format
        }))
      );
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Format events data for Agenda component
  const formattedEvents = events.reduce((acc, event) => {
    const date = event.date;
    if (acc[date]) {
      acc[date].push(event);
    } else {
      acc[date] = [event];
    }
    return acc;
  }, {});

  const handleEventPress = (event) => {
    navigation.navigate("EventDetail", { selectedEvent: event });
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={formattedEvents}
        renderItem={(item, firstItemInDay) => {
          return (
            <TouchableOpacity
              style={styles.eventContainer}
              key={item.id}
              onPress={() => handleEventPress(item)}
            >
              <Text style={styles.eventTitle}>{item.name}</Text>
              <Text style={styles.eventTime}>
                STARTING{" "}
                {moment(item.startingTime, "YYYY/MM/DD hh:mm A").format(
                  "hh:mm A"
                )}
              </Text>
              <Text style={styles.eventTime}>Event type: {item.category}</Text>
            </TouchableOpacity>
          );
        }}
        style={{ backgroundColor: "transparent" }}
        theme={{
          calendarBackground: "black",
          reservationsBackgroundColor: "#000",
        }}
        renderEmptyDate={() => {
          return (
            <View style={styles.emptyDateContainer}>
              <Text style={styles.emptyDateText}>No events for this day</Text>
            </View>
          );
        }}
        renderEmptyData={() => {
          return (
            <View style={styles.emptyDateContainer}>
              <Text style={styles.emptyDateText}>No events for this day</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  eventTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  eventTime: {
    color: "gray",
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  emptyDateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyDateText: {
    color: "#fff",
    fontSize: 20,
  },
});

export default ScheduleScreen;
