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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NewTicketsScreen() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [assetNo, setAssetNo] = useState("");
  const [storeName, setStoreName] = useState("");
  const [algoId, setAlgoId] = useState("");
  const [isScanned, setIsScanned] = useState(false);
  const [lastReportingDate, setLastReportingDate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [contactNo, setContactNo] = useState("");

  const [ticketBy, setTicketBy] = useState("");
  const [remark, setRemark] = useState("");
  const [visicooler, setVisicooler] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  
  const [firstImage, setFirstImage] = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const [firstImageTime, setFirstImageTime] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [gpsTime, setGpsTime] = useState("");
  
  // ⭐ Tab change ya screen switch karne par exact bacha hua time calculate hoga
  useFocusEffect(
    useCallback(() => {
      const calculateRemainingTime = async () => {
        try {
          const targetTimeStr = await AsyncStorage.getItem("targetEndTime");
          if (targetTimeStr) {
            const targetTime = parseInt(targetTimeStr, 10);
            const currentTime = Date.now();
            const remainingSeconds = Math.floor((targetTime - currentTime) / 1000);

            if (remainingSeconds > 0) {
              setTimeLeft(remainingSeconds);
            } else {
              setTimeLeft(0);
              await AsyncStorage.removeItem("targetEndTime");
            }
          }
        } catch (error) {
          console.log("Error loading timer", error);
        }
      };

      calculateRemainingTime();
    }, [])
  );

  useEffect(() => {
    if (route.params?.coolerData) {
      const item = route.params.coolerData;

      setAssetNo(item.assetNo || "");
      setStoreName(item.storeName || "");
      setAlgoId(item.algoId || "");
      setLocation(item.location || "");
      setLatitude(item.latitude || "");
      setLongitude(item.longitude || "");
      setLastReportingDate(item.lastReportingDate || "");
      
      const scannedTemp = item.temperature || item.Temperature || "";
      setTemperature(scannedTemp);

      if (!scannedTemp && item.assetNo) {
        getAssetDetails(item.assetNo);
      }

      setIsScanned(true);
    }
  }, [route.params]);

  // ⭐ Continuous Ticker synced with Real Timestamp
  useEffect(() => {
    let interval;

    if (timeLeft > 0) {
      interval = setInterval(async () => {
        const targetTimeStr = await AsyncStorage.getItem("targetEndTime");
        if (targetTimeStr) {
          const targetTime = parseInt(targetTimeStr, 10);
          const remainingSeconds = Math.floor((targetTime - Date.now()) / 1000);

          if (remainingSeconds <= 0) {
            setTimeLeft(0);
            clearInterval(interval);
            await AsyncStorage.removeItem("targetEndTime");
          } else {
            setTimeLeft(remainingSeconds);
          }
        }
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

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      const image = {
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `${type}_${Date.now()}.jpg`,
      };

      if (type === "first") {
        setFirstImage(image);
        setFirstImageTime(Date.now());

        const duration = 10 * 60; // ⭐ 10 Minutes countdown start
        setTimeLeft(duration);

        // ⭐ Save target end time in local storage
        const targetEndTime = Date.now() + duration * 1000;
        await AsyncStorage.setItem("targetEndTime", targetEndTime.toString());

        setTimeout(
          () => {
            checkReportingStatus();
          },
          9 * 60 * 1000,
        );
      }

      if (type === "second") {
        setSecondImage(image);
      }
    }
  };

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
        setTemperature(response.data.temperature || "");
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

  const refreshReportingAndTemp = async () => {
    if (!assetNo) {
      alert("Please scan or enter Asset No first");
      return;
    }
    try {
      const response = await axios.get(
        "https://algotrack.in/algoTMS/api/Ticket/GetAssetDetails",
        {
          params: {
            coolerNo: assetNo,
          },
        },
      );

      if (response.data.success) {
        setLastReportingDate(response.data.lastReportingDate || "");
        setTemperature(response.data.temperature || "");
        alert("Last Reporting Date & Temperature refreshed!");
      } else {
        alert("Failed to refresh details");
      }
    } catch (error) {
      console.log(error);
      alert("Error refreshing details");
    }
  };

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

  const saveTicket = async () => {
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
      formData.append("temperature", temperature);
      formData.append("issuedBy", ticketBy);
      formData.append("mobNo", contactNo);
      formData.append("remark", remark);
      formData.append("userID", "6296971A-523C-4778-B9D5-59381B3B9A77");
      formData.append("companyID", "8");
      formData.append("visicoolerRestarted", visicooler);

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

      if (response.data.success) {
        await AsyncStorage.removeItem("targetEndTime"); // Clear timer storage on success

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
        Alert.alert("API Error", JSON.stringify(error.response.data));
      } else {
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

        {/* Last Reporting Date with Refresh Button */}
        <View style={styles.labelRow}>
          <Text style={styles.label}>
            Last Reporting Date<Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity onPress={refreshReportingAndTemp} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={20} color="#8B5E3C" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          value={lastReportingDate}
          editable={false}
          placeholder="Enter Last Reporting Date"
          placeholderTextColor="#808080"
        />

        {/* Temperature Field */}
        <Text style={styles.label}>
          Temperature<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={temperature}
          onChangeText={setTemperature}
          placeholder="Enter Temperature"
          placeholderTextColor="#808080"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Location<Text style={styles.required}>*</Text></Text>

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

        {/* Contact No */}
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
          Cooler Second Image After 10 Minutes{" "}
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

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 6,
  },

  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  refreshText: {
    color: "#8B5E3C",
    fontSize: 13,
    fontWeight: "bold",
  },

  input: {
    height: 50,
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
    backgroundColor: "#f5f5f5", // Optional: unselected background
  },

  radioActive: {
    backgroundColor: "#dbeafe", // Selected background color
    borderColor: "#3b82f6",     // Selected border color
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