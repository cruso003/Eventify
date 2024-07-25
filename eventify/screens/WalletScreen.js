// WalletScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import colors from "../config/colors";
import CustomButton from "./forms/CustomButton";
import { useNavigation } from "@react-navigation/native";
import walletApi from "../api/wallet";
import { useCart } from "../components/context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WalletScreen = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [topUpAmount, setTopUpAmount] = useState(0);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser._id);
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const walletBalanceResponse = await walletApi.getWalletBalance(userId);
        if (walletBalanceResponse.status === 404) {
          const newWallet = await walletApi.createWallet(userId);
          setBalance(newWallet.data.balance);
        } else {
          const walletBalance = walletBalanceResponse.data.balance;
          setBalance(walletBalance);
        }

        const transactionHistoryResponse = await walletApi.transactions(userId);
        const transactions = transactionHistoryResponse.data.transactions;
        setTransactions(transactions || []);
      } catch (error) {
        console.error("Error fetching wallet details:", error);
      }
    };

    fetchWalletDetails();
  }, [userId]);

  const handleTopUp = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setAmountToAdd("");
  };

  const handleAddMoney = () => {
    if (!amountToAdd) {
      Alert.alert("Amount is required");
      return;
    }
    setTopUpAmount(parseFloat(amountToAdd));
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    const totalAmount = topUpAmount.toFixed(2);
    if (!phoneNumber) {
      Alert.alert("Phone number is required for Mobile Money payment");
      return;
    }

    try {
      const response = await paymentApi.requestToPay(totalAmount.toString(), phoneNumber);

      if (response.success) {
        Alert.alert("Payment successful. Thank you for your order!");
        setBalance((prevBalance) => prevBalance + parseFloat(amountToAdd));
        setTransactions((prevTransactions) => [
          ...prevTransactions,
          {
            id: prevTransactions.length + 1,
            type: "topup",
            amount: parseFloat(amountToAdd),
          },
        ]);
        handleCloseModal();
      } else {
        Alert.alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting Mobile Money payment:", error);
      Alert.alert("An error occurred during Mobile Money payment. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "grey",
        }}
      >
        <TouchableOpacity
          style={[styles.centerElement, { width: 50, height: 50 }]}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <MaterialIcons name="arrow-back" size={25} color="#000" />
        </TouchableOpacity>
        <View style={{ flexGrow: 1, flexShrink: 1, alignSelf: "center" }}>
          <Text
            numberOfLines={1}
            style={{ fontSize: 20, color: "black", fontWeight: "bold" }}
          >
            My Wallet
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.centerElement, { width: 50, height: 50 }]}
          onPress={() => {}}
        >
          <Ionicons name="notifications" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceText}>Wallet Balance:</Text>
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>${balance}</Text>
        </View>
        <TouchableOpacity
          onPress={handleTopUp}
          style={[
            styles.button,
            styles.buttonOutline,
            {
              flexDirection: "row",
              alignItems: "space-around",
              justifyContent: "center",
            },
          ]}
        >
          <MaterialCommunityIcons
            name="wallet-plus"
            size={24}
            color="black"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.buttonOutlineText}>Add Money</Text>
        </TouchableOpacity>
        <Text style={styles.transactionTitle}>Transaction History:</Text>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionContainer}>
            <Text style={styles.transaction}>
              {transaction.type === "topup" ? "Top-Up" : "Payment"} - $
              {transaction.amount}
            </Text>
            <Text style={styles.transactionDate}>
              {new Date(transaction.date).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
      <Modal
  visible={isModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={handleCloseModal}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Add Money</Text>
      <Image
        style={{ width: 50, height: 50, marginVertical: 10 }}
        resizeMode="contain"
        source={require("../assets/momo.jpg")}
      />
      <Text style={styles.paymentMethodText}>Payment Method: Mobile Money</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Mobile Money Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Mobile Money number"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="attach-money" size={30} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amountToAdd}
          onChangeText={setAmountToAdd}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
        title="Add"
        onPress={handleAddMoney}
        color={colors.primary}
      />
      <CustomButton
        title="Cancel"
        onPress={handleCloseModal}
        color={colors.secondary}
      />
      </View>
      
    </View>
  </View>
</Modal>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  centerElement: { justifyContent: "center", alignItems: "center" },
  balanceCard: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: "bold",
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
    marginLeft: 15,
  },
  buttonOutlineText: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row"
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "white"
  },
  transactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  transaction: {
    fontSize: 16,
    color: "white"
  },
  transactionDate: {
    fontSize: 12,
    color: "gray",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  paymentMethodText: {
    fontSize: 12,
    marginVertical: 10,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 12,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default WalletScreen;
