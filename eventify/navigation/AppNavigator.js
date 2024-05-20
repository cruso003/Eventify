import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";
import LoginNavigator from "./LoginNavigator";

const Stack = createNativeStackNavigator();

const AppNavigator = ({ isLoggedIn }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      ) : (
        <Stack.Screen name="LoginNavigator" component={LoginNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
