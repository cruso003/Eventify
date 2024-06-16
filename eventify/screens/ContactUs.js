import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import contactApi from "../api/contact";
import Toast from "react-native-toast-message";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const response = await contactApi.sendMail({
        name,
        email,
        message,
      });

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Message Sent",
          visibilityTime: 3000,
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error sending message",
        text2: error.message,
        visibilityTime: 3000,
      });
    }
  };

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../assets/contact.jpeg")}
        />
        <Text style={styles.title}>GET IN TOUCH!</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="Message"
          placeholderTextColor="#aaa"
          value={message}
          onChangeText={(text) => setMessage(text)}
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <Text style={styles.contactInfo}>
          For account deletion requests, please enter your request in the
          message and we will get back to you for confirmation.
        </Text>
        <Text style={styles.contactInfo}>
          Alternatively, you can also email us at{" "}
          <Text
            style={{ color: "blue", textDecorationLine: "underline" }}
            onPress={() => Linking.openURL("mailto:support@example.com")}
          >
            support@example.com
          </Text>
          .
        </Text>
        <Text style={styles.contactInfo}>Follow us on</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity
            onPress={() =>
              openLink(
                "https://www.instagram.com/tick8plus?igsh=dDRnM2g2NnJ4dWZj"
              )
            }
          >
            <FontAwesome
              name="instagram"
              size={30}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openLink("https://x.com/tick8plus?t=t5FT5jPi0hA_70jS0oLc3w&s=08")
            }
          >
            <Ionicons
              name="logo-twitter"
              size={30}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openLink(
                "https://www.facebook.com/profile.php?id=61559964784532&mibextid=ZbWKwL"
              )
            }
          >
            <FontAwesome
              name="facebook"
              size={30}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000", // Changed to black
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff", // Changed to white
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#333", // Changed to dark grey
    color: "#fff", // Changed to white
  },
  messageInput: {
    height: 100,
  },
  button: {
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInfo: {
    fontSize: 16,
    marginVertical: 10,
    color: "#fff", // Changed to white
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default ContactUs;
