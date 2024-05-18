import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../config/colors";
import userApi from "../api/users";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { SelectList } from "react-native-dropdown-select-list";

const OrganizerRegistration = ({ navigation }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedState, setSelectedState] = useState("Montserrado");
  const [selectedCity, setSelectedCity] = useState("Please choose a city");

  const cities = {
    Montserrado: [
      { key: "1", value: "Monrovia" },
      { key: "2", value: "Paynesville" },
      { key: "3", value: "Bensonville" },
      { key: "4", value: "Careysburg" },
      { key: "5", value: "St. Paul River" },
      { key: "6", value: "Gardnersville" },
    ],
    Bong: [
      { key: "7", value: "Gbarnga" },
      { key: "8", value: "Boinsen District" },
      { key: "9", value: "Fuamah District" },
      { key: "10", value: "Jorquelleh District" },
      { key: "11", value: "Kokoyah District" },
      { key: "12", value: "Kpaii District" },
      { key: "90", value: "Salala District" },
      { key: "91", value: "Suakoko District" },
      { key: "92", value: "Zota District" },
    ],
    Gbarpolu: [
      { key: "13", value: "Bopolu" },
      { key: "14", value: "Belleh District" },
      { key: "15", value: "Bokomu District" },
      { key: "16", value: "Gbarma District" },
      { key: "17", value: "Gounwolaila District" },
      { key: "18", value: "Kongba District" },
    ],
    "Grand Bassa": [
      { key: "19", value: "Buchanan" },
      { key: "20", value: "Commonwealth District" },
      { key: "21", value: "District #1" },
      { key: "22", value: "District #2" },
      { key: "23", value: "District #3" },
      { key: "24", value: "District #4" },
    ],
    "Grand Cape Mount": [
      { key: "25", value: "Robertsport" },
      { key: "26", value: "Garwula District" },
      { key: "27", value: "Gola Konneh District" },
      { key: "28", value: "Porkpa District" },
      { key: "29", value: "Tewor District" },
      { key: "30", value: "Commonwealth District" },
    ],
    "Grand Gedeh": [
      { key: "31", value: "Zwedru" },
      { key: "32", value: "B'hai District" },
      { key: "33", value: "Gbarzon District" },
      { key: "34", value: "Konobo District" },
      { key: "35", value: "Tchien District" },
      { key: "36", value: "Zwedru District" },
    ],
    "Grand Kru": [
      { key: "37", value: "Barclayville" },
      { key: "38", value: "Buah District" },
      { key: "39", value: "Dorbor District" },
      { key: "40", value: "Forpoh District" },
      { key: "41", value: "Jloh District" },
      { key: "42", value: "Kplio District" },
    ],
    Lofa: [
      { key: "43", value: "Voinjama" },
      { key: "44", value: "Foya District" },
      { key: "45", value: "Kolahun District" },
      { key: "46", value: "Salayea District" },
      { key: "47", value: "Vahun District" },
      { key: "48", value: "Zorzor District" },
    ],
    Margibi: [
      { key: "49", value: "Kakata" },
      { key: "50", value: "Firestone District" },
      { key: "51", value: "Gibi District" },
      { key: "52", value: "Kakata District" },
      { key: "53", value: "Mambah-Kaba District" },
      { key: "54", value: "Marshall Territory" },
    ],
    Maryland: [
      { key: "55", value: "Harper" },
      { key: "56", value: "Barrobo District" },
      { key: "57", value: "Gbeapo District" },
      { key: "58", value: "Karluway District" },
      { key: "59", value: "Pleebo/Sodeken District" },
      { key: "60", value: "Whojah District" },
    ],
    Nimba: [
      { key: "61", value: "Sanniquellie" },
      { key: "62", value: "Boe & Quilla District" },
      { key: "63", value: "Doe District" },
      { key: "64", value: "Garr Bain District" },
      { key: "65", value: "Gbehlay-Geh District" },
      { key: "66", value: "Kparblee District" },
    ],
    "River Cess": [
      { key: "67", value: "Cestos City" },
      { key: "68", value: "Bearwor District" },
      { key: "69", value: "Central River Cess District" },
      { key: "70", value: "Fen River District" },
      { key: "71", value: "Jo River District" },
      { key: "72", value: "Morweh District" },
    ],
    "River Gee": [
      { key: "73", value: "Fish Town" },
      { key: "74", value: "Chedepo District" },
      { key: "75", value: "Gbeapo District" },
      { key: "76", value: "Glaro District" },
      { key: "77", value: "Karforh District" },
      { key: "78", value: "Nyenawliken District" },
    ],
    Sinoe: [
      { key: "79", value: "Greenville" },
      { key: "80", value: "Butaw District" },
      { key: "81", value: "Dugbe River District" },
      { key: "82", value: "Greenville District" },
      { key: "83", value: "Jaedepo District" },
      { key: "84", value: "Juarzon District" },
    ],
    Bomi: [
      { key: "85", value: "Tubmanburg" },
      { key: "86", value: "Dewoin District" },
      { key: "87", value: "Klay District" },
      { key: "88", value: "Mecca District" },
      { key: "89", value: "Senjeh District" },
    ],
  };

  const states = [
    { label: "Montserrado", value: "Montserrado" },
    { label: "Bong", value: "Bong" },
    { label: "Grand Bassa", value: "Grand Bassa" },
    { label: "Bomi", value: "Bomi" },
    { label: "Nimba", value: "Nimba" },
    { label: "Margibi", value: "Margibi" },
    { label: "Gbarpolu", value: "Gbarpolu" },
    { label: "Grand Gedeh", value: "Grand Gedeh" },
    { label: "Grand Cape Mount", value: "Grand Cape Mount" },
    { label: "Grand Kru", value: "Grand Kru" },
    { label: "Maryland", value: "Maryland" },
    { label: "Lofa", value: "Lofa" },
    { label: "Rivercess", value: "Rivercess" },
    { label: "River Gee", value: "River Gee" },
    { label: "Sinoe", value: "Sinoe" },
  ];

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
      duration: 3000,
    });
  };

  const handleRegister = async () => {
    try {
      const user = {
        name: fullname,
        email,
        password,
      };

      const seller = {
        ...user,
        businessName,
        phoneNumber,
        address,
        city: selectedCity,
        state: selectedState,
      };

      const response = await userApi.registerSeller(seller);
      if (response.data.success) {
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
        showSnackbar(response, "error");
      }
    } catch (error) {
      console.error(
        "Error registering organizer:",
        error.response?.data || error.message
      );
      showSnackbar(response, "error");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../assets/tick-8-high-resolution-logo-transparent.png")}
          />
          <Text style={styles.heading}>Create Your Business Account</Text>

          <View style={styles.inputContainer}>
            <Text style={{ color: colors.white }}>Full Name</Text>
            <TextInput
              value={fullname}
              onChangeText={(text) => setFullname(text)}
              style={styles.input}
              placeholder="eg. John Brown"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={{ color: colors.white }}>Email address</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholder="eg. johnbrown@gmail.com"
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

          {/* Seller-specific fields */}
          <View style={styles.inputContainer}>
            <Text style={{ color: colors.white }}>Business Name</Text>
            <TextInput
              value={businessName}
              onChangeText={(text) => setBusinessName(text)}
              style={styles.input}
              placeholder="eg. John Business Center"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={{ color: colors.white }}>Phone Number</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              style={styles.input}
              placeholder="eg. 0880011233"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={{ color: colors.white }}>Full Address</Text>
            <TextInput
              value={address}
              onChangeText={(text) => setAddress(text)}
              style={styles.input}
              placeholder="eg. Police Academy Community"
            />
          </View>
          <View style={{ marginVertical: 10, backgroundColor: "white" }}>
            <SelectList
              setSelected={setSelectedState}
              data={states}
              placeholder={"Select County"}
              defaultOption={{ key: "Montserrado", value: "Montserrado" }}
            />
          </View>

          <View style={{ marginVertical: 10, backgroundColor: "white" }}>
            <SelectList
              setSelected={setSelectedCity}
              data={cities[selectedState]}
              placeholder={"Select City"}
              defaultOption={cities[selectedState][0]}
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            style={styles.registerButton}
          >
            <Text style={styles.buttonText}>Create organizer account</Text>
          </TouchableOpacity>

          <Text>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <FlashMessage position="top" />
    </SafeAreaView>
  );
};

const styles = {
  scrollContainer: {
    flexGrow: 1,
  },
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

export default OrganizerRegistration;
