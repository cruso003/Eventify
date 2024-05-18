/**
 * React Native Event Booking App UI - Event Detail Screen
 * -> The screen can be separated into 4 sections and 1 fixed bottom bar
 *
 * TODO:
 * [X] Build the header image background section
 *    [X] Rendering the image background sub section (ImageBackground)
 *    [X] Rendering the header sub section
 *    [X] Rendering the footer sub section (LinearGradient)
 * [X] Build the buttons group section
 * [X] Build the description section
 * [X] Build the location section (google map in dark mode)
 * [X] Build the fixed bottom bar
 */
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Share,
} from "react-native";
import styled from "styled-components/native";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../constants";
import { McAvatar, McIcon, McText } from "../components";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../components/context/CartContext";
import ordersApi from "../api/orders";
import usersApi from "../api/users";

const EventDetail = ({ navigation, route }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [user, setUser] = useState(false);
  const { addToCart, cart } = useCart();
  const [locationName, setLocationName] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedButton, setSelectedButton] = useState("about");
  // const [participants, setParticipants] = useState([]); // Participant section commented out

  const getData = async () => {
    const userData = await AsyncStorage.getItem("userData");
    setUser(JSON.parse(userData));
  };

  const fetchOrders = async () => {
    try {
      const ordersData = await ordersApi.getOrders();
      setOrders(ordersData.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // const fetchParticipants = async () => { // Participant section commented out
  //   try {
  //     // Extract user IDs from orders
  //     const userIds = orders.flatMap((order) => order.user);
  //     console.log(userIds);
  //     // Call the getUsersById API endpoint with the extracted user IDs
  //     const participantsData = await ordersApi.getUsersById(userIds);
  //     console.log(participantsData, "participantData");
  //     setParticipants(participantsData.data);
  //     console.log(participants, "participants");
  //   } catch (error) {
  //     console.error("Error fetching participants:", error);
  //   }
  // };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this event: ${
          selectedEvent.name
        } happening on ${moment(selectedEvent.startingTime).format(
          "MMMM Do YYYY, h:mm a"
        )}.`,
        url: selectedEvent.imageUrl, // Add the URL of the event image here
        title: selectedEvent.name,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("shared with activity type of: ", result.activityType);
        } else {
          console.log("shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("dismissed");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getData();
    fetchOrders();
    // fetchParticipants(); // Participant section commented out
  }, []);

  useEffect(() => {
    const { selectedEvent } = route.params;
    setSelectedEvent(selectedEvent);

    if (selectedEvent) {
      fetchLocationName(
        selectedEvent.location.coordinates[0],
        selectedEvent.location.coordinates[1]
      );

      saveViewedEvent(selectedEvent);
    }
  }, [route.params]);

  const saveViewedEvent = async (event) => {
    try {
      let viewedEvents = await AsyncStorage.getItem("viewedEvents");
      viewedEvents = viewedEvents ? JSON.parse(viewedEvents) : [];

      viewedEvents = [
        event,
        ...viewedEvents.filter((e) => e._id !== event._id),
      ];

      if (viewedEvents.length > 10) {
        viewedEvents = viewedEvents.slice(0, 10);
      }

      await AsyncStorage.setItem("viewedEvents", JSON.stringify(viewedEvents));
    } catch (error) {
      console.error("Error saving viewed event:", error);
    }
  };

  // Function to fetch location name using reverse geocoding
  const fetchLocationName = async (latitude, longitude) => {
    try {
      // Call reverse geocoding API here and set the locationName state
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDS-r_uCCqf3x4ATCTNhF2GGIy9GOwqfwI`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const firstResult = data.results[0];

      setLocationName(
        firstResult ? firstResult.formatted_address : "Location not found"
      );
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("Location not found");
    }
  };

  const handleBuyTicket = (ticket) => {
    // Handle buy ticket logic here
    setSelectedTicket(ticket);
  };

  const isTicketSelected = (ticket) => {
    return selectedTicket === ticket;
  };

  const addEventToCart = async () => {
    // Create the cart item
    const cartItem = {
      user: user,
      event: selectedEvent,
      salePrice: selectedTicket.price,
      ticketName: selectedTicket.name,
      ticketId: selectedTicket._id,
      qty: 1,
      checked: true,
    };

    addToCart(cartItem);
    // Navigate to the cart screen
    navigation.navigate("Cart");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.black }}
        style={{ backgroundColor: COLORS.black }}
      >
        {/* ImageBackground */}
        <ImageBackground
          resizeMode="cover"
          source={
            selectedEvent?.imageUrl ? { uri: selectedEvent.imageUrl } : null
          }
          style={{
            width: "100%",
            height:
              SIZES.height < 700 ? SIZES.height * 0.4 : SIZES.height * 0.5,
          }}
        >
          <View style={{ flex: 1 }}>
            {/* Image Header */}
            <ImageHeaderSection>
              <TouchableOpacity
                style={{
                  width: 56,
                  height: 40,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                }}
                onPress={() => navigation.goBack()}
              >
                <McIcon source={icons.back_arrow} size={24} />
              </TouchableOpacity>
              <View
                style={{
                  width: 96,
                  height: 40,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  borderRadius: 10,
                }}
              >
                {/* <TouchableOpacity onPress={{}}> // Heart icon removed
              <McIcon
                source={icons.like}
                size={24}
                style={{ marginLeft: 16, tintColor: COLORS.white }}
              />
            </TouchableOpacity> */}
                <TouchableOpacity onPress={handleShare}>
                  <McIcon
                    source={icons.share}
                    size={28}
                    style={{
                      //marginLeft: 16,
                      tintColor: COLORS.white,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </ImageHeaderSection>
            {/* Image Footer */}
            <ImageFooterSection>
              <LinearGradient
                colors={["transparent", "#000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: "100%",
                  height: 40,
                  justifyContent: "flex-end",
                }}
              >
                <FooterContentView>
                  <View>
                    <McText body4 style={{ opacity: 0.5, letterSpacing: 2 }}>
                      {selectedEvent?.category}
                    </McText>
                    <McText h1>{selectedEvent?.name}</McText>
                    <McText body5 style={{ opacity: 0.5, letterSpacing: 1.5 }}>
                      STARTING{" "}
                      {moment(
                        selectedEvent?.startingTime,
                        "YYYY/MM/DD hh:mm                         A"
                      ).format("hh:mm A")}
                    </McText>
                  </View>
                  <LinearGradient
                    colors={COLORS.linear}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <McText body4 style={{ letterSpacing: 1 }}>
                      {moment(selectedEvent?.startingTime, "YYYY/MM/DD hh:mm A")
                        .format("MMM")
                        .toUpperCase()}
                    </McText>
                    <McText body4 style={{ letterSpacing: 1 }}>
                      {moment(
                        selectedEvent?.startingTime,
                        "YYYY/MM/DD hh:mm A"
                      ).format("DD")}
                    </McText>
                  </LinearGradient>
                </FooterContentView>
              </LinearGradient>
            </ImageFooterSection>
          </View>
        </ImageBackground>
        {/* buttons group section */}
        <ButtonsGroupSection>
          <TouchableOpacity
            style={{
              width: 76,
              height: 32,
              justifyContent: "center",
              backgroundColor:
                selectedButton === "about" ? COLORS.white : COLORS.gray,
              marginRight: 16,
              alignItems: "center",
              borderRadius: 10,
            }}
            onPress={() => setSelectedButton("about")}
          >
            <McText
              h6
              style={{
                color: selectedButton === "about" ? COLORS.black : COLORS.white,
                letterSpacing: 1,
              }}
            >
              ABOUT
            </McText>
          </TouchableOpacity>
          {/*<TouchableOpacity
            style={{
              width: 124,
              height: 32,
              justifyContent: "center",
              backgroundColor:
                selectedButton === "participants" ? COLORS.white : COLORS.gray,
              alignItems: "center",
              borderRadius: 10,
            }}
            onPress={() => setSelectedButton("participants")}
          >
            <McText
              h6
              style={{
                color:
                  selectedButton === "participants"
                    ? COLORS.black
                    : COLORS.white,
                letterSpacing: 1,
              }}
            >
              PARTICIPANTS
            </McText>
            </TouchableOpacity>*/}
        </ButtonsGroupSection>
        {/* Render description or participants section based on the selected button */}
        {
          selectedButton === "about" ? (
            <DescriptionSection>
              <McText body3>{selectedEvent?.description}</McText>
            </DescriptionSection>
          ) : // <ParticipantsSection> // Participant section commented out
          //   {/* Render participants here */}
          // </ParticipantsSection> // Participant section commented out
          null // Participant section commented out
        }
        {/* LocationSection */}
        <LocationSection>
          <McText h3>LOCATION</McText>
          <View
            style={{
              height: 250,
            }}
          >
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ height: 250, marginTop: 20 }}
              region={{
                latitude: selectedEvent?.location.coordinates[0],
                longitude: selectedEvent?.location.coordinates[1],
                latitudeDelta: 0.005,
                longitudeDelta: 0.005 * (SIZES.width / SIZES.height),
              }}
              customMapStyle={dummyData.MapStyle}
            >
              <Marker
                coordinate={{
                  latitude: selectedEvent?.location.coordinates[0],
                  longitude: selectedEvent?.location.coordinates[1],
                }}
                title={selectedEvent?.name + " - " + selectedEvent?.category}
                description={locationName}
              />
            </MapView>
          </View>
          <View style={{ paddingBottom: 150 }}></View>
        </LocationSection>
      </ScrollView>
      {/* Fixed BottomBar */}
      <BottomBarSection>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 30,
          }}
        >
          {/* Display ticket options */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {selectedEvent?.tickets.map((ticket, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isTicketSelected(ticket)
                    ? COLORS.blue
                    : COLORS.transparentWhite,
                  padding: 6,
                  borderRadius: 15,
                  marginRight: 10,
                }}
                onPress={() => handleBuyTicket(ticket)}
              >
                <View style={{ marginRight: 10 }}>
                  <McText
                    h4
                    style={{
                      color: isTicketSelected(ticket)
                        ? COLORS.white
                        : COLORS.black,
                    }}
                  >
                    {ticket.name}
                  </McText>
                  <McText
                    body3
                    style={{
                      color: isTicketSelected(ticket)
                        ? COLORS.white
                        : COLORS.black,
                    }}
                  >
                    ${ticket.price.toFixed(2)}
                  </McText>
                </View>
                {isTicketSelected(ticket) && (
                  <McIcon
                    source={icons.checked}
                    size={24}
                    style={{ tintColor: COLORS.white }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Buy Ticket button */}
          {!selectedTicket ? (
            <View
              style={{
                width: 173,
                height: 53,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.gray,
              }}
            >
              <McText h4 style={{ color: COLORS.darkGray }}>
                Buy Ticket
              </McText>
            </View>
          ) : (
            <TouchableOpacity
              onPress={addEventToCart}
              style={{ marginLeft: "auto" }}
            >
              <LinearGradient
                colors={COLORS.linear}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 173,
                  height: 53,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <McText h4>Buy Ticket</McText>
                  <McIcon
                    source={icons.buy_ticket}
                    size={24}
                    style={{ marginLeft: 11 }}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </BottomBarSection>
    </View>
  );
};

const ImageHeaderSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${Platform.OS === "ios" ? "40px" : "20px"};
  margin-left: 20px;
  margin-right: 20px;
`;

const ImageFooterSection = styled.View`
  flex: 1;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
`;

const FooterContentView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0px 30px;
`;

const ButtonsGroupSection = styled.View`
  margin: 15px 30px;
  flex-direction: row;
`;

const DescriptionSection = styled.View`
  margin: 0px 30px;
`;

const LocationSection = styled.View`
  margin: 25px 30px;
`;

const ParticipantsSection = styled.View`
  margin: 25px 30px;
  /* Add styles for participants section */
`;

const BottomBarSection = styled.View`
  height: 130px;
  width: ${SIZES.width + "px"};
  border-radius: ${SIZES.radius};
  background-color: ${COLORS.tabBar};
  position: absolute;
  bottom: 0px;
  justify-content: center;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export default EventDetail;
