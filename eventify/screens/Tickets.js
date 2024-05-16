import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { COLORS, dummyData } from "../constants";
import { McText } from "../components";
import QRCode from "react-native-qrcode-svg";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import ordersApi from "../api/orders";
import AsyncStorage from "@react-native-async-storage/async-storage";
import events from "../api/events";

const TicketScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [eventAndTicketIds, setEventAndTicketIds] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser._id);
        const orderData = await ordersApi.userOrders(parsedUser._id);
        setOrders(orderData.data);
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const fetchUserTickets = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const eventAndTicketIdsTemp = orders.reduce((acc, order) => {
        order.tickets.forEach((ticket) => {
          acc.push({
            eventId: ticket.event,
            ticketId: ticket.ticketId,
          });
        });
        return acc;
      }, []);

      setEventAndTicketIds(eventAndTicketIdsTemp); // set the eventAndTicketIds state here

      const promises = eventAndTicketIdsTemp.map(async ({ eventId }) => {
        return (await events.getEventById(eventId)).data;
      });

      const eventData = await Promise.all(promises);
      setEventsData(eventData);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserTickets();
    }, [userId, orders])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tickets</Text>
      </View>
      <ScrollView style={styles.ticketContainer}>
        {loading ? (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="large" color={COLORS.white} />
          </View>
        ) : eventsData.length > 0 ? (
          eventsData.map((event) => {
            const ticketId = eventAndTicketIds.find(
              (item) => item.eventId === event._id
            )?.ticketId;
            const ticket = event.tickets.find(
              (ticket) => ticket._id === ticketId
            );
            const qrIdentifier = ticket?.qrIdentifier;
            return (
              <TouchableOpacity
                key={event._id}
                style={styles.ticket}
                onPress={() => {
                  navigation.navigate("EventDetail", { selectedEvent: event });
                }}
              >
                <ImageBackground
                  source={{ uri: event.imageUrl }}
                  style={styles.ticketBGImage}
                >
                  <LinearGradient
                    colors={COLORS.linear}
                    style={styles.linearGradient}
                  >
                    <View
                      style={[
                        styles.blackCircle,
                        { position: "absolute", bottom: -40, left: -40 },
                      ]}
                    />
                    <View
                      style={[
                        styles.blackCircle,
                        { position: "absolute", bottom: -40, right: -40 },
                      ]}
                    />
                  </LinearGradient>
                </ImageBackground>
                <LinearGradient
                  colors={COLORS.linear}
                  style={styles.ticketFooter}
                >
                  <View
                    style={[
                      styles.blackCircle,
                      { position: "absolute", top: -40, left: -40 },
                    ]}
                  />
                  <View
                    style={[
                      styles.blackCircle,
                      { position: "absolute", top: -40, right: -40 },
                    ]}
                  />
                  <View style={styles.ticketDateContainer}>
                    <View style={styles.ticketDetails}>
                      <McText>{event.name}</McText>
                      <McText>{event.category}</McText>
                      <McText>
                        {moment(event.startingTime).format("MMM")}{" "}
                        {moment(event.startingTime).format("DD")}
                      </McText>
                      <McText>
                        {moment(event.startingTime).format("hh:mm A")}
                      </McText>
                    </View>
                  </View>
                  <QRCode value={qrIdentifier} size={100} />
                </LinearGradient>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsText}>
              Oops! You dont have any tickets yet.
            </Text>
            <TouchableOpacity
              style={styles.noEventsButton}
              onPress={() => {
                navigation.navigate("Featured");
              }}
            >
              <Text style={styles.noEventsButtonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ paddingBottom: 150 }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  ticketContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  ticket: {
    marginBottom: 20,
  },
  ticketBGImage: {
    alignSelf: "center",
    width: 200,
    aspectRatio: 200 / 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  linearGradient: {
    height: "20%",
  },
  ticketFooter: {
    width: 200,
    alignItems: "center",
    paddingBottom: 36,
    alignSelf: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  ticketDateContainer: {
    flexDirection: "row",
    gap: 36,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  ticketDetails: {
    alignItems: "center",
  },
  blackCircle: {
    height: 80,
    width: 80,
    borderRadius: 80,
    backgroundColor: COLORS.black,
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noEventsText: {
    fontSize: 18,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 20,
  },
  noEventsButton: {
    //backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: "gray",
    borderWidth: 1,
  },
  noEventsButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
});

export default TicketScreen;
