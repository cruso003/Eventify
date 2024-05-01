/**
 * React Native Event Booking App UI - Event Detail Screnn
 * -> The screen can be seperated 4 sections and 1 fixed bottom bar
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
} from "react-native";
import styled from "styled-components/native";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../constants";
import { McAvatar, McIcon, McText } from "../components";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const EventDetail = ({ navigation, route }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    let { selectedEvent } = route.params;
    setSelectedEvent(selectedEvent);
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.black }}
        style={{ backgroundColor: COLORS.black }}
      >
        {/*ImageBackground*/}
        <ImageBackground
          resizeMode="cover"
          source={selectedEvent?.image}
          style={{
            width: "100%",
            height:
              SIZES.height < 700 ? SIZES.height * 0.4 : SIZES.height * 0.5,
          }}
        >
          <View style={{ flex: 1 }}>
            {/*Image Header*/}
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
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  borderRadius: 10,
                }}
              >
                <TouchableOpacity onPress={{}}>
                  <McIcon
                    source={icons.like}
                    size={24}
                    style={{ marginLeft: 16, tintColor: COLORS.white }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={{}}>
                  <McIcon
                    source={icons.share}
                    size={24}
                    style={{ marginRight: 16, tintColor: COLORS.white }}
                  />
                </TouchableOpacity>
              </View>
            </ImageHeaderSection>
            {/*Image Footer*/}
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
                      {selectedEvent?.type}
                    </McText>
                    <McText h1>{selectedEvent?.title}</McText>
                    <McText body5 style={{ opacity: 0.5, letterSpacing: 1.5 }}>
                      STARTING{" "}
                      {moment(
                        selectedEvent?.startingTime,
                        "YYYY/MM/DD hh:mm A"
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
        {/*buttons group section*/}
        <ButtonsGroupSection>
          <TouchableOpacity
            style={{
              width: 76,
              height: 32,
              justifyContent: "center",
              backgroundColor: COLORS.white,
              marginRight: 16,
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <McText h6 style={{ color: COLORS.black, letterSpacing: 1 }}>
              ABOUT
            </McText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 124,
              height: 32,
              justifyContent: "center",
              backgroundColor: COLORS.input,
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <McText h6 style={{ opacity: 0.5, letterSpacing: 1 }}>
              PARTICIPANTS
            </McText>
          </TouchableOpacity>
        </ButtonsGroupSection>
        {/*DescriptionSection*/}
        <DescriptionSection>
          <McText body3>{selectedEvent?.description}</McText>
        </DescriptionSection>
        {/*LocationSection*/}
        <LocationSection>
          <McText h3>LOCATION</McText>
          <View
            style={{
              height: 250,
            }}
          >
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{
                height: 250,
                marginTop: 20,
              }}
              minZoomLevel={15}
              initialRegion={dummyData.Region}
              customMapStyle={dummyData.MapStyle}
            ></MapView>
          </View>
          <View style={{ paddingBottom: 150 }}></View>
        </LocationSection>
      </ScrollView>
      {/*Fixed BottomBar*/}
      <BottomBarSection>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 30,
          }}
        >
          <View>
            <McText body3 style={{ opacity: 0.5, letterSpacing: 1 }}>
              PRICE
            </McText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <McText h2>$5.00</McText>
              <McText h3>/Person</McText>
            </View>
          </View>
          <TouchableOpacity>
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
