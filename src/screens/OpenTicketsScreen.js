import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
    Modal,
  Pressable,
} from "react-native";
import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import React, { useState, useEffect} from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";





export default function OpenTicketsScreen() {
  const navigation = useNavigation(); // ✅ ADD THIS
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const route = useRoute();
  
const { width, height } = Dimensions.get("window");
const [selectedImages, setSelectedImages] = useState([]);
 const [modalVisible, setModalVisible] = useState(false);


  // fetching api
  const getOpenTickets = async () => {
    try {
      console.log("API Calling...");

      const response = await axios.get(
        "https://algotrack.in/algoTMS/api/Ticket/GetOpenTickets",
        {
          params: {
            CompanyID: 8,
            UserID: "6296971A-523C-4778-B9D5-59381B3B9A77",
          },
        },
      );

      console.log("API Response:", response.data);

      console.log("Status :", response.status);
      console.log("Response :", JSON.stringify(response.data));

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.log("Message :", err.message);

      if (err.response) {
        console.log("Server :", err.response.data);
      }

      if (err.request) {
        console.log("No Response From Server");
      }
    }
  };

 useEffect(() => {
  if (route.params?.refresh) {
    getOpenTickets();
  }
}, [route.params?.refresh]);
  useFocusEffect(
  React.useCallback(() => {
    getOpenTickets();
  }, [])
);

  // Searching filter condition uppper and lower and cameleCase
  const filteredData = data.filter((item) =>
    item.registrationNo?.toLowerCase().includes(search.toLowerCase()),
  );

const renderItem = ({ item }) => (
  <View style={styles.row}>
    <Text style={styles.cell}>{item.ticketID}</Text>
    <Text style={styles.cell}>{item.registrationNo}</Text>
    <Text style={styles.cell}>{item.clientName}</Text>
    <Text style={styles.cell}>{item.location}</Text>
    <Text style={styles.cell}>{item.region}</Text>
    <Text style={styles.cell}>{item.algoID}</Text>
    <Text style={styles.cell}>{item.restartCooler}</Text>
    <Text style={styles.cell}>{item.subject}</Text>
    <Text style={styles.cell}>{item.issuedBy}</Text>
    <Text style={styles.cell}>{item.created}</Text>
    <Text style={styles.cell}>{item.status}</Text>

 <View
  style={[
    styles.cell,
    {
      width: 120,
      justifyContent: "center",
      alignItems: "center",
    },
  ]}
>
  {item.gallery && item.gallery.length > 0 ? (
    <TouchableOpacity
onPress={() => {
  console.log(item.gallery);

  setSelectedImages(item.gallery);
  setModalVisible(true);

}}
>
  <Text style={styles.viewLink}>View</Text>
</TouchableOpacity>
  ) : (
    <Text>No Image</Text>
  )}
</View>
  </View>
);

  // downloadexcel file code
  const downloadExcel = async () => {
    try {
      const headers = [
        "Ticket ID",
        "Registration No",
        "Client Name",
        "Location",
        "Region",
        "Algo ID",
        "Restart Cooler",
        "Subject",
        "Issued By",
        "Created",
        "Status",
        "Gallery",
      ];
      let csv = headers.join(",") + "\n";

     filteredData.forEach((item) => {
  csv += [
    `"${item.ticketID}"`,
    `"${item.registrationNo}"`,
    `"${item.clientName}"`,
    `"${item.location}"`,
    `"${item.region}"`,
    `"${item.algoID}"`,
    `"${item.restartCooler}"`,
    `"${item.subject}"`,
    `"${item.issuedBy}"`,
    `"${item.created}"`,
    `"${item.status}"`,
    `"${item.gallery ? item.gallery.length : 0}"`,
  ].join(",") + "\n";
});

      const fileUri = FileSystem.cacheDirectory + "OpenTickets.csv";

      await FileSystem.writeAsStringAsync(fileUri, csv);

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.log("Excel Error:", error);
    }
  };

  // download for pdf
  const downloadPDF = async () => {
    try {
   let rows = "";

filteredData.forEach((item) => {
  rows += `
<tr>
<td>${item.ticketID ?? ""}</td>
<td>${item.registrationNo ?? ""}</td>
<td>${item.clientName ?? ""}</td>
<td>${item.location ?? ""}</td>
<td>${item.region ?? ""}</td>
<td>${item.algoID ?? ""}</td>
<td>${item.restartCooler ?? ""}</td>
<td>${item.subject ?? ""}</td>
<td>${item.issuedBy ?? ""}</td>
<td>${item.created ?? ""}</td>
<td>${item.status ?? ""}</td>
<td>${item.gallery?.length ?? 0}</td>
</tr>
`;
});
      
const html = `
<html>
<head>
<style>
  @page {
    size: A3 landscape;
    margin: 10px;
  }

  body{
    font-family: Arial, sans-serif;
    font-size:10px;
    padding:10px;
  }

  h2{
    text-align:center;
    margin-bottom:15px;
  }

  table{
    width:100%;
    border-collapse:collapse;
    table-layout:fixed;
  }

  th,td{
    border:1px solid #000;
    padding:6px;
    text-align:center;
    word-wrap:break-word;
    font-size:9px;
  }

  th{
    background:#d9d9d9;
  }
</style>
</head>

<body>

<h2>Open Tickets</h2>

<table>

<thead>
<tr>
<th>Ticket ID</th>
<th>Registration No</th>
<th>Client Name</th>
<th>Location</th>
<th>Region</th>
<th>Algo ID</th>
<th>Restart Cooler</th>
<th>Subject</th>
<th>Issued By</th>
<th>Created</th>
<th>Status</th>
<th>Gallery</th>
</tr>
</thead>

<tbody>

${rows}

</tbody>

</table>

</body>
</html>
`;
     const { uri } = await Print.printToFileAsync({
  html,
  
});
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log("PDF Error:", error);
    }
  };

  return (
    <View style={styles.container}>

<View style={styles.headingContainer}>
  {/* Left Side */}
  <View style={styles.headingLeft}>
    <View style={styles.leftBorder} />
    <Text style={styles.heading}>Open Tickets</Text>
  </View>

  {/* Right Side */}
<View style={styles.topBar}>
  {/* New */}
  <TouchableOpacity
    style={styles.btn}
    onPress={() =>
      navigation.navigate("Home", {
        screen: "New",
      })
    }
  >
    <Ionicons
      name="add-circle"
      size={28}
      color="#8B5E3C"
    />
  </TouchableOpacity>

  {/* Excel */}
  <TouchableOpacity
    style={styles.btn}
    onPress={downloadExcel}
  >
    <Ionicons
      name="grid"
      size={28}
      color="green"
    />
  </TouchableOpacity>

  {/* PDF */}
  <TouchableOpacity
    style={styles.btn}
    onPress={downloadPDF}
  >
    <Ionicons
      name="document-text"
      size={28}
      color="red"
    />
  </TouchableOpacity>
</View>
</View>

      {/* 🔍 SEARCH BAR */}
<View style={styles.searchBox}>
  <Ionicons
    name="search"
    size={20}
    color="#8B5E3C"
    style={styles.searchIcon}
  />

  <TextInput
    style={styles.input}
    value={search}
    onChangeText={setSearch}
    placeholder="Search ticket..."
    placeholderTextColor="#8B5E3C"
  />
</View>

      {/* 🔥 TABLE */}
      <ScrollView horizontal>
        <View>
          {/* HEADER */}
          <View style={[styles.row, styles.header]}>
            <Text style={styles.headerCell}>Ticket ID</Text>
            <Text style={styles.headerCell}>Registration No</Text>
            <Text style={styles.headerCell}>Client Name</Text>
            <Text style={styles.headerCell}>Location</Text>
            <Text style={styles.headerCell}>Region</Text>
            <Text style={styles.headerCell}>Algo ID</Text>
            <Text style={styles.headerCell}>Restart Cooler</Text>
            <Text style={styles.headerCell}>Subject</Text>
            <Text style={styles.headerCell}>Issued By</Text>
            <Text style={styles.headerCell}>Created</Text>
            <Text style={styles.headerCell}>Status</Text>
            <Text style={styles.headerCell}>Gallery</Text>
          </View>

          {/* ROWS */}
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.ticketID.toString()}
          />
        </View>
      </ScrollView>
   <Modal
  visible={modalVisible}
  transparent={true}
  animationType="fade"
>
  <View style={styles.modalContainer}>
    <Pressable
      style={styles.closeBtn}
      onPress={() => setModalVisible(false)}
    >
      <Text style={{ color: "#fff", fontSize: 18 }}>✕</Text>
    </Pressable>

 <FlatList
  data={selectedImages}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <View
      style={{
        width: width,
        height: height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: item }}
        style={{
          width: width * 0.9,
          height: height * 0.75,
        }}
        resizeMode="contain"
      />
    </View>
  )}
/>
  </View>
</Modal>
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
  paddingVertical: 4,
  paddingHorizontal: 12,
  borderWidth: 0.5,
   borderColor: "#8B5E3C",
  borderRadius: 8,
  backgroundColor: "#f5f5f5",
  marginLeft: 8,
},

  searchBox: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderWidth: 0.5,
   borderColor: "#8B5E3C",
  borderRadius: 8,
  paddingHorizontal: 10,
  marginVertical: 10,
},

searchIcon: {
  marginRight: 8,
},

input: {
  flex: 1,
  height: 45,
  color: "#000",
  fontSize: 15,
},

  header: {
    backgroundColor: "#8B5E3C",
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

 headingContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
},

headingLeft: {
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
},

leftBorder: {
  width: 5,
  height: 28,
  backgroundColor: "#8B5E3C",
  borderRadius: 3,
  marginRight: 8,
},


heading: {
  fontSize: 15,
  fontWeight: "bold",
  color: "#333",
},
topBar: {
  flexDirection: "row",
  alignItems: "center",
},
galleryCell: {
  width: 120,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#eee",
},
viewLink: {
  color: "#007AFF",
  fontWeight: "bold",
  textDecorationLine: "underline",
  textAlign: "center",
},

modalContainer: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.95)",
  justifyContent: "center",
  alignItems: "center",
},


closeBtn: {
  position: "absolute",
  top: 50,
  right: 20,
  zIndex: 100,
},
});
