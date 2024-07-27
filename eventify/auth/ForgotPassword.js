// ForgotPasswordScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Foundation } from "@expo/vector-icons";
import colors from "../config/colors";
import userApi from "../api/users";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      const response = await userApi.forgotPassword(email);

      if (response.data.success) {
        // Navigate to the OTP verification screen
        navigation.navigate("OtpVerification", { email });
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error during forgot password:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/eventify-high-resolution-logo-transparent.png")}
      />
      <Text style={styles.tagline}>Forgot Password</Text>
      <View style={styles.inputContainer}>
        <Foundation
          name="mail"
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

      <View style={styles.buttonContainer}>
        {loading ? (
          <View style={[styles.centerElement, { height: 300 }]}>
            <ActivityIndicator size="large" color="#ef5739" />
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.button}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  centerElement: { justifyContent: "center", alignItems: "center" },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: "80%",
    borderRadius: 10,
    marginLeft: 18,
    marginBottom: 10,
    alignItems: "center",
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
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 24,
    fontWeight: "600",
    padding: 10,
    alignSelf: "flex-start",
    marginLeft: 18,
  },
};

export default ForgotPassword;
