import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { View, ActivityIndicator, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StripeProvider } from "@stripe/stripe-react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperProvider } from "react-native-paper";
import * as Linking from "expo-linking";

import {EventDetail,FeatureScreen,ScheduleScreen,TicketsScreen,AccountScreen,UpdateProfile,CheckoutScreen,CartPage,Search,WalletScreen,QRScannerScreen,ContactUs,CategorySelectionScreen} from "./screens";
import {LoginScreen,RegisterScreen,OtpVerification,ForgotPassword,OrganizerRegistration} from "./auth"
import { COLORS, customFonts, icons } from "./constants";
import { McIcon, McText } from "./components";
import { CartProvider } from "./components/context/CartContext";
import DrawerContent from "./DrawerContent";


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const STRIPE_KEY =
  "pk_test_51KDsVdHjllFf5pa1Ir48dU2N3rquvHyMJyL6dT86biDxww7ko7WW9k9FGPHng97PnqSW3PQ83hoIaiisOBIN5ODp001LF3F78E";

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "green",
        borderLeftWidth: 7,
        width: "90%",
        height: 70,
        borderRightColor: "green",
        borderRightWidth: 7,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: "700",
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text2NumberOfLines={3}
      style={{
        borderLeftColor: "red",
        borderLeftWidth: 7,
        width: "90%",
        height: 70,
        borderRightColor: "red",
        borderRightWidth: 7,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: "700",
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
};


const TabIcon = ({ focused, icon }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <McIcon
        size={focused ? 24 : 32}
        source={icon}
        resizeMode="contain"
        style={{
          tintColor: focused ? COLORS.white : COLORS.gray,
        }}
      />
    </View>
  );
};
const TabLabel = ({ focused, text }) => {
  return focused ? (
    <McText
      h4
      style={{
        marginTop: -25,
        paddingBottom: 10,
      }}
    >
      {text}
    </McText>
  ) : (
    <View />
  );
};

const LoginNavigator = () => {
  const [assetsLoaded, setAssetLoaded] = useState(false);
  /* Loading custom fonts in async */
  const _loadAssetsAsync = async () => {
    await Font.loadAsync(customFonts);
    setAssetLoaded(true);
  };

  useEffect(() => {
    _loadAssetsAsync();
  }, []);

  return assetsLoaded ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen
        name="registerOrganizer"
        component={OrganizerRegistration}
      />
      <Stack.Screen
        name="CategorySelectionScreen"
        component={CategorySelectionScreen}
      />
      <Stack.Screen name="FeaturedScreen" component={DrawerNavigator} />
    </Stack.Navigator>
  ) : (
    <ActivityIndicator size="small"></ActivityIndicator>
  );
};

const DrawerNavigator = () => {
  return (
    <CartProvider>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Drawer.Screen name="FeaturedDrawerScreen" component={StackNavigator} />
        <Drawer.Screen name="QRScanner" component={QRScannerScreen} />
        <Drawer.Screen name="Tickets" component={TicketsScreen} />
        <Drawer.Screen name="Wallet" component={WalletScreen} />
        <Drawer.Screen name="ContactUs" component={ContactUs} />
      </Drawer.Navigator>
    </CartProvider>
  );
};

function FeaturedTabScreen() {
  return (
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
        component={FeatureScreen}
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
}

const StackNavigator = () => {
  const [assetsLoaded, setAssetLoaded] = useState(false);
  /* Loading custom fonts in async */
  const _loadAssetsAsync = async () => {
    await Font.loadAsync(customFonts);
    setAssetLoaded(true);
  };

  useEffect(() => {
    _loadAssetsAsync();
  }, []);

  return assetsLoaded ? (
    <CartProvider>
      <StripeProvider publishableKey={STRIPE_KEY}>
        <PaperProvider>
          <Stack.Navigator>
            {/*Featured Stack*/}
            <Stack.Group screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="FeaturedScreen"
                component={FeaturedTabScreen}
              />
              <Stack.Screen
                name="CategorySelectionScreen"
                component={CategorySelectionScreen}
              />
              <Stack.Screen name="Cart" component={CartPage} />
              <Stack.Screen name="Checkout" component={CheckoutScreen} />
              <Stack.Screen name="EventDetail" component={EventDetail} />
              <Stack.Screen name="LoginUser" component={LoginNavigator} />
              <Stack.Screen name="Search" component={Search} />
            </Stack.Group>
            {/*Schedule Stack*/}
            <Stack.Group screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Schedule" component={ScheduleScreen} />
            </Stack.Group>
            {/*Tickets Stack*/}
            <Stack.Group screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Tickets" component={TicketsScreen} />
            </Stack.Group>
            {/*Account Stack*/}
            <Stack.Group screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Account" component={AccountScreen} />
              <Stack.Screen
                name="UpdateProfile"
                component={UpdateProfile}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Group>
          </Stack.Navigator>
        </PaperProvider>
      </StripeProvider>
    </CartProvider>
  ) : (
    <ActivityIndicator size="small"></ActivityIndicator>
  );
};

const prefix = Linking.createURL("/");
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        LoginNavigator: "login",
        DrawerNavigator: "featured",
      },
    },
  };

  async function getData() {
    const data = await AsyncStorage.getItem("isLoggedIn");
    const userData = await AsyncStorage.getItem("userData");

    setIsLoggedIn(JSON.parse(data));
    setUser(JSON.parse(userData));
  }

  useEffect(() => {
    getData();
  }, [isLoggedIn]);

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <NavigationContainer linking={linking}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        {isLoggedIn ? <DrawerNavigator /> : <LoginNavigator />}
        <Toast config={toastConfig} />
      </NavigationContainer>
    </View>
  );
}

export default App;
