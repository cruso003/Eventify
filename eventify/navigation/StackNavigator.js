import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { ActivityIndicator } from "react-native";
import { Stack } from "./NavigatorConfig";
import { StripeProvider } from "@stripe/stripe-react-native";
import { PaperProvider } from "react-native-paper";
import { CartProvider } from "../components/context/CartContext";
import FeaturedTabScreen from "./TabNavigator";
import CategorySelectionScreen from "../screens/CategorySelectionScreen";
import CartPage from "../screens/Cart";
import CheckoutScreen from "../screens/Checkout";
import EventDetail from "../screens/EventDetail";
import LoginNavigator from "./LoginNavigator";
import Search from "../screens/Search";
import { customFonts } from "../constants/fonts";

const STRIPE_KEY =
  "pk_test_51KDsVdHjllFf5pa1Ir48dU2N3rquvHyMJyL6dT86biDxww7ko7WW9k9FGPHng97PnqSW3PQ83hoIaiisOBIN5ODp001LF3F78E";

const StackNavigator = () => {
  const [assetsLoaded, setAssetLoaded] = useState(false);

  const loadAssetsAsync = async () => {
    await Font.loadAsync(customFonts);
    setAssetLoaded(true);
  };

  useEffect(() => {
    loadAssetsAsync();
  }, []);

  if (!assetsLoaded) {
    return <ActivityIndicator size="small" />;
  }

  return (
    <CartProvider>
      <StripeProvider publishableKey={STRIPE_KEY}>
        <PaperProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="FeaturedScreen" component={FeaturedTabScreen} />
            <Stack.Screen
              name="CategorySelectionScreen"
              component={CategorySelectionScreen}
            />
            <Stack.Screen name="Cart" component={CartPage} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="EventDetail" component={EventDetail} />
            <Stack.Screen name="LoginUser" component={LoginNavigator} />
            <Stack.Screen name="Search" component={Search} />
          </Stack.Navigator>
        </PaperProvider>
      </StripeProvider>
    </CartProvider>
  );
};

export default StackNavigator;
