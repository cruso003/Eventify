/**
 * React Native Event Booking App UI - Featured Screnn
 * -> The screen can be seperated 4 sections
 *
 * TODO:
 * [X] Build the header section
 * [X] Build the search section (TextInput)
 * [X] Build the FEATURED section (Flatlist)
 * [X] Build the FOR YOU section
 */
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
  ImageBackground,
  TouchableOpacity,
  Text,
} from "react-native";
import styled from "styled-components/native";
import { dummyData, SIZES, COLORS, icons } from "../constants";
import { McIcon, McText } from "../components";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useCart } from "../components/context/CartContext";
import colors from "../config/colors";
import eventsApi from "../api/events";

const FeaturedScreen = ({ navigation }) => {
  const cartMain = useCart();
  const cart = cartMain.cart;
  const [cartLength, setCartLength] = useState(0);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (cart) {
      // Update cart length when the cart changes
      setCartLength(cart.length);
    }
    // Fetch real events from your API
    fetchEvents();
  }, [cart]);

  const fetchEvents = async () => {
    try {
      // Fetch events from the API
      const eventsData = await eventsApi.getEvents();

      // Set the fetched events in state
      setEvents(eventsData.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("EventDetail", { selectedEvent: item });
        }}
      >
        <View
          style={{
            marginLeft: index === 0 ? 30 : 20,
            marginRight: index === events.length - 1 ? 30 : 0,
          }}
        >
          <ImageBackground
            source={{ uri: item.imageUrl }}
            resizeMode="cover"
            borderRadius={20}
            style={{
              width: SIZES.width / 2 + 70,
              height: SIZES.width / 2 + 70,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                alignItems: "flex-end",
                marginHorizontal: 15,
                marginVertical: 15,
              }}
            >
              <DateBox>
                <McText
                  body5
                  color={COLORS.black}
                  style={{ opacity: 0.5, letterSpacing: 2 }}
                >
                  {moment(item.startingTime).format("MMM").toUpperCase()}
                </McText>
                <McText body5 color={COLORS.black}>
                  {moment(item.startingTime).format("DD")}
                </McText>
              </DateBox>
            </View>
            <View
              style={{
                marginLeft: 20,
                marginBottom: 25,
              }}
            >
              <McText body5 style={{ opacity: 0.5 }}>
                {item.category}
              </McText>
              <McText h2>{item.name}</McText>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*Header Section */}
      <SectionHeader>
        <View>
          <McText body5 style={{ opacity: 0.5 }}>
            April 20, 9:06 PM
          </McText>
          <McText h1>Explore Events</McText>
        </View>
        <TouchableOpacity
          style={[styles.centerElement, { width: 50, height: 50 }]}
          onPress={() => navigation.navigate("Cart")}
        >
          <MaterialIcons name="shopping-cart-checkout" size={28} color="#fff" />
          <View
            style={[
              styles.centerElement,
              {
                width: 18,
                height: 18,
                position: "absolute",
                right: 5,
                top: 5,
                backgroundColor:
                  cart && cart.length > 0 ? colors.secondary : "transparent",
                borderRadius: 9,
              },
            ]}
          >
            {cart && cartLength > 0 && (
              <Text style={{ fontSize: 10, color: "white" }}>{cartLength}</Text>
            )}
          </View>
        </TouchableOpacity>
      </SectionHeader>
      {/*Search Section*/}
      <SearchSection>
        <SearchView>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("Search")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#ffffff",
                height: 45,
                borderWidth: 1,
                borderColor: "#cccccc",
                borderRadius: 4,
                width: "100%",
              }}
            >
              <MaterialCommunityIcons
                name="store-search"
                size={20}
                color="#000000"
                style={{
                  marginHorizontal: 10,
                }}
              />
              <Text
                style={{
                  backgroundColor: "#fff",
                  color: "#ccc",
                }}
              >
                Search Events
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </SearchView>
      </SearchSection>
      {/*Featured*/}
      <SectionTitle>
        <McText h5>FEATURED</McText>
      </SectionTitle>
      <View>
        <FlatList
          horizontal
          contentContainerStyled={{}}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => "event_" + item._id} // Assuming _id is unique for each event
          data={events} // Use the real event data fetched from the API
          renderItem={_renderItem}
        ></FlatList>
      </View>
      {/*FOR YOU*/}
      <SectionTitle>
        <McText h5>FOR YOU</McText>
      </SectionTitle>
      <LinearGradient
        colors={COLORS.linear}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: 120,
          marginHorizontal: 30,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GiftBox>
            <McIcon source={icons.gift} size={24} />
          </GiftBox>
          <View style={{ marginLeft: 22 }}>
            <McText h3>Claim 1 free Ticket</McText>
            <McText body4 style={{ width: 180 }}>
              Share an event to Friends and get 1 ticket free
            </McText>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px ${SIZES.padding};
`;

const SearchSection = styled.View`
  margin: 4px ${SIZES.padding};
  height: 50px;
  background-color: ${COLORS.input};
  border-radius: 15px;
  justify-content: center;
`;

const SearchView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.View`
  margin: 20px ${SIZES.padding};
`;

const DateBox = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background-color: ${COLORS.white};
  justify-content: center;
  align-items: center;
`;

const GiftBox = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background-color: ${COLORS.white};
  justify-content: center;
  align-items: center;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  centerElement: { justifyContent: "center", alignItems: "center" },
});

export default FeaturedScreen;
