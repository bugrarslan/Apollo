import {
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import { Redirect, Stack } from "expo-router";
import HeaderDropDown from "@/components/HeaderDropDown";
import MessageInput from "@/components/MessageInput";
import MessageIdeas from "@/components/MessageIdeas";
import { Message, Role } from "@/utils/Interfaces";
import ChatMessage from "@/components/ChatMessage";
import { FlashList } from "@shopify/flash-list";
import { useMMKVString } from "react-native-mmkv";
import { Storage } from "@/utils/Storage";
import OpenAI from "react-native-openai";
import Colors from "@/constants/Colors";

const Page = () => {
  const { signOut } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [height, setHeight] = useState(0);
  const [working, setWorking] = useState(false);
  const [key, setKey] = useMMKVString("apiKey", Storage);
  const [organization, setOrganization] = useMMKVString("org", Storage);
  const [gptVersion, setGptVersion] = useMMKVString("gptVersion", Storage);

  if (!key || !organization || key === "" || organization === "") {
    return <Redirect href={"/(auth)/(modal)/settings"} />;
  }

  const openAI = useMemo(() => new OpenAI({ apiKey: key, organization }), []);

  const getCompletion = async (message: string) => {
    setWorking(true);

    setMessages([
      ...messages,
      { role: Role.User, content: message },
    ]);

    const result = await openAI.image.create({
      prompt: message
    });
    console.log("result: ", result);
  };

  useEffect(() => {
    const handleMessage = (payload: any) => {
      console.log("Message received: ", payload);
      setMessages((messages) => {
        const newMessage = payload.choices[0].delta.content;
        if (newMessage) {
          messages[messages.length - 1].content += newMessage;
        }

        if (payload.choices[0]?.finishReason) {
          //save to DB
          console.log("stream ended");
        }
        return messages;
      });
    };

    openAI.chat.addListener("onChatMessageReceived", handleMessage);

    return () => {
      openAI.chat.removeListener("onChatMessageReceived");
    };
  }, [openAI]);

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerTitle: () => (
            <HeaderDropDown
              title="Dall·E"
              items={[
                {
                  key: "share",
                  title: "Share GPT",
                  icon: "square.and.arrow.up",
                },
                { key: "details", title: "See Details", icon: "info.circle" },
                { key: "keep", title: "Keep in Sidebar", icon: "pin" },
              ]}
              onSelect={() => {}}
            />
          ),
        }}
      />

      <View style={{ flex: 1 }} onLayout={onLayout}>
        {messages.length === 0 && (
          <View style={{ marginTop: height / 2 - 100, alignItems: "center", gap:16 }}>
            <View style={[styles.logoContainer]}>
              <Image
                source={require("@/assets/images/dalle.png")}
                style={styles.logoImage}
              />
              
            </View>
            <Text style={styles.label}>
                Let me turn your imagination into imagery
              </Text>
          </View>
        )}
        <FlashList
          data={messages}
          estimatedItemSize={400}
          renderItem={({ item }) => <ChatMessage {...item} />}
          contentContainerStyle={{ paddingBottom: 150, paddingTop: 30 }}
          keyboardDismissMode="on-drag"
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={70}
        // style={{
        //   position: "absolute",
        //   bottom: 0,
        //   left: 0,
        //   width: "100%",
        // }}
      >
        <MessageInput onShouldSendMessage={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 50,
    overflow: "hidden",
    borderColor: Colors.greyLight,
    borderWidth: 1,
  },
  logoImage: {
    resizeMode: "cover",
  },
  label: {
    color: Colors.grey,
    fontSize: 16,
  },
});
