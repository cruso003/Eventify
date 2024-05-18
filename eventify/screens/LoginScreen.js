import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../config/colors";
import userApi from "../api/users";
import { FontAwesome, Foundation, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const credentials = {
        email,
        password,
      };

      const response = await userApi.loginUser(credentials);

      if (response.data.success) {
        // Handle successful login
        const data = response.data.user;
        AsyncStorage.setItem("userData", JSON.stringify(data));
        AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));

        // Check if user has selected their interests
        const hasSelectedInterests =
          data.selectedInterests && data.selectedInterests.length > 0;

        if (hasSelectedInterests) {
          navigation.navigate("FeaturedScreen");
        } else {
          navigation.navigate("CategorySelectionScreen");
        }
      } else {
        // Handle unsuccessful login (incorrect email or password)
        Toast.show({
          type: "error",
          text1: response.data.message
            ? response.data.message
            : "Something went wrong",
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
      Toast.show({
        type: "error",
        text1:
          error.response?.data?.message || "An error occurred during login",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/tick-8-high-resolution-logo-transparent.png")}
      />
      <Text style={styles.tagline}>Login</Text>
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="alternate-email"
          size={22}
          color="black"
          style={{ marginRight: 5 }}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{ fontSize: 17, flex: 1 }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View>
        <View style={styles.inputContainer}>
          <Foundation
            name="lock"
            size={22}
            color="black"
            style={{ marginRight: 5 }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={{ fontSize: 17, flex: 1 }}
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={{ color: colors.secondary, fontWeight: "700" }}>
              Forgot?
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => setVisible(!visible)}
          style={{ marginLeft: 25 }}
        >
          {visible ? (
            <FontAwesome name="eye" size={20} color="white" />
          ) : (
            <FontAwesome name="eye-slash" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        {loading ? (
          <View style={[styles.centerElement, { height: 10 }]}>
            <ActivityIndicator size="small" color="#ef5739" />
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
        <Text style={{ color: colors.white }}>Don't have Account?</Text>
        <TouchableOpacity
          onPress={() => {
            // Navigate to the subcategory and products screen
            navigation.navigate("Register");
          }}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    marginTop: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: "80%",
    borderRadius: 10,
    marginLeft: 18,
    alignItems: "center",
  },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "80%",
    marginLeft: 18,
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: colors.white,
    marginTop: 5,
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: colors.secondary,
    fontWeight: "700",
    fontSize: 16,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  tagline: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "600",
    padding: 10,
    alignSelf: "flex-start",
    marginLeft: 18,
  },
});
