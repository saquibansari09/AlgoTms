import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";

export default function OpenTicketsScreen() {
  const [search, setSearch] = useState("");

  const [data] = useState([
    {
      id: "1",
      ticketNo: "T001",
      assetNo: "A101",
      storeName: "Reliance Store",
      location: "Mumbai",
      region: "West",
      algoId: "ALG123",
      coolerRestart: "Yes",
      remark: "OK",
      createdBy: "Admin",
      createdOn: "2026-06-26",
      status: "Open",
      gallery: "View",
    },
  ]);

  const filteredData = data.filter((item) =>
    item.ticketNo.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.ticketNo}</Text>
      <Text style={styles.cell}>{item.assetNo}</Text>
      <Text style={styles.cell}>{item.storeName}</Text>
      <Text style={styles.cell}>{item.location}</Text>
      <Text style={styles.cell}>{item.region}</Text>
      <Text style={styles.cell}>{item.algoId}</Text>
      <Text style={styles.cell}>{item.coolerRestart}</Text>
      <Text style={styles.cell}>{item.remark}</Text>
      <Text style={styles.cell}>{item.createdBy}</Text>
      <Text style={styles.cell}>{item.createdOn}</Text>
      <Text style={styles.cell}>{item.status}</Text>

      {/* ✅ ADDED GALLERY COLUMN */}
      <Text style={styles.cell}>{item.gallery}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* 🔝 TOP BUTTON BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.btn}>
          <Text>New</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}>
          <Text>Excel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}>
          <Text>PDF</Text>
        </TouchableOpacity>
      </View>

      {/* 🔍 SEARCH BAR */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Search ticket..."
        />
      </View>

      {/* 🔥 TABLE */}
      <ScrollView horizontal>
        <View>

          {/* HEADER */}
          <View style={[styles.row, styles.header]}>
            <Text style={styles.headerCell}>Ticket No</Text>
            <Text style={styles.headerCell}>Asset No</Text>
            <Text style={styles.headerCell}>Store Name</Text>
            <Text style={styles.headerCell}>Location</Text>
            <Text style={styles.headerCell}>Region</Text>
            <Text style={styles.headerCell}>Algo ID</Text>
            <Text style={styles.headerCell}>Cooler Restart</Text>
            <Text style={styles.headerCell}>Remark</Text>
            <Text style={styles.headerCell}>Created By</Text>
            <Text style={styles.headerCell}>Created On</Text>
            <Text style={styles.headerCell}>Status</Text>

            {/* ✅ MATCHING HEADER */}
            <Text style={styles.headerCell}>Gallery</Text>
          </View>

          {/* ROWS */}
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />

        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },

  topBar: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },

  searchBox: {
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
  },

  header: {
    backgroundColor: "#eee",
  },

  row: {
    flexDirection: "row",
  },

  headerCell: {
    width: 120,
    fontWeight: "bold",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  cell: {
    width: 120,
    padding: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
});