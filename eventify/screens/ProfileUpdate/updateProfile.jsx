import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { ActivityIndicator, Avatar } from "react-native-paper";
import styles from "./profileEditStyles";
import Back from "react-native-vector-icons/Ionicons";
import { RadioButton } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import users from "../../api/users";
import * as ImagePicker from "expo-image-picker";

function UpdateProfile() {
  const navigation = useNavigation();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [profession, setProfession] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const route = useRoute();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      let newFile = {
        uri: result.assets[0].uri,
        type: `file/${result.assets[0].uri.split(".")[1]}`,
        name: `file.${result.assets[0].uri.split(".")[1]}`,
      };
      uploadToCloud(newFile);
    }
  };

  useEffect(() => {
    const user = route.params.data;
    setEmail(user.email);
    setGender(user.sex);
    setImage(user.avatar);
    setProfession(user.profession);
    setName(user.name);
    setPhoneNumber(String(user.phoneNumber));
    setBusinessName(user.businessName);
  }, []);

  const uploadToCloud = (image) => {
    setLoading(true); // Set loading state to true
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Eventify");
    data.append("cloud_name", "dl43pywkr");

    fetch("https://api.cloudinary.com/v1_1/dl43pywkr/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to upload image to cloud");
        }
        return res.json();
      })
      .then((data) => {
        setImage(data.url);
        setLoading(false); // Set loading state to false after image is uploaded
      })
      .catch((error) => {
        setLoading(false); // Set loading state to false in case of error
        Toast.show({
          type: "error",
          text1: "Failed to upload image",
          visibilityTime: 5000,
        });
      });
  };

  const updateProfile = async () => {
    setLoading(true); // Set loading state to true before initiating the update process
    const formData = {
      name,
      avatar: image,
      email,
      profession,
      phoneNumber,
      sex: gender,
      businessName,
    };
    try {
      const res = await users.updateUser(email, formData);
      if (res.data.success) {
        Toast.show({
          type: "success",
          text1: "Updated",
          visibilityTime: 5000,
        });
      }

      setLoading(false); // Set loading state to false after the update process is completed
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to update profile",
        visibilityTime: 5000,
      });
      setLoading(false); // Set loading state to false in case of an error during the update process
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={"always"}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      style={{ backgroundColor: "black" }}
    >
      <View>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Back name="arrow-back" size={30} style={styles.backIcon} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 3 }}>
            <Text style={styles.nameText}>Edit Profile</Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
        <View style={styles.camDiv}>
          <View style={styles.camIconDiv}>
            <Back name="camera" size={22} style={styles.cameraIcon} />
          </View>

          <TouchableOpacity onPress={pickImage}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Avatar.Image
                size={140}
                style={styles.avatar}
                source={{
                  uri:
                    image == "" || image == null
                      ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC"
                      : image,
                }}
              />
            )}
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 50,
            marginHorizontal: 22,
          }}
        >
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Full Name</Text>
            <TextInput
              placeholder="Your Name"
              placeholderTextColor={"#999797"}
              style={styles.infoEditSecond_text}
              onChange={(e) => setName(e.nativeEvent.text)}
              defaultValue={name}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Email</Text>
            <TextInput
              editable={false}
              placeholder="Your Email"
              placeholderTextColor={"#999797"}
              style={styles.infoEditSecond_text}
              onChange={(e) => setEmail(e.nativeEvent.text)}
              defaultValue={email}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Sex</Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.radioView}>
                <Text style={styles.radioText}>Male</Text>
                <RadioButton
                  value="Male"
                  status={gender === "Male" ? "checked" : "unchecked"}
                  onPress={() => {
                    setGender("Male");
                  }}
                />
              </View>
              <View style={styles.radioView}>
                <Text style={styles.radioText}>Female</Text>
                <RadioButton
                  value="Female"
                  status={gender === "Female" ? "checked" : "unchecked"}
                  onPress={() => {
                    setGender("Female");
                  }}
                />
              </View>
            </View>
          </View>
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Profession</Text>
            <TextInput
              placeholder="Profession"
              placeholderTextColor={"#999797"}
              keyboardType="name-phone-pad"
              maxLength={20}
              style={styles.infoEditSecond_text}
              onChange={(e) => setProfession(e.nativeEvent.text)}
              defaultValue={profession}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Mobile No</Text>
            <TextInput
              placeholder="Your Mobile No"
              placeholderTextColor={"#999797"}
              keyboardType="numeric"
              maxLength={10}
              style={styles.infoEditSecond_text}
              onChange={(e) => setPhoneNumber(e.nativeEvent.text)}
              defaultValue={phoneNumber}
            />
          </View>
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Company</Text>
            <TextInput
              placeholder="Your Company Name"
              placeholderTextColor={"#999797"}
              keyboardType="name-phone-pad"
              style={styles.infoEditSecond_text}
              onChange={(e) => setBusinessName(e.nativeEvent.text)}
              defaultValue={businessName}
            />
          </View>
        </View>
        <View style={styles.button}>
          {loading ? (
            <TouchableOpacity onPress={{}} style={styles.inBut}>
              <View>
                <Text style={styles.textSign}>Uploading</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => updateProfile()}
              style={styles.inBut}
            >
              <View>
                <Text style={styles.textSign}>Update Profile</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default UpdateProfile;
