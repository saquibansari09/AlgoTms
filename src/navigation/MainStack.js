import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import BottomTabs from "../navigation/BottomTabs";


// ⭐ ADDED
import CameraScanner from "../components/CameraScanner";

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Home"
        component={BottomTabs}
      />

      {/* ⭐ ADDED Camera Screen */}
      <Stack.Screen
        name="CameraScanner"
        component={CameraScanner}
      />

    </Stack.Navigator>
  );
}