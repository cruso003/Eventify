import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  Platform,
  StatusBar,
  Alert,
  Modal,
  Button,
} from "react-native";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import { RadioButton } from "react-native-paper";
import paymentApi from "../api/payment";
import { useStripe } from "@stripe/stripe-react-native";
import ordersApi from "../api/orders";
import uuid from "react-native-uuid";
import walletApi from "../api/wallet";
import cartApi from "../api/cart";
import { useAuth } from "../auth/context";
import { useCart } from "../components/context/CartContext";

function Checkout({ route, navigation }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const { subtotalPrice, setCart } = useCart();
  const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    // Fetch wallet balance when the component mounts
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const response = await walletApi.getWalletBalance(user._id);
      if (response.ok) {
        setWalletBalance(response.data.balance);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };
  const transactionId = uuid.v4();
  const calculateGrandTotal = () => {
    let grandTotal = 0;

    stepOne.cartItems.forEach((item) => {
      const subtotal = item.salePrice
        ? item.salePrice + item.deliveryFee
        : item.amount;
      grandTotal += subtotal;
    });

    return grandTotal;
  };

  const validateRequiredFields = () => {
    if (currentStep === 1) {
      const { fullName, streetAddress, phone } = stepTwo;

      // Check if the required fields are filled
      const allRequiredFieldsFilled =
        fullName.trim() !== "" &&
        streetAddress.trim() !== "" &&
        phone.trim() !== "";

      // Update the state based on the validation result
      setRequiredFieldsFilled(allRequiredFieldsFilled);

      return allRequiredFieldsFilled;
    }

    // Return true for steps other than step 1
    return true;
  };
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const bankPayment = async () => {
    const totalAmount = Math.floor(
      (subtotalPrice() +
        stepOne.cartItems.reduce(
          (total, item) =>
            item.deliveryFee ? total + item.deliveryFee : total,
          0
        )) *
        100
    );

    // Fetch the client secret with the total amount
    const response = await paymentApi.createPaymentIntent(totalAmount);

    if (response.error) {
      Alert.alert("Something went wrong");
      return;
    }

    // Initialize payment sheet
    const initResponse = await initPaymentSheet({
      merchantDisplayName: "Swift Cart",
      paymentIntentClientSecret: response.data.paymentIntent,
      defaultBillingDetails: {
        name: `${stepTwo.fullName}`,
        address: `${stepTwo.streetAddress}`,
        phone: `${stepTwo.phone}`,
        email: `${stepTwo.emailAddress}`,
      },
    });

    if (initResponse.error) {
      Alert.alert("Something went wrong");
      return;
    }

    // Present payment sheet and wait for payment success
    const paymentResult = await presentPaymentSheet();

    if (paymentResult.error) {
      Alert.alert("Payment failed. Please try again.");
      return;
    }

    // Payment successful, move to the next step
    setCurrentStep(currentStep + 1);
  };

  const paymentMethods = [
    {
      id: "cashOnDelivery",
      name: "Pay on Delivery",
      icon: require("../assets/cash-on-delivery.jpg"),
    },
    {
      id: "bankCard",
      name: "Bank Card",
      icon: require("../assets/cards.jpg"),
    },
    {
      id: "wallet",
      name: `Swift Pay - Wallet balance: $${walletBalance.toFixed(2)}`,
      icon: require("../assets/wallet.jpg"),
    },
    {
      id: "mobileMoney",
      name: "Mobile Money",
      icon: require("../assets/momo.jpg"),
    },
  ];

  const createOrder = async (orderDetails) => {
    try {
      const response = await ordersApi.placeOrder(orderDetails);

      if (response.ok) {
        alert("Order created successfully");
        // Clear the cart after placing order for all payment methods
        await clearCartAfterOrder();
      } else {
        alert("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order", error);
      alert("An error occurred while trying to create your order");
    }
  };

  const handleMobileMoneyPayment = async () => {
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    const totalAmount = calculateGrandTotal().toFixed(2); // Format totalAmount with two decimal places
    if (!phoneNumber) {
      Alert.alert("Phone number is required for Mobile Money payment");
      return;
    }

    try {
      console.log(totalAmount);
      // Make the request to pay without client ID and secret
      const response = await paymentApi.requestToPay(
        totalAmount.toString(),
        phoneNumber
      ); // Convert totalAmount to string

      if (response.success) {
        Alert.alert("Payment successful. Thank you for your order!");
        setModalVisible(false);
        setCurrentStep(currentStep + 1);
      } else {
        Alert.alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting Mobile Money payment:", error);
      Alert.alert(
        "An error occurred during Mobile Money payment. Please try again later."
      );
    }
  };

  const makePayment = async () => {
    try {
      setLoading(true);
      let orderStatus = "Pending"; // Default order status

      // Handle next button click based on the selected payment method
      switch (selectedPaymentMethod) {
        case "bankCard":
          // Perform actions for bank card payment
          await bankPayment();
          break;
        case "mobileMoney":
          await handleMobileMoneyPayment();
          break;
        case "wallet":
          if (walletBalance >= calculateGrandTotal()) {
            // Deduct the total amount from the wallet balance
            const updatedBalance = walletBalance - calculateGrandTotal();
            // Update the wallet balance in the backend
            const response = await walletApi.updateWalletBalance(
              user._id,
              -calculateGrandTotal()
            );
            if (response.ok) {
              // Update the wallet balance state
              setWalletBalance(updatedBalance);
              // Move to the next step
              setCurrentStep(currentStep + 1);
              // Display success message or navigate to the next step
              // (This can be handled in your component logic)
            } else {
              // Handle error if updating wallet balance fails
              console.error("Failed to update wallet balance:", response.error);
              alert("Failed to update wallet balance. Please try again later.");
            }
          } else {
            alert("Insufficient balance in your wallet");
          }
          break;
        case "cashOnDelivery":
          // Finalize the order without any additional steps
          cashOnDelivery();
          break;
        default:
          break;
      }

      setLoading(false);
    } catch (error) {
      console.error("Error processing payment:", error);
      // Show an alert box to notify the user about the error
      window.alert(
        "An error occurred while processing the payment. Please try again later."
      );
    }
  };

  const clearCartAfterOrder = async () => {
    try {
      // Ensure `stepOne.cartItems` is an array of cart items
      if (!Array.isArray(stepOne.cartItems)) {
        console.error("cartItems is not an array");
        return;
      }

      // Extract the IDs of the cart items
      const itemIds = stepOne.cartItems.map((item) => item._id);

      // Ensure `itemIds` is non-empty
      if (!itemIds || itemIds.length === 0) {
        console.error("No item IDs to remove");
        return;
      }

      // Attempt to remove items from backend cart
      const response = await cartApi.removeCartItems(user._id, itemIds);

      // Check response status code
      if (response && response.status === 200) {
        // Fetch the updated cart data from the backend
        const updatedCartResponse = await cartApi.getUserCartItems(user._id);

        // Check the updated cart response
        if (Array.isArray(updatedCartResponse.data)) {
          // Update the cart state in your app with the latest cart data
          setCart(updatedCartResponse.data);

          // If the cart is empty, set the cart state to an empty array
          if (updatedCartResponse.data.length === 0) {
            setCart([]);
          }
        } else {
          console.error("Failed to fetch updated cart data.");
        }
      } else {
        console.error("Failed to remove cart items.");
      }
    } catch (error) {
      console.error("Error clearing cart after order:", error);
    }
  };

  const cashOnDelivery = () => {
    setCurrentStep(currentStep + 1);
  };

  const [steps] = useState(["Review", "Shipping", "Payment", "Submit"]);
  const [stepOne] = useState({
    cartItemsIsLoading: false,
    cartItems: route.params.cartItems,
  });

  // Check if there are any cart items
  const hasCartItems = stepOne.cartItems && stepOne.cartItems.length > 0;

  // Define an initial `selectedAddress` from the first cart item if there are any items
  const initialSelectedAddress = hasCartItems
    ? stepOne.cartItems[0].selectedAddress
    : null;

  // Initialize `stepTwo` based on the `selectedAddress` of the first cart item
  const [stepTwo, setStepTwo] = useState({
    fullName: initialSelectedAddress ? initialSelectedAddress.name : user.name,
    streetAddress: initialSelectedAddress ? initialSelectedAddress.street : "",
    aptSuite: initialSelectedAddress ? initialSelectedAddress.landmark : "",
    city: initialSelectedAddress ? initialSelectedAddress.city : "",
    state: initialSelectedAddress ? initialSelectedAddress.state : "",
    phone: initialSelectedAddress ? initialSelectedAddress.mobileNo : "",
    emailAddress: user.email ? user.email : "",
  });

  const styles = StyleSheet.create({
    centerElement: { justifyContent: "center", alignItems: "center" },
  });
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={70}
      style={{
        flex: 1,
        marginTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
      }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <View
        style={{ flex: 1, flexDirection: "column", backgroundColor: "#eaeef1" }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            style={[styles.centerElement, { width: 50, height: 50 }]}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={25} color="#000" />
          </TouchableOpacity>
          <View style={[styles.centerElement, { height: 50 }]}>
            <Text style={{ fontSize: 18, color: "#000" }}>Checkout</Text>
          </View>
        </View>

        {/* Modal for collecting phone number */}
        <Modal visible={modalVisible} transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                width: "80%",
              }}
            >
              <Text>Enter Mobile Money Phone Number:</Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Phone number"
                keyboardType="phone-pad"
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc",
                  marginVertical: 10,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
                <Button title="OK" onPress={handleModalSubmit} />
              </View>
            </View>
          </View>
        </Modal>

        <View
          style={{
            alignItems: "center",
            elavation: 10,
            borderBottomWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <View style={{ width: 280, height: 70 }}>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  height: 2,
                  backgroundColor: colors.primary,
                  width: 180,
                  position: "absolute",
                  top: 13,
                  zIndex: 10,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                position: "absolute",
                zIndex: 20,
              }}
            >
              {steps.map((label, i) => (
                <View key={i} style={{ alignItems: "center", width: 70 }}>
                  {i > currentStep && i != currentStep /* Not selected */ && (
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 30,
                        height: 30,
                        backgroundColor: "#eaeef1",
                        borderWidth: 2,
                        borderColor: colors.primary,
                        borderRadius: 15,
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ fontSize: 15, color: "#6689ff" }}>
                        {i + 1}
                      </Text>
                    </View>
                  )}
                  {i < currentStep /* Checked */ && (
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 30,
                        height: 30,
                        backgroundColor: "#26d06e",
                        borderWidth: 2,
                        borderColor: "#26d06e",
                        borderRadius: 15,
                        marginBottom: 10,
                      }}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#fff"
                      />
                    </View>
                  )}
                  {i == currentStep /* Selected */ && (
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 30,
                        height: 30,
                        backgroundColor: colors.secondary,
                        borderWidth: 2,
                        borderColor: colors.secondary,
                        borderRadius: 15,
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ fontSize: 13, color: "#ffffff" }}>
                        {i + 1}
                      </Text>
                    </View>
                  )}
                  <Text style={{ fontSize: 12 }}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <ScrollView keyboardShouldPersistTaps={"handled"}>
          {/* Step 1 */}
          {currentStep == 0 && (
            <View>
              {stepOne.cartItemsIsLoading ? (
                <View style={[styles.centerElement, { height: 300 }]}>
                  <ActivityIndicator size="large" color="#ef5739" />
                </View>
              ) : (
                <View>
                  {stepOne.cartItems &&
                    stepOne.cartItems.map((item, i) => (
                      <View
                        key={i}
                        style={{
                          flexDirection: "row",
                          backgroundColor: "#fff",
                          marginBottom: 2,
                          height: 70,
                          paddingHorizontal: 20,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            flexGrow: 1,
                            flexShrink: 1,
                            alignSelf: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              /*this.props.navigation.navigate('ProductDetails', {productDetails: item})*/
                            }}
                            style={{ paddingRight: 10 }}
                          >
                            <Image
                              source={{ uri: item.product.images[0] }}
                              style={[
                                styles.centerElement,
                                {
                                  height: 60,
                                  width: 60,
                                  backgroundColor: "#eeeeee",
                                },
                              ]}
                            />
                          </TouchableOpacity>
                          <View
                            style={{
                              flexGrow: 1,
                              flexShrink: 1,
                              alignSelf: "center",
                            }}
                          >
                            <Text numberOfLines={1} style={{ fontSize: 15 }}>
                              {item.product.name}
                            </Text>
                            {item && item.selectedVariations && (
                              <Text
                                style={{ color: "#8f8f8f", marginBottom: 10 }}
                              >
                                Variation:{" "}
                                {Object.entries(item.selectedVariations)
                                  .map(
                                    ([variation, value]) =>
                                      `${variation}: ${value}`
                                  )
                                  .join(", ")}
                              </Text>
                            )}
                          </View>
                        </View>
                        <View style={[styles.centerElement, { width: 60 }]}>
                          <Text style={{ color: "#333333" }}>
                            Qty. {item.qty}
                          </Text>
                        </View>
                        <View style={[styles.centerElement, { width: 60 }]}>
                          <Text style={{ color: "#333333" }}>
                            $
                            {item.salePrice
                              ? item.qty * item.salePrice
                              : item.qty * item.amount}
                          </Text>
                        </View>
                      </View>
                    ))}
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                  marginVertical: 10,
                }}
              >
                <Text>Sub Total</Text>
                <Text style={{ fontWeight: "bold" }}>
                  ${subtotalPrice().toFixed(2)}
                </Text>
              </View>
            </View>
          )}
          {/* Step 2 */}
          {currentStep == 1 && (
            <View
              style={{ padding: 20, marginBottom: 20, backgroundColor: "#fff" }}
            >
              <View style={{ marginBottom: 25 }}>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 12,
                    position: "absolute",
                    left: 15,
                    top: -9,
                    paddingHorizontal: 6,
                    backgroundColor: "#fff",
                    zIndex: 10,
                    color: "#6689ff",
                  }}
                >
                  Full Name<Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#6689ff",
                  }}
                  onChangeText={(fullName) => {
                    setStepTwo((prevStepTwo) => ({ ...prevStepTwo, fullName }));
                  }}
                  value={stepTwo.fullName}
                />
              </View>
              <View style={{ flexDirection: "row", marginBottom: 20 }}>
                <View style={{ width: "60%" }}>
                  <Text
                    style={{
                      marginBottom: 5,
                      fontSize: 12,
                      position: "absolute",
                      left: 15,
                      top: -9,
                      paddingHorizontal: 6,
                      backgroundColor: "#fff",
                      zIndex: 10,
                      color: "#6689ff",
                    }}
                  >
                    Street Address<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#6689ff",
                    }}
                    onChangeText={(streetAddress) => {
                      setStepTwo((prevStepTwo) => ({
                        ...prevStepTwo,
                        streetAddress,
                      }));
                    }}
                    value={stepTwo.streetAddress}
                  />
                </View>
                <View style={{ width: "40%", paddingLeft: 8 }}>
                  <Text
                    style={{
                      marginBottom: 5,
                      fontSize: 12,
                      position: "absolute",
                      left: 15,
                      top: -9,
                      paddingHorizontal: 6,
                      backgroundColor: "#fff",
                      zIndex: 10,
                      color: "#6689ff",
                    }}
                  >
                    Apt / Suite #
                  </Text>
                  <TextInput
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#6689ff",
                    }}
                    onChangeText={(aptSuite) =>
                      setStepTwo((prevStepTwo) => ({
                        ...prevStepTwo,
                        aptSuite,
                      }))
                    }
                    value={stepTwo.aptSuite}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", marginBottom: 25 }}>
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      marginBottom: 5,
                      fontSize: 12,
                      position: "absolute",
                      left: 15,
                      top: -9,
                      paddingHorizontal: 6,
                      backgroundColor: "#fff",
                      zIndex: 10,
                      color: "#6689ff",
                    }}
                  >
                    City
                  </Text>
                  <TextInput
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#6689ff",
                    }}
                    onChangeText={(city) =>
                      setStepTwo((prevStepTwo) => ({ ...prevStepTwo, city }))
                    }
                    value={stepTwo.city}
                  />
                </View>
                <View style={{ width: "50%", paddingLeft: 8 }}>
                  <Text
                    style={{
                      marginBottom: 5,
                      fontSize: 12,
                      position: "absolute",
                      left: 15,
                      top: -9,
                      paddingHorizontal: 6,
                      backgroundColor: "#fff",
                      zIndex: 10,
                      color: "#6689ff",
                    }}
                  >
                    State
                  </Text>
                  <TextInput
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#6689ff",
                    }}
                    onChangeText={(state) =>
                      setStepTwo((prevStepTwo) => ({ ...prevStepTwo, state }))
                    }
                    value={stepTwo.state}
                  />
                </View>
              </View>

              <View style={{ marginBottom: 25 }}>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 12,
                    position: "absolute",
                    left: 15,
                    top: -9,
                    paddingHorizontal: 6,
                    backgroundColor: "#fff",
                    zIndex: 10,
                    color: "#6689ff",
                  }}
                >
                  Phone<Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#6689ff",
                  }}
                  onChangeText={(phone) => {
                    setStepTwo((prevStepTwo) => ({ ...prevStepTwo, phone }));
                  }}
                  value={stepTwo.phone}
                  keyboardType="phone-pad"
                  placeholder="0881223344"
                  placeholderTextColor="#D3D3D3"
                />
              </View>
              <View>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 12,
                    position: "absolute",
                    left: 15,
                    top: -9,
                    paddingHorizontal: 6,
                    backgroundColor: "#fff",
                    zIndex: 10,
                    color: "#6689ff",
                  }}
                >
                  Email Address
                </Text>
                <TextInput
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#6689ff",
                  }}
                  onChangeText={(emailAddress) =>
                    setStepTwo((prevStepTwo) => ({
                      ...prevStepTwo,
                      emailAddress,
                    }))
                  }
                  value={stepTwo.emailAddress}
                  keyboardType="email-address"
                  placeholder="johnbrown@gmail.com"
                  placeholderTextColor="#D3D3D3"
                />
              </View>
            </View>
          )}
          {/* Step 3 */}
          {currentStep === 2 && (
            <View
              style={{ padding: 20, marginBottom: 20, backgroundColor: "#fff" }}
            >
              {/* Render payment method radio buttons */}
              {paymentMethods
                .filter((method) => {
                  // If item.amount exists, show only bank card and mobile money options
                  if (stepOne.cartItems.some((item) => item.amount)) {
                    return (
                      method.id === "bankCard" || method.id === "mobileMoney"
                    );
                  }
                  // Otherwise, show all payment methods
                  return true;
                })
                .map((method) => (
                  <View
                    key={method.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <RadioButton
                      value={method.id}
                      status={
                        selectedPaymentMethod === method.id
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() => setSelectedPaymentMethod(method.id)}
                    />
                    <TouchableOpacity
                      onPress={() => setSelectedPaymentMethod(method.id)}
                    >
                      <Text>{method.name}</Text>
                      <Image
                        source={method.icon}
                        style={{
                          width: 70,
                          height: 60,
                          marginLeft: 5,
                          resizeMode: "contain",
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          )}
          {/* Step 4 */}
          {currentStep == 3 &&
            stepOne.cartItems &&
            stepOne.cartItems.map((item, i) => (
              <View key={i} style={{ padding: 15 }}>
                <Text style={{ fontSize: 17, marginBottom: 10 }}>
                  Shipping Address
                </Text>

                {/* Check if selectedPickupStation is available */}
                {item.selectedPickupStation ? (
                  // If selectedPickupStation is available, use its information
                  <>
                    <Text style={{ color: "#858585", marginBottom: 20 }}>
                      {item.selectedPickupStation.name}
                    </Text>
                    <Text style={{ color: "#858585" }}>
                      {item.selectedPickupStation.address.street}
                    </Text>
                    <Text style={{ color: "#858585" }}>
                      {item.selectedPickupStation.address.city}{" "}
                      {item.selectedPickupStation.address.state}
                    </Text>
                  </>
                ) : (
                  // If selectedPickupStation is not available, fall back to stepTwo
                  <>
                    <Text style={{ color: "#858585", marginBottom: 20 }}>
                      {stepTwo.fullName}
                    </Text>
                    <Text style={{ color: "#858585" }}>
                      {stepTwo.streetAddress}
                    </Text>
                    <Text style={{ color: "#858585" }}>
                      {stepTwo.city} {stepTwo.state}
                    </Text>
                  </>
                )}

                {/* Displaying other item information */}
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: 15,
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "#858585" }}>Product</Text>
                  <Text style={{ fontWeight: "200" }}>
                    {item.product.name.substr(0, 12) + "..."}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: 15,
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "#858585" }}>Price</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    $
                    {item.amount
                      ? item.amount.toFixed(2)
                      : item.salePrice.toFixed(2)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingBottom: 15,
                    borderBottomWidth: 3,
                    borderColor: "#ccc",
                  }}
                >
                  <Text style={{ color: "#858585" }}>
                    {item.shipmentOption}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    ${item.deliveryFee ? item.deliveryFee.toFixed(2) : 0}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 15,
                  }}
                >
                  <Text style={{ color: "#858585" }}>Sub Total</Text>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    $
                    {(
                      (item.amount ? item.amount : item.salePrice) +
                      item.deliveryFee
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}

          {/* Grand Total section */}
          {currentStep === 3 && (
            <View style={{ padding: 15 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 15,
                }}
              >
                <Text style={{ color: "#858585" }}>Grand Total</Text>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  ${calculateGrandTotal().toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {/*Step 5 (Thank you page)*/}
          {currentStep == 4 && (
            <View style={{ padding: 15, alignItems: "center", marginTop: 50 }}>
              <Text style={{ fontSize: 20 }}>Payment Complete</Text>
              <AntDesign
                name="checkcircleo"
                size={60}
                color="#26d06e"
                style={{ marginVertical: 25 }}
              />
              <TouchableOpacity
                style={[
                  styles.centerElement,
                  {
                    width: 165,
                    height: 35,
                    backgroundColor: "#6689ff",
                    elevation: 5,
                    borderRadius: 20,
                  },
                ]}
                onPress={async () => {
                  try {
                    // Check if it's a virtual order
                    if (stepOne.cartItems.some((item) => item.amount)) {
                      const topUpAmount = stepOne.cartItems.reduce(
                        (total, item) => total + item.amount,
                        0
                      );
                      // Call updateWalletBalance for virtual order
                      const walletApiResponse =
                        await walletApi.updateWalletBalance(
                          user._id,
                          topUpAmount
                        );
                      // Check if the wallet API call was successful
                      if (walletApiResponse && walletApiResponse.ok) {
                        console.log("Wallet balance updated successfully");
                      } else {
                        throw new Error("Failed to update wallet balance");
                      }
                    } else {
                      // It's a physical order, create the order
                      const orderDetails = {
                        products: stepOne.cartItems.map((item) => ({
                          product: item.product,
                          store: item.product.store,
                          quantity: item.qty,
                          deliveryCharge: item.deliveryFee,
                          selectedVariations: item.selectedVariations,
                          deliveryMethod: item.shipmentOption,
                          paymentMethod: selectedPaymentMethod,
                          totalAmount:
                            parseFloat(subtotalPrice().toFixed(2)) +
                            parseFloat(item.deliveryFee.toFixed(2)),
                          type: "physical", // Add product type
                        })),
                        user: user._id,
                        status: "Delivered", // Assuming the status is set to "Delivered" for physical orders
                        payment: {
                          transactionId: transactionId,
                          type: "Physical",
                        },
                      };

                      await createOrder(orderDetails);
                    }

                    // After updating the wallet balance and creating the order, navigate to the home screen
                    setCurrentStep({ currentStep: 0 });
                    navigation.navigate("Home");
                  } catch (error) {
                    console.error("Error processing payment:", error);
                    // Show an alert box to notify the user about the error
                    window.alert(
                      "An error occurred while processing the payment. Please try again later."
                    );
                  }
                }}
              >
                <Text style={{ color: "#fff" }}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Next, Prev, Finish buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            {currentStep > 0 && currentStep < 4 && (
              <TouchableOpacity
                style={[
                  styles.centerElement,
                  {
                    marginVertical: 10,
                    left: 10,
                    width: 80,
                    height: 35,
                    backgroundColor: colors.primary,
                    elevation: 5,
                    borderRadius: 20,
                  },
                ]}
                onPress={() => {
                  if (currentStep > 0) {
                    setCurrentStep(currentStep - 1);
                  }
                }}
              >
                <Text style={{ color: "#fff" }}>Back</Text>
              </TouchableOpacity>
            )}
            {currentStep + 1 < steps.length /* add other conditions here */ && (
              <TouchableOpacity
                style={[
                  styles.centerElement,
                  {
                    marginVertical: 10,
                    right: 10,
                    width: 80,
                    height: 35,
                    backgroundColor: colors.primary,
                    elevation: 5,
                    borderRadius: 20,
                    marginLeft: 15,
                  },
                ]}
                onPress={() => {
                  // Check if a payment method is selected
                  if (currentStep === 2 && !selectedPaymentMethod) {
                    alert("Please select a payment method to proceed.");
                  } else if (
                    currentStep + 1 < steps.length &&
                    validateRequiredFields()
                  ) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    alert("Please fill in all required fields");
                  }
                }}
              >
                <Text style={{ color: "#fff" }}>Next</Text>
              </TouchableOpacity>
            )}

            {/* Call API to process payment */}
            {currentStep + 1 === steps.length && (
              <TouchableOpacity
                style={[
                  styles.centerElement,
                  {
                    marginVertical: 10,
                    right: 10,
                    width: 100,
                    height: 35,
                    backgroundColor: "#26d06e",
                    elevation: 5,
                    borderRadius: 20,
                  },
                ]}
                onPress={() => {
                  makePayment();
                }}
              >
                <Text style={{ color: "#fff" }}>Pay Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
export default Checkout;
