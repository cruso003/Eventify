import React from "react";
import { View } from "react-native";
import { Tab } from "./NavigatorConfig";
import { McIcon, McText } from "../components";
import FeaturedScreen from "../screens/Featured";
import ScheduleScreen from "../screens/Schedule";
import TicketsScreen from "../screens/Tickets";
import AccountScreen from "../screens/Account";
import { COLORS, icons } from "../constants";

const TabIcon = ({ focused, icon }) => (
  <View style={{ alignItems: "center", justifyContent: "center" }}>
    <McIcon
      size={focused ? 24 : 32}
      source={icon}
      resizeMode="contain"
      style={{ tintColor: focused ? COLORS.white : COLORS.gray }}
    />
  </View>
);

const TabLabel = ({ focused, text }) =>
  focused ? (
    <McText h4 style={{ marginTop: -25, paddingBottom: 10 }}>
      {text}
    </McText>
  ) : (
    <View />
  );

const FeaturedTabScreen = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        backgroundColor: COLORS.tabBar,
        borderTopColor: "transparent",
        height: 80,
        borderRadius: 20,
      },
    }}
  >
    <Tab.Screen
      name="Featured"
      component={FeaturedScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={icons.tab_1} />
        ),
        tabBarLabel: ({ focused }) => (
          <TabLabel focused={focused} text="Featured" />
        ),
      }}
    />
    <Tab.Screen
      name="Schedule"
      component={ScheduleScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={icons.tab_2} />
        ),
        tabBarLabel: ({ focused }) => (
          <TabLabel focused={focused} text="Schedule" />
        ),
      }}
    />
    <Tab.Screen
      name="Tickets"
      component={TicketsScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={icons.tab_3} />
        ),
        tabBarLabel: ({ focused }) => (
          <TabLabel focused={focused} text="Tickets" />
        ),
      }}
    />
    <Tab.Screen
      name="Account"
      component={AccountScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={icons.tab_4} />
        ),
        tabBarLabel: ({ focused }) => (
          <TabLabel focused={focused} text="Account" />
        ),
      }}
    />
  </Tab.Navigator>
);

export default FeaturedTabScreen;
