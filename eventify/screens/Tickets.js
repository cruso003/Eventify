import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
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

  useEffect(() => {
    const getData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser._id);
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    getData();
  }, [userId]);

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      if (userId) {
        // Fetch user orders from the API
        const orderData = await ordersApi.userOrders(userId);

        // Set the fetched orders in state
        setOrders(orderData.data);

        console.log(orders);

        // Extract event and ticket IDs from orders
        const eventAndTicketIds = orders.reduce((acc, order) => {
          order.tickets.forEach((ticket) => {
            acc.push({
              eventId: ticket.event,
              ticketId: ticket.ticketId,
            });
          });
          return acc;
        }, []);

        console.log(eventAndTicketIds);

        // Now you have an array containing objects with eventId and ticketId
        // You can use these IDs to fetch their corresponding data
        // For example:
        eventAndTicketIds.forEach(async ({ eventId }) => {
          const eventData = (await events.getEventById(eventId)).data;

          console.log(eventData);
          //   const ticketData = await fetchTicketData(ticketId);
        });
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserTickets();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tickets</Text>
      </View>
      <ScrollView style={styles.ticketContainer}>
        {dummyData.Events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.ticket}
            onPress={() => navigation.navigate("EventDetail", { event })}
          >
            <ImageBackground source={event.image} style={styles.ticketBGImage}>
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
            <LinearGradient colors={COLORS.linear} style={styles.ticketFooter}>
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
                  <McText>{event.title}</McText>
                  <McText>{event.type}</McText>
                  <McText>
                    {moment(event.startingTime, "YYYY/MM/DD hh:mm A").format(
                      "MMM"
                    )}{" "}
                    {moment(event.startingTime, "YYYY/MM/DD hh:mm A").format(
                      "DD"
                    )}
                  </McText>
                  <McText>{event.startingTime}</McText>
                </View>
              </View>
              <QRCode value={event.qrCode} size={100} />
            </LinearGradient>
          </TouchableOpacity>
        ))}
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
});

export default TicketScreen;
