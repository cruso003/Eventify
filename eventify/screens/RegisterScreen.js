import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome icons
import colors from "../config/colors";
import userApi from "../api/users";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";

const RegisterScreen = ({ navigation }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const showSnackbar = (response, type) => {
    let message;

    if (response && response.data && response.data.message) {
      message = response.data.message;
    } else if (response && response.message) {
      message = response.message;
    } else {
      message = "An error occurred during registration";
    }

    showMessage({
      message,
      type: type === "success" ? "success" : "danger",
      duration: 3000, // 3 seconds duration
    });
  };

  const handleRegister = async () => {
    try {
      const user = {
        name: fullname,
        email,
        password,
      };

      const response = await userApi.registerUser(user);

      if (response.data.success) {
        // Show success message
        Alert.alert(
          "Success",
          "Account created successfully",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ],
          { cancelable: false }
        );
      } else {
        // Show error message
        showSnackbar(response, "error");
      }
    } catch (error) {
      console.error(
        "Error registering user:",
        error.response?.data || error.message
      );
      // Show error message
      showSnackbar(response, "error");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        {/* Company Logo */}
        <Image
          style={styles.logo}
          source={require("../assets/tick-8-high-resolution-logo-transparent.png")}
        />

        <Text style={styles.heading}>Create your free account</Text>

        <View style={styles.inputContainer}>
          <Text style={{ color: colors.white }}>Full Name</Text>
          <TextInput
            value={fullname}
            onChangeText={(text) => setFullname(text)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={{ color: colors.white }}>Email address</Text>
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={{ color: colors.white }}>Password</Text>
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!visible}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            {visible ? (
              <FontAwesome name="eye" size={20} color="white" />
            ) : (
              <FontAwesome name="eye-slash" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          style={styles.registerButton}
        >
          <Text style={styles.buttonText}>Create my free account</Text>
        </TouchableOpacity>

        <Text style={{ color: colors.white }}>Already have an account?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Login</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.white }}>Want to sell Event Tickets?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("registerOrganizer")}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Become Organizer</Text>
        </TouchableOpacity>
      </View>
      <FlashMessage position="top" />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.white,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    backgroundColor: colors.white,
  },
  registerButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  loginContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: colors.primary,
    borderWidth: 2,
    padding: 15,
    borderRadius: 15,
    marginLeft: 5,
    marginRight: 5,
  },
  buttonOutline: {
    backgroundColor: colors.white,
    marginTop: 5,
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
};

export default RegisterScreen;
