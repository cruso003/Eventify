import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../config/colors";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import walletApi from "../api/wallet";
import paymentApi from "../api/payment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../constants";
//import NfcManager from 'react-native-nfc-manager';

const WalletScreen = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nfcScanModalVisible, setNfcScanModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userIdLoading, setUserIdLoading] = useState(true);
  const [nfcId, setNfcId] = useState(null);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchWalletDetails = async () => {
        if (userIdLoading || !userId) {
          return;
        }

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
          console.error("Error fetching wallet details:", error.response ? error.response.data : error.message);
        }
      };

      fetchWalletDetails();
    }, [userId, userIdLoading])
  );

  useEffect(() => {
    //NfcManager.start();
    return () => {
     // NfcManager.stop();
      //NfcManager.setEventListenerOff();
    };
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser?._id || null);
        setUserIdLoading(false);
      } catch (error) {
        console.error("Error retrieving user data:", error);
        setUserIdLoading(false);
      }
    };

    getData();
  }, []);

  const handleTopUp = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setAmountToAdd("");
  };

  const handleModalSubmit = async () => {
    const totalAmount = parseFloat(amountToAdd);

    if (!phoneNumber || !amountToAdd) {
      Alert.alert(
        "Valid phone number and amount are required for Mobile Money payment"
      );
      return;
    }

    try {
      setLoading(true);
      const response = await paymentApi.requestToPay(
        totalAmount.toString(),
        phoneNumber
      );

      if (response.success) {
        Alert.alert("Payment successful.");
        const amount = totalAmount;

        // Call backend to update the wallet balance
        const updateResponse = await walletApi.updateWalletBalance(
          userId,
          amount
        );
        if (updateResponse.status === 200) {
          setBalance((prevBalance) => prevBalance + totalAmount);
          setTransactions((prevTransactions) => [
            ...prevTransactions,
            {
              id: prevTransactions.length + 1,
              type: "topup",
              amount: totalAmount,
              date: new Date().toISOString(),
            },
          ]);
          handleCloseModal();
        } else {
          Alert.alert("Failed to update wallet balance. Please try again.");
        }
      } else {
        Alert.alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting Mobile Money payment:", error);
      Alert.alert(
        "An error occurred during Mobile Money payment. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const startNfcScan = async () => {
    try {
      setNfcScanModalVisible(true);
     // await NfcManager.setEventListenerOn();
      //await NfcManager.requestTechnology(NfcManager.NfcTech.NfcV);
      //const tag = await NfcManager.getTag();
      setNfcId(tag.id);
    } catch (error) {
      console.error("Error scanning NFC tag:", error);
      Alert.alert("Failed to scan NFC tag. Please try again.");
    } finally {
      NfcManager.setEventListenerOff();
      setNfcScanModalVisible(false);
    }
  };

  const handleNfcPayment = async () => {
    if (!nfcId) {
      Alert.alert("Please scan an NFC tag first.");
      return;
    }

    const amount = parseFloat(amountToAdd);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      const response = await walletApi.handlePayment(nfcId, amount);

      if (response.success) {
        setBalance(response.balance);
        setTransactions((prevTransactions) => [
          ...prevTransactions,
          {
            id: prevTransactions.length + 1,
            type: "purchase",
            amount,
            date: new Date().toISOString(),
          },
        ]);
        Alert.alert("Payment successful.");
      } else {
        Alert.alert("Insufficient balance or payment failed.");
      }
    } catch (error) {
      console.error("Error handling NFC payment:", error);
      Alert.alert("An error occurred during NFC payment. Please try again later.");
    } finally {
      setLoading(false);
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
        <LinearGradient colors={COLORS.linear} style={styles.balanceCard}>
          <Text style={styles.balanceText}>Wallet Balance:</Text>
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>${balance}</Text>
        </LinearGradient>
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
        <TouchableOpacity
          onPress={startNfcScan}
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
            name="nfc"
            size={24}
            color="black"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.buttonOutlineText}>Pay with NFC</Text>
        </TouchableOpacity>
        <Text style={styles.transactionTitle}>Transaction History</Text>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <Text style={styles.transactionText}>
                {transaction.type === "topup" ? "Top-Up" : "Purchase"} - $
                {transaction.amount}
              </Text>
              <Text style={styles.transactionDate}>
                {new Date(transaction.date).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noTransactions}>No transactions yet.</Text>
        )}
      </View>
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Money to Wallet</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amountToAdd}
              onChangeText={setAmountToAdd}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TouchableOpacity
              onPress={handleModalSubmit}
              style={styles.button}
            >
              {loading ? (
                <Text style={styles.buttonText}>Processing...</Text>
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={nfcScanModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scan NFC Tag</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount to spend"
              keyboardType="numeric"
              value={amountToAdd}
              onChangeText={setAmountToAdd}
            />
            <TouchableOpacity
              onPress={handleNfcPayment}
              style={styles.button}
            >
              {loading ? (
                <Text style={styles.buttonText}>Processing...</Text>
              ) : (
                <Text style={styles.buttonText}>Pay with NFC</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNfcScanModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  balanceCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 18,
    color: "#fff",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonOutline: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  buttonOutlineText: {
    fontSize: 16,
    color: colors.primary,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionItem: {
    padding: 10,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  transactionText: {
    fontSize: 16,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.grey,
  },
  noTransactions: {
    fontSize: 16,
    color: colors.grey,
    textAlign: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: colors.primary,
  },
});

export default WalletScreen;
