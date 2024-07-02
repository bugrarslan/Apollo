import {
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import { Stack } from "expo-router";
import HeaderDropDown from "@/components/HeaderDropDown";
import MessageInput from "@/components/MessageInput";
import MessageIdeas from "@/components/MessageIdeas";
import { Message, Role } from "@/utils/Interfaces";

const DUMMY_MESSAGES: Message[] = [
  {
    content: "Hello! How can I help you today?",
    role: Role.Bot,
  },
  {
    content: "I need help with my React Native app.",
    role: Role.User,
  },
];

const Page = () => {
  const { signOut } = useAuth();
  const [gptVersion, setGptVersion] = useState("3.5");
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);

  const getCompletion = async (message: string) => {
    console.log("Message to send: ", message);
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerTitle: () => (
            <HeaderDropDown
              title="ChatGPT"
              selected={gptVersion}
              items={[
                { key: "3.5", title: "GPT-3.5", icon: "bolt" },
                { key: "4", title: "GPT-4", icon: "sparkles" },
              ]}
              onSelect={(key) => setGptVersion(key)}
            />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={70}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
        }}
      >
        {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
        <MessageInput onShouldSendMessage={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({});
