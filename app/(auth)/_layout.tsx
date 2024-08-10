import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SQLiteProvider } from "expo-sqlite/next";
import { migrateDbIfNeeded } from "@/utils/Database";

const Layout = () => {
  const router = useRouter();

  return (
    <SQLiteProvider databaseName="chats.db" onInit={migrateDbIfNeeded}>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modal)/settings"
          options={{
            headerTitle: "Settings",
            presentation: "modal",
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: Colors.selected },
            headerRight: () => (
              <>
                {router.canGoBack() && (
                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                      backgroundColor: Colors.greyLight,
                      borderRadius: 20,
                      padding: 6,
                    }}
                  >
                    <Ionicons
                      name="close-outline"
                      size={24}
                      color={Colors.grey}
                    />
                  </TouchableOpacity>
                )}
              </>
            ),
            headerLeft: () => <View />,
          }}
        />
        <Stack.Screen
          name="(modal)/[url]"
          options={{
            headerTitle: "",
            presentation: "fullScreenModal",
            headerTransparent: true,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: "rgba(0,0,0,0.4)" },
            headerBlurEffect: "dark",
            headerLeft: () => (
              <>
                {router.canGoBack() && (
                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                      borderRadius: 20,
                      padding: 4,
                    }}
                  >
                    <Ionicons name="close-outline" size={28} color={"#fff"} />
                  </TouchableOpacity>
                )}
              </>
            ),
            // headerLeft: () => <View />,
          }}
        />
      </Stack>
    </SQLiteProvider>
  );
};

export default Layout;

const styles = StyleSheet.create({});
