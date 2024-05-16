import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera/next";
import QRCode from "react-native-qrcode-svg";
import CustomButton from "./forms/CustomButton";
import ordersApi from "../api/orders";
import usersApi from "../api/users";
import eventsApi from "../api/events";
import { useFocusEffect } from "@react-navigation/native";

export default function QRScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [eventAndTicketIds, setEventAndTicketIds] = useState([]);
  const [attendee, setAttendee] = useState([]);
  const [organizer, setOrganizer] = useState([]);
  const [ticketData, setTicketData] = useState([]);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setData(data);

    // Fetch order info using the qrIdentifier
    try {
      const orderData = (await ordersApi.getOrderbyQRIdentifier(data)).data;
      setOrders(orderData);
      console.log(orderData);
    } catch (error) {
      console.error("Error fetching order info:", error);
    }
  };

  const fetchUserTickets = async () => {
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

      eventsData.map((event) => {
        const ticketId = eventAndTicketIds.find(
          (item) => item.eventId === event._id
        )?.ticketId;
        const ticket = event.tickets.find((ticket) => ticket._id === ticketId);
        setTicketData(ticket);
      });

      setEventAndTicketIds(eventAndTicketIdsTemp);

      const promises = eventAndTicketIdsTemp.map(async ({ eventId }) => {
        return (await eventsApi.getEventById(eventId)).data;
      });

      const eventData = await Promise.all(promises);
      setEventsData(eventData);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    const userId = orderData.user;
    try {
      const user = (await usersApi.getUserById(userId)).data;
      setAttendee(user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchOwner = async () => {
    const ownerId = orderData.owner;
    try {
      const owner = (await usersApi.getUserById(ownerId)).data;
      setOrganizer(owner);
    } catch (error) {
      console.error("Error fetching owner:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserTickets();
      fetchUser();
      fetchOwner();
    }, [orders])
  );

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {scanned ? (
        <View>
          <QRCode value={data} size={200} />
          <CustomButton
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
          />
        </View>
      ) : (
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
