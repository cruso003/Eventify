// CartPage.js
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useCart } from "../components/context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const CartPage = ({ navigation }) => {
  const [user, setUser] = useState(false);

  const getData = async () => {
    const userData = await AsyncStorage.getItem("userData");

    setUser(JSON.parse(userData));
  };
  useEffect(() => {
    getData();
  }, []);

  const handleCheckout = () => {
    // Filter out unchecked items from the cart
    const checkedItems = cart.filter((item) => item.checked);

    // If there are checked items, proceed to checkout
    if (checkedItems.length > 0) {
      navigation.navigate("Checkout", {
        cartItems: checkedItems,
        subtotal: subtotalPrice(checkedItems), // Corrected to use subtotalPrice
      });
    } else {
      // If no items are checked, display a message or handle the case accordingly
      Toast.show({
        type: "error",
        text1: "Check an item to checkout.",
        visibilityTime: 3000,
      });
    }
  };

  const {
    cart,
    allItemsChecked,
    selectHandler,
    selectHandlerAll,
    deleteHandler,
    quantityHandler,
    subtotalPrice,
    loading,
  } = useCart();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f6f6f6",
        //marginTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
      }}
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
          <Text style={{ fontSize: 18, color: "#000" }}>Cart</Text>
        </View>
      </View>

      {loading ? (
        <View style={[styles.centerElement, { height: 10 }]}>
          <ActivityIndicator size="large" color="#ef5739" />
        </View>
      ) : (
        <ScrollView>
          {cart &&
            cart.map((item, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  marginBottom: 2,
                  height: 120,
                }}
              >
                <View style={[styles.centerElement, { width: 60 }]}>
                  <TouchableOpacity
                    style={[styles.centerElement, { width: 32, height: 32 }]}
                    onPress={() => selectHandler(i, item.checked)}
                  >
                    <Ionicons
                      name={
                        item.checked == 1
                          ? "checkmark-circle"
                          : "checkmark-circle-outline"
                      }
                      size={25}
                      color={item.checked == 1 ? "#0faf9a" : "#aaaaaa"}
                    />
                  </TouchableOpacity>
                </View>
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
                      navigation.navigate("EventDetail", {
                        selectedEvent: item,
                      });
                    }}
                    style={{ paddingRight: 10 }}
                  >
                    <Image
                      source={{ uri: item?.event.imageUrl }}
                      style={[
                        styles.centerElement,
                        { height: 60, width: 60, backgroundColor: "#eeeeee" },
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
                      Event: {item?.event?.name}
                    </Text>

                    {item && item.event && (
                      <Text style={{ color: "#333333", marginBottom: 10 }}>
                        Ticket Type: {item?.ticketName}
                      </Text>
                    )}
                    <Text
                      numberOfLines={1}
                      style={{ color: "#333333", marginBottom: 10 }}
                    >
                      $
                      {item.salePrice
                        ? item.qty * item.salePrice
                        : item.qty * item.amount}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => quantityHandler("less", i)}
                        style={{ borderWidth: 1, borderColor: "#cccccc" }}
                      >
                        <MaterialIcons
                          name="remove"
                          size={22}
                          color="#cccccc"
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          borderTopWidth: 1,
                          borderBottomWidth: 1,
                          borderColor: "#cccccc",
                          paddingHorizontal: 7,
                          paddingTop: 3,
                          color: "#bbbbbb",
                          fontSize: 13,
                        }}
                      >
                        {item.qty}
                      </Text>
                      <TouchableOpacity
                        onPress={() => quantityHandler("more", i)}
                        style={{ borderWidth: 1, borderColor: "#cccccc" }}
                      >
                        <MaterialIcons name="add" size={22} color="#cccccc" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={[styles.centerElement, { width: 60 }]}>
                  <TouchableOpacity
                    style={[styles.centerElement, { width: 32, height: 32 }]}
                    onPress={() => deleteHandler(i)}
                  >
                    <Ionicons name="trash" size={25} color="#ee4d2d" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </ScrollView>
      )}

      {!loading && (
        <View
          style={{
            backgroundColor: "#fff",
            borderTopWidth: 2,
            borderColor: "#f6f6f6",
            paddingVertical: 5,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={[styles.centerElement, { width: 60 }]}>
              <View style={[styles.centerElement, { width: 32, height: 32 }]}>
                <MaterialCommunityIcons
                  name="ticket"
                  size={25}
                  color="#f0ac12"
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexGrow: 1,
                flexShrink: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>Voucher</Text>
              <View style={{ paddingRight: 20 }}>
                <TextInput
                  style={{
                    paddingHorizontal: 10,
                    backgroundColor: "#f0f0f0",
                    height: 25,
                    borderRadius: 4,
                  }}
                  placeholder="Enter voucher code"
                  value={""}
                  onChangeText={(searchKeyword) => {}}
                />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={[styles.centerElement, { width: 60 }]}>
              <TouchableOpacity
                style={[styles.centerElement, { width: 32, height: 32 }]}
                onPress={() => selectHandlerAll(allItemsChecked)}
              >
                <Ionicons
                  name={
                    allItemsChecked == true
                      ? "checkmark-circle"
                      : "checkmark-circle-outline"
                  }
                  size={25}
                  color={allItemsChecked == true ? "#0faf9a" : "#aaaaaa"}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexGrow: 1,
                flexShrink: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>Select All</Text>
              <View
                style={{
                  flexDirection: "row",
                  paddingRight: 20,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#8f8f8f" }}>SubTotal: </Text>
                <Text>${subtotalPrice().toFixed(2)}</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              height: 32,
              paddingRight: 20,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={[
                styles.centerElement,
                {
                  backgroundColor: "#0faf9a",
                  width: 125,
                  height: 35,
                  borderRadius: 5,
                },
              ]}
              onPress={handleCheckout}
            >
              <Text style={{ color: "#ffffff" }}>
                {user ? "Checkout" : "Login to Checkout"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  centerElement: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CartPage;
