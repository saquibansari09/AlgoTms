import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

// ✅ Fake API
const fakeLoginAPI = (employeeId, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (employeeId === "admin" && password === "1234") {
        resolve({
          status: true,
          message: "Login Success",
          user: {
            name: "Admin User",
            id: employeeId,
          },
        });
      } else {
        reject({
          status: false,
          message: "Invalid Employee ID or Password",
        });
      }
    }, 1500);
  });
};

export default function LoginScreen({ navigation }) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!employeeId || !password) {
      alert("Please enter Employee ID and Password");
      return;
    }

    setLoading(true);

    try {
      const res = await fakeLoginAPI(employeeId, password);

      console.log("Login Success:", res);

      navigation.replace("Home");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>ALGO TMS</Text>
      <Text style={styles.subtitle}>Smart Field Operations System</Text>

      <TextInput
        placeholder="Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor="#999"
      />

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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
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
    fontSize: 14,
    color: "#666",
    marginBottom: 40,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    elevation: 2,
  },

  button: {
    backgroundColor: "#8B5E3C",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },
});