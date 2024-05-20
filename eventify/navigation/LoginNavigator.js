import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { ActivityIndicator } from "react-native";
import { Stack } from "./NavigatorConfig";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPassword from "../screens/ForgotPassword";
import OtpVerification from "../auth/otpVerification";
import OrganizerRegistration from "../screens/OrganizerRegistration";
import DrawerNavigator from "./DrawerNavigator";
import { customFonts } from "../constants/fonts";

const LoginNavigator = () => {
  const [assetsLoaded, setAssetLoaded] = useState(false);

  const _loadAssetsAsync = async () => {
    await Font.loadAsync(customFonts);
    setAssetLoaded(true);
  };

  useEffect(() => {
    _loadAssetsAsync();
  }, []);

  return assetsLoaded ? (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen
        name="registerOrganizer"
        component={OrganizerRegistration}
      />
      <Stack.Screen name="FeaturedScreen" component={DrawerNavigator} />
    </Stack.Navigator>
  ) : (
    <ActivityIndicator size="small" />
  );
};

export default LoginNavigator;
