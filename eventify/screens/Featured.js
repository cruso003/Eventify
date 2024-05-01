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
import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../constants";
import { McIcon, McText } from "../components";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const FeaturedScreen = ({ navigation }) => {
  const handleAccountNavigation = () => {
    navigation.navigate("Account");
  };
  // const { user } = useAuth();
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
            marginRight: index === dummyData.Events.length - 1 ? 30 : 0,
          }}
        >
          <ImageBackground
            source={item.image}
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
                  {moment(item.startingTime, "YYYY/MM/DD hh:mm A")
                    .format("MMM")
                    .toUpperCase()}
                </McText>
                <McText body5 color={COLORS.black}>
                  {moment(item.startingTime, "YYYY/MM/DD hh:mm A").format("DD")}
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
                {item.type}
              </McText>
              <McText h2>{item.title}</McText>
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
        <TouchableOpacity onPress={handleAccountNavigation}>
          <Ionicons name="person-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      </SectionHeader>
      {/*Search Section*/}
      <SearchSection>
        <SearchView>
          <McIcon source={icons.search} size={24} />
          <TextInput
            placeholder="Search for Events"
            placeholderTextColor={COLORS.gray1}
            style={{
              //...FONTS.h4,
              color: COLORS.white,
              width: 250,
              fontFamily: "ProductSans-Bold",
              fontSize: 16,
              lineHeight: 22,
            }}
          ></TextInput>
          <McIcon source={icons.filter} size={24} />
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
          keyExtractor={(item) => "event_" + item.id}
          data={dummyData.Events}
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
  margin-left: 9px;
  margin-right: 15px;
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
});

export default FeaturedScreen;
