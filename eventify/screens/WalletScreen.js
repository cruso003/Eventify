// WalletScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useAuth } from "../auth/context";
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
  const { cart, addToCartWithAmount } = useCart();
  const navigation = useNavigation();
  const [user, setUser] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
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
        // Check the status code to see if the wallet exists
        if (walletBalanceResponse.status === 404) {
          // Create wallet if it doesn't exist
          const newWallet = await walletApi.createWallet(userId);
          // Update the balance state with the newly created wallet's balance
          setBalance(newWallet.data.balance);
        } else {
          // Wallet exists, update the balance state
          const walletBalance = walletBalanceResponse.data.balance;
          setBalance(walletBalance);
        }

        // Fetch transaction history
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
    // Validate amountToAdd
    if (!amountToAdd) {
      // Handle empty amountToAdd
      return;
    }
    // Add money to the wallet
    setBalance((prevBalance) => prevBalance + parseFloat(amountToAdd));
    // Add transaction to transactions array
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      {
        id: prevTransactions.length + 1,
        type: "topup",
        amount: parseFloat(amountToAdd),
      },
    ]);
    // Add the wallet top-up to the cart
    addToCartWithAmount(amountToAdd);
    // Close the modal
    handleCloseModal();
    // Navigate to the cart screen
    navigation.navigate("Cart");
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
          onPress={() => navigation.navigate("Cart")}
        >
          <MaterialIcons name="shopping-cart-checkout" size={28} color="#fff" />
          <View
            style={[
              styles.centerElement,
              {
                width: 18,
                height: 18,
                position: "absolute",
                right: 5,
                top: 5,
                backgroundColor:
                  cart.length > 0 ? colors.secondary : "transparent",
                borderRadius: 9,
              },
            ]}
          >
            {cart.length > 0 && (
              <Text style={{ fontSize: 10, color: "white" }}>
                {cart.length} {/* Use the length of the cart array */}
              </Text>
            )}
          </View>
        </TouchableOpacity>
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="attach-money" size={30} color="black" />
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amountToAdd}
                onChangeText={setAmountToAdd}
              />
            </View>

            <CustomButton
              title="Add"
              onPress={handleAddMoney}
              color={colors.primary}
            />
            <CustomButton
              title="Cancel"
              onPress={handleCloseModal}
              color={colors.secondary} // Pass your desired color
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
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
  transactionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  transactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  transaction: {
    fontSize: 16,
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
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 200,
  },
});

export default WalletScreen;
