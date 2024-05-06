import { Dimensions, StyleSheet } from "react-native";
import colors from "../../config/colors";

const height = Dimensions.get("window").height * 1;
export default StyleSheet.create({
  loading: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    height: 1000,
  },
  button: {
    alignItems: "center",
    marginTop: 0,
    alignItems: "center",
    textAlign: "center",
    marginTop: 30,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  inBut: {
    width: "70%",
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
  },
  header: {
    backgroundColor: "#0163D2",
    flexDirection: "row",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    //borderRadius: 80,
    marginTop: 50,
    backgroundColor: "white",
    height: 160,
    width: 350,
    padding: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    elevation: 4,
    //justifyContent: "center",
    //alignItems: "center",
  },
  camDiv: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  camIconDiv: {
    position: "absolute",
    right: 80,
    zIndex: 1,
    bottom: 5,
    height: 56,
    width: 56,
    backgroundColor: "#0163D2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },
  cameraIcon: {
    color: "white",
  },
  backIcon: {
    marginLeft: 20,
    color: "white",
  },
  nameText: {
    color: "white",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "center",
  },
  infoEditView: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#e6e6e6",
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  infoEditFirst_text: {
    color: "#7d7c7c",
    fontSize: 16,
    fontWeight: "400",
  },
  infoEditSecond_text: {
    color: "white",
    fontStyle: "normal",
    fontSize: 15,
    textAlignVertical: "center",
    textAlign: "right",
  },
  multiLineTextInput: {
    borderWidth: 1,
    //borderColor: "#ccc",
    width: "75%",
    borderRadius: 5,
    padding: 10,
    marginTop: 8,
    minHeight: 100, // Adjust the height as needed
    textAlignVertical: "center", // This property ensures that the text starts from the top
  },
  descriptionText: {
    color: "white",
    fontStyle: "normal",
    fontSize: 15,
    textAlignVertical: "center",
    textAlign: "center",
  },
  radioView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  radioText: {
    color: "white",
    fontSize: 15,
  },
  picker: {
    width: "80%",
    backgroundColor: "white",
    color: "black",
    borderRadius: 20,
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontSize: 14,
    marginBottom: 10,
  },

  pickerContainer: {
    backgroundColor: "white", // Set the background color of the DateTimePicker container
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  dateLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
});
