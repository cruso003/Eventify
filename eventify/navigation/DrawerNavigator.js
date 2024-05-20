import React from "react";
import { Drawer } from "./NavigatorConfig";
import DrawerContent from "../DrawerContent";
import AddEvent from "../screens/EventsUploads/AddEvent";
import QRScannerScreen from "../screens/QRScannerScreen";
import TicketsScreen from "../screens/Tickets";
import WalletScreen from "../screens/WalletScreen";
import AddEventTypes from "../screens/EventsTypes/AddEventTypes";
import AddEventCategory from "../screens/EventCategory/AddCategory";
import ContactUs from "../screens/ContactUs";
import StackNavigator from "./StackNavigator"; // Ensure this does not create a cycle

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="FeaturedDrawerScreen" component={StackNavigator} />
      <Drawer.Screen name="Add-Event" component={AddEvent} />
      <Drawer.Screen name="QRScanner" component={QRScannerScreen} />
      <Drawer.Screen name="Tickets" component={TicketsScreen} />
      <Drawer.Screen name="Wallet" component={WalletScreen} />
      <Drawer.Screen name="Add-EventTypes" component={AddEventTypes} />
      <Drawer.Screen name="Add-Category" component={AddEventCategory} />
      <Drawer.Screen name="ContactUs" component={ContactUs} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
