import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function NewTicketsScreen() {
  const [assetNo, setAssetNo] = useState("");
  const [ticketBy, setTicketBy] = useState("");
  const [remark, setRemark] = useState("");
  const [description, setDescription] = useState("");
  const [visicooler, setVisicooler] = useState("");

  const navigation = useNavigation();
const route = useRoute();



useEffect(() => {
  if (route.params?.barcode) {
    setAssetNo(route.params.barcode);
  }
}, [route.params]);


  return (
    <View style={{ flex: 1 }}>

        <TouchableOpacity
  style={styles.scanButton}
  onPress={() => navigation.navigate("CameraScanner")}
>
  <Text style={styles.scanButtonText}>Read Barcode</Text>
</TouchableOpacity>
      <ScrollView style={styles.container}>
        {/* Asset No */}
        {/* <Text style={styles.label}>Asset No *</Text>

        <View style={styles.pickerContainer}>
         <TextInput
  style={styles.input}
  value={assetNo}
  placeholder="Scan Barcode"
  editable={false}
/> */}

<View style={styles.pickerContainer}>
  <Picker
    style={styles.picker}
    selectedValue={assetNo}
    onValueChange={(itemValue) => setAssetNo(itemValue)}
  >
    <Picker.Item label="Select Asset No" value="" />
    <Picker.Item label="AST001" value="AST001" />
    <Picker.Item label="AST002" value="AST002" />
    <Picker.Item label="AST003" value="AST003" />
    <Picker.Item label="AST004" value="AST004" />
    <Picker.Item label="AST005" value="AST005" />
  </Picker>
</View>
       

        {/* Store Name */}
        <Text style={styles.label}>Store Name</Text>
        <TextInput style={styles.input} placeholder="Enter Store Name" />

        {/* Algo ID */}
        <Text style={styles.label}>Algo ID *</Text>
        <TextInput style={styles.input} placeholder="Enter Algo ID" />

        {/* Algo ID Image */}
        <Text style={styles.label}>Algo ID Image *</Text>
        <TouchableOpacity style={styles.fileBtn}>
          <Text>Choose File</Text>
        </TouchableOpacity>

        {/* Visicooler */}
        <Text style={styles.label}>Visicooler restarted or not? *</Text>

        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => setVisicooler("Yes")}
            style={[
              styles.radio,
              visicooler === "Yes" && styles.radioActive,
            ]}
          >
            <Text>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setVisicooler("No")}
            style={[
              styles.radio,
              visicooler === "No" && styles.radioActive,
            ]}
          >
            <Text>No</Text>
          </TouchableOpacity>
        </View>

        {/* Ticket Raised By */}
        <Text style={styles.label}>Ticket Raised By *</Text>
        <TextInput
          style={styles.input}
          value={ticketBy}
          onChangeText={setTicketBy}
          placeholder="Enter name"
        />

        {/* Remark */}
        <Text style={styles.label}>Remark *</Text>
        <TextInput
          style={styles.input}
          value={remark}
          onChangeText={setRemark}
          placeholder="Enter remark"
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Enter description"
        />

        {/* Cooler First Image */}
        <Text style={styles.label}>Cooler First Image *</Text>
        <TouchableOpacity style={styles.fileBtn}>
          <Text>Choose File</Text>
        </TouchableOpacity>

        {/* Cooler Second Image */}
        <Text style={styles.label}>
          Cooler Second Image After 15 Minutes *
        </Text>
        <TouchableOpacity style={styles.fileBtn}>
          <Text>Choose File</Text>
        </TouchableOpacity>

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginTop: 12,
    marginLeft: 2,
  },

  pickerContainer: {
    height: 50, // Same height as TextInput
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    overflow: "hidden",
  },

  picker: {
    height: 50,
    width: "100%",
  },

  input: {
    height: 50, // Same height
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
  },

  fileBtn: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
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
    borderWidth: 1,
    borderColor: "#ccc",
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
    marginBottom: 15,
    marginTop: 0.5,
  },

  scanButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});