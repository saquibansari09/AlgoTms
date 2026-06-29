import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "@react-navigation/native"; // ⭐ ADD

export default function CameraScanner() {
  const cameraRef = useRef(null);
const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const media = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(media.status === "granted");
    })();
  }, []);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Checking camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

const onBarcodeScanned = async ({ data }) => {
  if (scanned) return;

  setScanned(true);

  try {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
    });

    if (mediaPermission) {
      await MediaLibrary.saveToLibraryAsync(photo.uri);
    }

    navigation.navigate("Home", {
      screen: "New",
      params: {
        barcode: data,
        image: photo.uri,
      },
    });

  } catch (e) {
    Alert.alert("Error", e.message);
    setScanned(false);
  }
};

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "ean13",
            "ean8",
            "code128",
            "code39",
            "code93",
            "upc_a",
            "upc_e",
          ],
        }}
        onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
      />

      <View style={styles.overlay}>
        <View style={styles.box} />

        <Text style={styles.scanText}>
          Point camera towards barcode
        </Text>

        <TouchableOpacity
  style={styles.cancel}
  onPress={() => navigation.goBack()}
>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  camera: {
    flex: 1,
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#00ff00",
    borderRadius: 12,
    backgroundColor: "transparent",
  },

  scanText: {
    color: "#fff",
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },

  cancel: {
    position: "absolute",
    bottom: 60,
    backgroundColor: "#8B5E3C",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },

  cancelText: {
    color: "#fff",
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#8B5E3C",
    padding: 15,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});