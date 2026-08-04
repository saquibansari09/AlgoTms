import React, { useState, useEffect, useCallback } from "react";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function NewTicketsScreen() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [assetNo, setAssetNo] = useState("");
  const [storeName, setStoreName] = useState("");
  const [algoId, setAlgoId] = useState("");
  const [isScanned, setIsScanned] = useState(false);
  const [lastReportingDate, setLastReportingDate] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [contactNo, setContactNo] = useState("");

  const [ticketBy, setTicketBy] = useState("");
  const [remark, setRemark] = useState("");
  // const [description, setDescription] = useState("");
  const [visicooler, setVisicooler] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const [algoImage, setAlgoImage] = useState(null);
  const [firstImage, setFirstImage] = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const [firstImageTime, setFirstImageTime] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [gpsTime, setGpsTime] = useState("");
  

  useEffect(() => {
    if (route.params?.coolerData) {
      const item = route.params.coolerData;

      setAssetNo(item.assetNo);
      setStoreName(item.storeName);
      setAlgoId(item.algoId);
      setLocation(item.location);
      setLatitude(item.latitude);
      setLongitude(item.longitude);
      setLastReportingDate(item.lastReportingDate);

      setIsScanned(true); // QR Scan hua
    }
  }, [route.params]);

  // couting timer for 15 minutes
  useEffect(() => {
    let interval;

    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  //left 60 second function
  useEffect(() => {
    if (timeLeft === 60) {
      checkReportingStatus();
    }
  }, [timeLeft]);

  // camera function
  const openCamera = async (type) => {
    // ✅ Second Image ke liye 15 minute validation
    if (type === "second") {
      if (!firstImage) {
        alert("Please capture Cooler First Image first.");
        return;
      }

      if (timeLeft > 0) {
        alert("Please wait until the timer completes.");
        return;
      }
    }

    console.log("Before Camera");

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    console.log("After Camera");
    console.log(result);

    if (!result.canceled) {
      const asset = result.assets[0];

      const image = {
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `${type}_${Date.now()}.jpg`,
      };

      if (type === "algo") {
        setAlgoImage(image);
      }

      if (type === "first") {
        setFirstImage(image);
        setFirstImageTime(Date.now());

        setTimeLeft(15 * 60); // 15 minutes countdown start

        setTimeout(
          () => {
            checkReportingStatus();
          },
          14 * 60 * 1000,
        );
      }

      if (type === "second") {
        setSecondImage(image);
      }
    }
  };

  // search by enter cooler no function
  const getAssetDetails = async (coolerNo) => {
    try {
      const response = await axios.get(
        "https://algotrack.in/algoTMS/api/Ticket/GetAssetDetails",
        {
          params: {
            coolerNo: coolerNo,
          },
        },
      );

      if (response.data.success) {
        setStoreName(response.data.clientName);
        setAlgoId(response.data.algoID);
        setLocation(response.data.location);
        setLatitude(response.data.latitude);
        setLongitude(response.data.longitude);
        setLastReportingDate(response.data.lastReportingDate);
      } else {
        alert("Asset Not Found");
      }
    } catch (error) {
      console.log(error);
      alert("Asset Not Found");
    }
  };

  //checkReportingStatus function via date and time
  const checkReportingStatus = async () => {
    try {
      const response = await axios.get(
        "https://algotrack.in/algoTMS/api/Ticket/GetGpsDateTime",
        {
          params: {
            RegistrationNo: assetNo,
          },
        },
      );

      if (response.data.success) {
        const gpsDate = response.data.gpsDateTime;

        setGpsTime(gpsDate);

        if (gpsDate === lastReportingDate) {
          setStatusMessage("Non Reporting");
        } else {
          setStatusMessage("Reporting");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // save tickets function
  const saveTicket = async () => {
    if (!algoImage) {
      alert("Please capture Algo Image");
      return;
    }

    if (!firstImage) {
      alert("Please capture First Image");
      return;
    }

    if (!secondImage) {
      alert("Please capture Second Image");
      return;
    }
    try {
      if (!assetNo) {
        alert("Please scan barcode first");
        return;
      }

      const formData = new FormData();

      formData.append("coolerNo", assetNo);
      formData.append("algoID", algoId);
      formData.append("issuedBy", ticketBy);
      formData.append("mobNo", contactNo);
      formData.append("remark", remark);
      formData.append("userID", "6296971A-523C-4778-B9D5-59381B3B9A77");
      formData.append("companyID", "8");
      formData.append("visicoolerRestarted", visicooler);

      formData.append("Images", {
        uri: algoImage.uri,
        type: "image/jpeg",
        name: "algo.jpg",
      });

      formData.append("Images", {
        uri: firstImage.uri,
        type: "image/jpeg",
        name: "first.jpg",
      });

      formData.append("Images", {
        uri: secondImage.uri,
        type: "image/jpeg",
        name: "second.jpg",
      });

      formData._parts.forEach((item) => {
        console.log(item[0], item[1]);
      });

      const response = await axios.post(
        "https://algotrack.in/algoTMS/api/Ticket/SaveTicket",
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
        },
      );

      // console.log("Status :", response.status);
      // console.log("Response :", JSON.stringify(response.data));

      // Debug Alert
      // Alert.alert("API Response", JSON.stringify(response.data));

      if (response.data.success) {
        Alert.alert("Success", "Ticket Created Successfully", [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Home", {
                screen: "Open",
                params: {
                  refresh: Date.now(),
                },
              });
            },
          },
        ]);

        return;
      } else {
        Alert.alert(
          "Failed",
          response.data.message || "Unable to create ticket.",
        );
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        console.log("STATUS :", error.response.status);
        console.log("DATA :", JSON.stringify(error.response.data));

        Alert.alert("API Error", JSON.stringify(error.response.data));
      } else {
        console.log("MESSAGE :", error.message);

        Alert.alert("Network Error", error.message);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate("CameraScanner")}
      >
        <Text style={styles.scanButtonText}>Scan Barcode</Text>
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        <Text style={styles.label}>
          Asset No<Text style={styles.required}>*</Text>
        </Text>

        <TextInput
          style={styles.input}
          value={assetNo}
          placeholder="Enter Assets No"
          placeholderTextColor="#808080"
          onChangeText={(text) => {
            setAssetNo(text);

            if (text.trim().length === 14) {
              getAssetDetails(text.trim());
            }
          }}
          editable={!isScanned}
        />

        {/* Store Name */}
        <Text style={styles.label}>
          Store Name<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={storeName}
          editable={false}
          placeholder="Store Name"
          placeholderTextColor="#808080"
        />

        {/* Algo ID */}
        <Text style={styles.label}>
          Algo ID<Text style={styles.required}>*</Text>
          </Text>
        <TextInput
          style={styles.input}
          value={algoId}
          editable={false}
          placeholder="Enter Algo ID"
          placeholderTextColor="#808080"
        />
        <Text style={styles.label}>Last Reporting Date<Text style={styles.required}>*</Text>

        </Text>

        <TextInput
          style={styles.input}
          value={lastReportingDate}
          editable={false}
          placeholder="Enter Last Reporting Date"
          placeholderTextColor="#808080"
        />

        <Text style={styles.label}>Location<Text style={styles.required}>*</Text>

        </Text>

        <TextInput
          style={styles.input}
          value={location}
          editable={false}
          placeholder="Location"
          placeholderTextColor="#808080"
        />

        <Text style={styles.label}>
          Latitude<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={latitude}
          editable={false}
          placeholder="Latitude"
          placeholderTextColor="#808080"
        />

        <Text style={styles.label}>
          Longitude<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={longitude}
          editable={false}
          placeholder="Longitude"
          placeholderTextColor="#808080"
        />

        {/* Algo ID Image */}
        <Text style={styles.label}>
          Algo ID Image<Text style={styles.required}>*</Text>
        </Text>

        <TouchableOpacity
  style={styles.fileBtn}
  onPress={() => openCamera("algo")}
>
  <Ionicons name="camera-outline" size={30} color="#8B5E3C" />
</TouchableOpacity>

        {algoImage && (
          <Image source={{ uri: algoImage.uri }} style={styles.preview} />
        )}

        {/* Visicooler */}
        <Text style={styles.label}>
          Visicooler restarted or not?<Text style={styles.required}>*</Text>
        </Text>

        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => setVisicooler("Yes")}
            style={[styles.radio, visicooler === "Yes" && styles.radioActive]}
          >
            <Text>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setVisicooler("No")}
            style={[styles.radio, visicooler === "No" && styles.radioActive]}
          >
            <Text>No</Text>
          </TouchableOpacity>
        </View>

        {/* Ticket Raised By */}
        <Text style={styles.label}>
          Ticket Raised By<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={ticketBy}
          onChangeText={setTicketBy}
          placeholder="Enter name"
          placeholderTextColor="#808080"
        />

        {/* Conatct No */}
        <Text style={styles.label}>
          Contact No<Text style={styles.required}>*</Text>
        </Text>

        <TextInput
          style={styles.input}
          value={contactNo}
          onChangeText={setContactNo}
          placeholder="Enter Contact No"
          placeholderTextColor="#808080"
          keyboardType="phone-pad"
          maxLength={10}
        />

        {/* Remark */}
        <Text style={styles.label}>
          Remark<Text style={styles.required}>*</Text>
        </Text>

        <TextInput
          style={styles.remarkInput}
          value={remark}
          onChangeText={setRemark}
          placeholder="Enter Remark"
          placeholderTextColor="#808080"
          multiline
          textAlignVertical="top"
        />

        {/* Cooler First Image */}
        <Text style={styles.label}>
          Cooler First Image<Text style={styles.required}>*</Text>
        </Text>

        <TouchableOpacity
  style={styles.fileBtn}
  onPress={() => openCamera("first")}
>
  <Ionicons name="camera-outline" size={30} color="#8B5E3C" />
</TouchableOpacity>

        {firstImage && (
          <Image source={{ uri: firstImage.uri }} style={styles.preview} />
        )}

        {/* Cooler Second Image */}
        <Text style={styles.label}>
          Cooler Second Image After 15 Minutes{" "}
          <Text style={styles.required}>*</Text>
        </Text>

        {/* Countdown Timer */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
          }}
        >
          {firstImage && timeLeft > 0 && (
            <Text
              style={{
                color: "red",
                fontSize: 13,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Time Remaining:{" "}
              {`${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
                timeLeft % 60,
              ).padStart(2, "0")}`}
            </Text>
          )}

          {statusMessage !== "" && (
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Text
                style={{
                  color: statusMessage === "Reporting" ? "green" : "red",
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                {statusMessage}
              </Text>

              <Text
                style={{
                  color: "#000",
                  fontSize: 12,
                  marginTop: 5,
                }}
              >
                GPS Time : {gpsTime}
              </Text>
            </View>
          )}
        </View>
       <TouchableOpacity
  style={[styles.fileBtn, timeLeft > 0 && { backgroundColor: "#ccc" }]}
  disabled={timeLeft > 0}
  onPress={() => openCamera("second")}
>
  <Ionicons name="camera-outline" size={30} color="#8B5E3C" />
</TouchableOpacity>

        {secondImage && (
          <Image source={{ uri: secondImage.uri }} style={styles.preview} />
        )}

        {/* Save */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => {
            saveTicket();
          }}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginTop: 12,
    marginLeft: 2,
  },

  input: {
    height: 50, // Same height
    borderWidth: 0.5,
    borderColor: "#8B5E3C",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    color: "#000",
  },

  fileBtn: {
    height: 50,
    borderWidth: 0.5,
    borderColor: "#8B5E3C",
    borderRadius: 8,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 8,
  },

  radio: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 0.5,
    borderColor: "#8B5E3C",
    borderRadius: 8,
  },

  radioActive: {
    backgroundColor: "#dbeafe",
    borderColor: "#3b82f6",
  },

  saveBtn: {
    backgroundColor: "#8B5E3C",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },

  scanButton: {
    backgroundColor: "#8B5E3C",
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 0.5,
  },

  scanButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  remarkInput: {
    borderWidth: 0.5,
    borderColor: "#8B5E3C",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingTop: 12,
    height: 120,
    color: "#000",
  },

  preview: {
    width: "100%",
    height: 180,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },

  required: {
    color: "red",
    fontWeight: "bold",
  },
});
