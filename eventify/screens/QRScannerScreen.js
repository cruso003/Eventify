import React, { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { CameraView, Camera } from "expo-camera/next";
import CustomButton from "./forms/CustomButton";
import ordersApi from "../api/orders";
import usersApi from "../api/users";
import { useFocusEffect } from "@react-navigation/native";

export default function QRScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState({});
  const [attendee, setAttendee] = useState({});
  const [organizer, setOrganizer] = useState({});
  const [loading, setLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);

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
    setCardLoading(true);

    try {
      const orderData = (await ordersApi.getOrderbyQRIdentifier(data)).data;
      setOrders(orderData);
      await fetchUser(orderData.user);
      await fetchOwner(orderData.tickets[0]?.owner);
    } catch (error) {
      console.error("Error fetching order info:", error);
    } finally {
      setCardLoading(false);
    }
  };

  const fetchUser = async (userId) => {
    try {
      const user = (await usersApi.getUserById(userId)).data;

      setAttendee(user.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchOwner = async (ownerId) => {
    try {
      const owner = (await usersApi.getUserById(ownerId)).data;
      setOrganizer(owner.data);
    } catch (error) {
      console.error("Error fetching owner:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      if (orders && orders._id) {
        fetchUser(orders.user);
        fetchOwner(orders.tickets[0]?.owner);
      }
      setLoading(false);
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
          {cardLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : (
            <OrderCard
              orders={orders}
              attendee={attendee}
              organizer={organizer}
            />
          )}
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
const OrderCard = ({ orders, attendee, organizer }) => {
  return (
    <View style={styles.card}>
      <Text>Order ID: {orders._id}</Text>
      <Text>Order Date: {new Date(orders.orderDate).toLocaleDateString()}</Text>
      <Text>Payment Amount: ${orders?.payment?.amount}</Text>
      <View style={{ marginVertical: 5 }}>
        <Text>Ticket(s):</Text>
      </View>
      {orders.tickets?.map((ticket) => (
        <View key={ticket._id} style={styles.ticketCard}>
          <Text>Event Name: {ticket.eventName}</Text>
          <Text>Event Category: {ticket.eventCategory}</Text>
          <Text>Ticket Name: {ticket.ticketName}</Text>
          <Text>Ticket Price: ${ticket.ticketPrice}</Text>
        </View>
      ))}

      {attendee && (
        <View style={styles.attendeeCard}>
          <Text>Attendee Name: {attendee.name}</Text>
          {attendee.sex && <Text>Attendee Sex: {attendee.sex}</Text>}
          {attendee.profession && (
            <Text>Attendee Profession: {attendee.profession}</Text>
          )}
          {attendee.phoneNumber && (
            <Text>Attendee Phone Number: {attendee.phoneNumber}</Text>
          )}
          {attendee.avatar && (
            <Image source={{ uri: attendee.avatar }} style={styles.avatar} />
          )}
        </View>
      )}

      {/* 
      {organizer && (
        <View style={styles.organizerCard}>
          <Text>
            Owner Name: {organizer.businessName ? organizer.businessName : organizer.name}
          </Text>
        </View>
      )} 
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  ticketCard: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  attendeeCard: {
    marginTop: 20,
  },
  organizerCard: {
    marginTop: 20,
  },
});
