import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      {/* Company Logo */}
       <Image
       source={require("../../assets/logo.png")}
       style={{
         width: 170,
         height: 150,
         resizeMode: "contain",
       }}
     />

      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B5E3C",
    justifyContent: "center",
    alignItems: "center",
  },

  // 🔥 BIGGER LOGO + CONTROL HEIGHT
  logoImage: {
    width: 260,     // 👈 increased width
    height: 140,    // 👈 controlled height (no extra space)
    marginBottom: 10, // 👈 reduced gap
  },

  

  
});