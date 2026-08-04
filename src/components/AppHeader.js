import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";

export default function AppHeader() {
  const slideAnim = useRef(new Animated.Value(-80)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Left Section */}
      <View style={styles.left}>
        <Text style={styles.title}>ALGOTMS</Text>

        <Text style={styles.subtitle}>Smart Field Operations System</Text>
      </View>

      {/* Right Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/algo-logo.png")}
          style={{
            width: 70,
            height: 70,
            resizeMode: "contain",
          }}
        />
      </View>

      {/* Bottom Line */}
      <View style={styles.bottomLine} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 85,
    backgroundColor: "#8B5E3C",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,

    elevation: 8,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    overflow: "hidden",
  },

  left: {
    flex: 1,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
  },

  subtitle: {
    color: "#F5F5F5",
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.5,
  },

  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },

  bottomLine: {
    position: "absolute",

    height: 3,
    backgroundColor: "#FFD700",
  },
});
