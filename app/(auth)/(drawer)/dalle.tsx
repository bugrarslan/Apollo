import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Stack } from "expo-router";
import HeaderDropDown from "@/components/HeaderDropDown";

const Page = () => {
  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="Dall·E"
              items={[
                { key: 'share', title: 'Share GPT', icon: 'square.and.arrow.up' },
                { key: 'details', title: 'See Details', icon: 'info.circle' },
                { key: 'keep', title: 'Keep in Sidebar', icon: 'pin' },
              ]}
              onSelect={() => {}}
            />
          ),
        }}
      />
      <Text>Dalle</Text>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({});
