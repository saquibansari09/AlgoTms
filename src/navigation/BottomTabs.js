import React from "react";
import { Alert, Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../components/AppHeader";

import NewTicketsScreen from "../screens/NewTicketsScreen";
import OpenTicketsScreen from "../screens/OpenTicketsScreen";
import CloseTicketsScreen from "../screens/CloseTicketsScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Global Header */}
      <AppHeader />

      {/* Bottom Tabs */}
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,

            tabBarActiveTintColor: "#8B5E3C",
            tabBarInactiveTintColor: "gray",

            tabBarStyle: {
              height: Platform.OS === "android" ? 65 : 65,
              paddingBottom: Platform.OS === "android" ? 5 : 10,
              paddingTop: 5,
              backgroundColor: "#fff",
              borderTopWidth: 0.2,
              borderTopColor: "#8B5E3C",

              elevation: 8,
              shadowColor: "#000",
            },

            tabBarLabelStyle: {
              fontSize: 11,
              marginBottom: 2,
            },

            tabBarIconStyle: {
              marginTop: 2,
            },

            tabBarShowLabel: true,
          }}
        >
          <Tab.Screen
            name="New"
            component={NewTicketsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="add-circle" size={20} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="Open"
            component={OpenTicketsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="folder-open" size={20} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="Closed"
            component={CloseTicketsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="checkmark-circle" size={20} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="Logout"
            component={NewTicketsScreen}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();

                Alert.alert("Logout", "Are you sure you want to logout?", [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Logout",
                    onPress: () => navigation.replace("Login"),
                  },
                ]);
              },
            })}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="log-out" size={20} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}
