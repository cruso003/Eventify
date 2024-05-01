// OtpVerification.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import userApi from "../api/users";
import colors from "../config/colors";
import { FontAwesome } from "@expo/vector-icons";

const OtpVerification = ({ route, navigation }) => {
  const { email } = route.params;
  const [securityCode, setSecurityCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleVerifyOtp = async () => {
    try {
      // Check if passwords match
      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      const response = await userApi.verifyOtpAndResetPassword(
        email,
        securityCode,
        newPassword
      );
      if (response.data.success) {
        Alert.alert(
          "Success",
          "Password reset successfully",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error during OTP verification:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await userApi.resendSecurityCode(email);

      if (response.data.success) {
        Alert.alert(
          "Success",
          "New security code sent successfully",
          [{ text: "OK" }],
          { cancelable: false }
        );
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error during resend security code:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP and Reset Password</Text>
      <View style={styles.content}>
        <TextInput
          placeholder="Security Code"
          style={styles.input}
          value={securityCode}
          onChangeText={(text) => setSecurityCode(text)}
        />
        <TextInput
          placeholder="New Password"
          style={styles.input}
          value={newPassword}
          secureTextEntry={!visible}
          onChangeText={(text) => setNewPassword(text)}
        />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!visible}
          style={styles.input}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TouchableOpacity onPress={() => setVisible(!visible)}>
          {visible ? (
            <FontAwesome name="eye" size={20} color="white" />
          ) : (
            <FontAwesome name="eye-slash" size={20} color="white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleVerifyOtp} style={styles.button}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResendCode}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonText}>Resend Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  content: {
    marginHorizontal: 15,
    padding: 25,
    color: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginTop: 150,
    color: "white",
    marginLeft: 40,
  },
  input: {
    width: "80%",
    backgroundColor: "white",
    color: "black",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonOutline: {
    backgroundColor: colors.primary,
    marginTop: 10,
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OtpVerification;
