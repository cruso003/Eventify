import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, TouchableRipple, Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import { images } from "../constants";
import Email from "react-native-vector-icons/MaterialCommunityIcons";
import Profession from "react-native-vector-icons/AntDesign";
import Gender from "react-native-vector-icons/Foundation";
import Mobile from "react-native-vector-icons/Entypo";
import Business from "react-native-vector-icons/Ionicons";
import Role from "react-native-vector-icons/FontAwesome5";
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import users from "../api/users";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(false);

  const getData = async () => {
    const userData = await AsyncStorage.getItem("userData");

    setUser(JSON.parse(userData));
  };
  useEffect(() => {
    getData();
  }, []);

  const fetchUser = async () => {
    const userA = await AsyncStorage.getItem("userData");
    const parsedUser = JSON.parse(userA);
    const userId = parsedUser._id;
    try {
      setLoading(true);
      const response = await users.getUserById(userId);
      const updatedUser = response?.data?.data;
      if (updatedUser) {
        // Check if updatedUser is not undefined
        setUser(updatedUser);
      } else {
        console.log("Updated user data is undefined");
      }
    } catch (error) {
      console.error("Error fetching updated user details: ", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUser(); // Refresh user data whenever the screen gains focus
    }, [])
  );

  const handleScanQRCode = () => {
    // Handle scanning QR code
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={images.background}
        style={styles.backgroundImage}
      >
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}
          >
            <Mobile name="menu" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => {
              navigation.navigate("UpdateProfile", { data: user });
            }}
          >
            <Icon5 name="user-edit" size={24} color={"white"} />
          </TouchableOpacity>
          <Image
            width={100}
            height={60}
            resizeMode="contain"
            style={{
              marginTop: -200,
            }}
            source={require("../assets/wave.png")}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Avatar.Image
            size={180}
            style={styles.avatar}
            source={{
              uri:
                user?.avatar == "" || user?.avatar == null
                  ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC"
                  : user?.avatar,
            }}
          />
        </View>

        <View style={{ marginTop: -50 }}>
          <Text style={styles.nameText}>{user?.name}</Text>
        </View>
        <View style={{ marginTop: 20, marginHorizontal: 25 }}>
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View
                style={[styles.infoIconCont, { backgroundColor: "#ff9500" }]}
              >
                <Email name="email" size={24} style={{ color: "white" }} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Email</Text>
                <Text style={styles.infoLarge_Text} numberOfLines={1}>
                  {user?.email}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View
                style={[styles.infoIconCont, { backgroundColor: "#0d7313" }]}
              >
                <Gender
                  name="torsos-male-female"
                  size={28}
                  color="blue"
                  style={{ color: "white" }}
                />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Sex</Text>
                <Text style={styles.infoLarge_Text}>
                  {user?.sex == "" ||
                  user?.sex == undefined ||
                  user?.sex == null
                    ? ""
                    : user?.sex}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View
                style={[styles.infoIconCont, { backgroundColor: "#774BBC" }]}
              >
                <Profession
                  name="profile"
                  size={24}
                  style={{ color: "white" }}
                />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Profession</Text>
                <Text style={styles.infoLarge_Text}>
                  {user?.profession == "" ||
                  user?.profession == undefined ||
                  user?.profession == null
                    ? ""
                    : user?.profession}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View
                style={[styles.infoIconCont, { backgroundColor: "#f2276e" }]}
              >
                <Mobile name="mobile" size={24} style={{ color: "white" }} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Mobile</Text>
                <Text style={styles.infoLarge_Text}>
                  {user?.phoneNumber ? user?.phoneNumber : ""}
                </Text>
              </View>
            </View>
          </View>
          {user?.role === "organizer" ? (
            <View style={styles.infoMain}>
              <View style={styles.infoCont}>
                <View
                  style={[styles.infoIconCont, { backgroundColor: "indigo" }]}
                >
                  <Business
                    name="business-sharp"
                    size={24}
                    style={{ color: "white" }}
                  />
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoSmall_Text}>Company</Text>
                  <Text style={styles.infoLarge_Text}>
                    {user?.businessName ? user?.businessName : ""}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, { backgroundColor: "gray" }]}>
                <Role name="user-tag" size={24} style={{ color: "white" }} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Role</Text>
                <Text style={styles.infoLarge_Text}>
                  {user?.role ? user?.role : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ paddingBottom: 150 }}></View>
      </ImageBackground>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    paddingTop: 50,
    paddingBottom: 30,
  },
  centerElement: { justifyContent: "center", alignItems: "center" },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 15,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
    color: "gray",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    color: "white",
    marginLeft: 20,
  },
  infoBoxWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 30,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#777777",
  },
  infoBox: {
    width: "30%",
    backgroundColor: "#333333",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#777777",
  },
  menuItemText: {
    color: "#FF6347",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
  walletBoxWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  walletBox: {
    backgroundColor: "cyan",
    borderRadius: 10,
    padding: 20,
    flex: 1,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editIcon: {
    zIndex: 1,
    color: "white",
    position: "absolute",
    right: 2,
    margin: 15,
  },
  avatar: {
    borderRadius: 100,
    marginTop: -250,
    // marginLeft: 105,
    backgroundColor: "white",
    height: 200,
    width: 200,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  // 420475
  nameText: {
    color: "white",
    fontSize: 28,

    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "center",
  },
  backIcon: {
    zIndex: 1,
    color: "white",
    position: "absolute",
    left: 2,
    margin: 15,
  },
  infoCont: {
    width: "100%",
    flexDirection: "row",
  },
  infoIconCont: {
    justifyContent: "center",
    height: 40,
    width: 40,
    borderRadius: 20,

    alignItems: "center",
    elevation: -5,
    borderColor: "black",
    backgroundColor: "black",
  },

  infoText: {
    width: "80%",
    flexDirection: "column",
    marginLeft: 25,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: "#e6e6e6",
  },
  infoSmall_Text: {
    fontSize: 13,
    color: "#b3b3b3",
    fontWeight: "500",
  },
  infoLarge_Text: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
