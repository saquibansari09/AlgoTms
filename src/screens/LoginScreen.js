import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
   Image,
   Animated,
     KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const logoScale = useRef(new Animated.Value(0.5)).current;
const logoOpacity = useRef(new Animated.Value(0)).current;
const [focusedInput, setFocusedInput] = useState("");

  const handleLogin = async () => {
    if (!employeeId || !password) {
      Alert.alert("Validation", "Please enter Employee ID and Password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://algotrack.in/algoTMS/api/Ticket/Login",
        {
          username: employeeId,
          password: password,
        },
      );

      console.log("Login Response:", response.data);

      if (response.data.success) {
        await AsyncStorage.setItem("UserID", response.data.userID);
        await AsyncStorage.setItem("CompanyID", response.data.companyID);
        await AsyncStorage.setItem("UserName", response.data.userName);
        await AsyncStorage.setItem("LoginID", response.data.loginID);

        Alert.alert("Success", response.data.message);

        navigation.replace("Home");
      } else {
        Alert.alert("Login Failed", response.data.message);
      }
    } catch (error) {
      console.log("Login Error:", error.response?.data || error.message);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Unable to connect to server",
      );
    } finally {
      setLoading(false);
    }
  };



useEffect(() => {
  Animated.parallel([
    Animated.timing(logoScale, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }),
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }),
  ]).start();
}, []);


  return (
    <View style={styles.container}>
  <Animated.View
  style={[
    styles.logoContainer,
    {
      opacity: logoOpacity,
      transform: [{ scale: logoScale }],
    },
  ]}
>
  <Image
    source={require("../../assets/algo-logo.png")}
    style={styles.logo}
    resizeMode="contain"
  />
</Animated.View>
      <Text style={styles.title}>ALGO TMS</Text>

      <Text style={styles.subtitle}>Create. Track. Resolve. 🚀</Text>

    <View
  style={[
    styles.inputContainer,
    focusedInput === "employee" && styles.inputContainerFocused,
  ]}
>
  <Ionicons
    name="person-outline"
    size={22}
    color={focusedInput === "employee" ? "#8B5E3C" : "#999"}
    style={styles.inputIcon}
  />

  <TextInput
    placeholder="Employee ID"
    value={employeeId}
    onChangeText={setEmployeeId}
    onFocus={() => setFocusedInput("employee")}
    onBlur={() => setFocusedInput("")}
    style={styles.input}
    autoCapitalize="none"
    placeholderTextColor="#999"
  />
</View>

      <View
  style={[
    styles.inputContainer,
    focusedInput === "password" && styles.inputContainerFocused,
  ]}
>
  <Ionicons
    name="lock-closed-outline"
    size={22}
    color={focusedInput === "password" ? "#8B5E3C" : "#999"}
    style={styles.inputIcon}
  />

  <TextInput
    placeholder="Password"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
    onFocus={() => setFocusedInput("password")}
    onBlur={() => setFocusedInput("")}
    style={styles.input}
    autoCapitalize="none"
    placeholderTextColor="#999"
  />

  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
    <Ionicons
      name={showPassword ? "eye-off-outline" : "eye-outline"}
      size={22}
      color={focusedInput === "password" ? "#8B5E3C" : "#666"}
    />
  </TouchableOpacity>
</View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>LOGIN</Text>
        )}
      </TouchableOpacity>
        <Text style={styles.version}>
        © 2026 ALGOTMS | Version 1.0.0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: "#f7f7f7",
  paddingHorizontal: 20,
  justifyContent: "center",
},

  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    color: "#8B5E3C",
    marginBottom: 5,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 15,
    color: "#8B5E3C",
    marginBottom: 35,
  },

  input: {
  flex: 1,
  height: 50,
  fontSize: 16,
  color: "#000",
  paddingVertical: 0,
},

 inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  paddingHorizontal: 14,
  height: 55,
  marginBottom: 15,
},

inputIcon: {
    marginRight: 10,
  },

  button: {
    backgroundColor: "#8B5E3C",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },

  logoContainer: {
  alignItems: "center",
},

logo: {
  width: 150,
  height: 120,
},
 version: {
    textAlign: "center",
    color: "#8B5E3C",
    marginTop: 30,
    fontSize: 12,
    letterSpacing: 1,
  },

  inputContainerFocused: {
    borderColor: "#8B5E3C",
  },
});
