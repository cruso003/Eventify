import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import { McText } from "../../components";

const TicketCard = ({ event }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.ticket}
      onPress={() => navigation.navigate("EventDetail", { event })}
    >
      <LinearGradient
        colors={["#232323", "#121212"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Image source={event.image} style={styles.eventImage} />
        <View style={styles.ticketDetails}>
          <McText h3 style={styles.title}>
            {event.title}
          </McText>
          <McText style={styles.subtitle}>{event.type}</McText>
          <McText style={styles.subtitle}>{event.startingTime}</McText>
          <QRCode value={event.qrCode} size={100} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ticket: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  ticketDetails: {
    flex: 1,
  },
  title: {
    color: "#FFF",
  },
  subtitle: {
    color: "#BBB",
    marginTop: 5,
  },
});

export default TicketCard;
