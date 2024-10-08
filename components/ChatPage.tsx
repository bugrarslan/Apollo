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
  import React, { useEffect, useMemo, useRef, useState } from "react";
  import { useAuth } from "@clerk/clerk-expo";
  import { defaultStyles } from "@/constants/Styles";
  import { Redirect, Stack, useLocalSearchParams } from "expo-router";
  import HeaderDropDown from "@/components/HeaderDropDown";
  import MessageInput from "@/components/MessageInput";
  import MessageIdeas from "@/components/MessageIdeas";
  import { Message, Role } from "@/utils/Interfaces";
  import ChatMessage from "@/components/ChatMessage";
  import { FlashList } from "@shopify/flash-list";
  import { useMMKVString } from "react-native-mmkv";
  import { Storage } from "@/utils/Storage";
  import OpenAI from "react-native-openai";
  import { useSQLiteContext } from "expo-sqlite/next";
  import { addChat, addMessage, getMessages } from "@/utils/Database";
  
  const ChatPage = () => {
    const { signOut } = useAuth();
    const {id} = useLocalSearchParams<{id: string}>();
    const db = useSQLiteContext();
  
    const [messages, setMessages] = useState<Message[]>([]);
    const [height, setHeight] = useState(0);
    const [key, setKey] = useMMKVString("apiKey", Storage);
    const [organization, setOrganization] = useMMKVString("org", Storage);
    const [gptVersion, setGptVersion] = useMMKVString("gptVersion", Storage);
    const [chatId, _setChatId] = useState<string>('');

    const chatIdRef = useRef(chatId);
  
    function setChatId(id: string) {
      chatIdRef.current = id;
      _setChatId(id);
    }
  
    if (!key || !organization || key === "" || organization === "") {
      return <Redirect href={"/(auth)/(modal)/settings"} />;
    }

    useEffect(() => {
      if (id) {
        console.log('load for chat id: ', id);
        getMessages(db, parseInt(id)).then((messages) => {
          console.log('got messages: ', messages);

          setMessages(messages);
        });
      }
  
      
    }, [id])
    
  
    const openAI = useMemo(() => new OpenAI({ apiKey: key, organization }), []);
  
    const getCompletion = async (message: string) => {
      if (message.length === 0) {
        const result = await addChat(db, message);
        const chatID = result.lastInsertRowId;
        setChatId(chatID.toString());
        addMessage(db, chatID, { role: Role.User, content: message });
      }
  
      setMessages([
        ...messages,
        { role: Role.User, content: message },
        { role: Role.Bot, content: "" },
      ]);
  
      openAI.chat.stream({
        messages: [{ role: `user`, content: message }],
        model: gptVersion === "4" ? "gpt-4" : "gpt-3.5-turbo",
      });
    };
  
    useEffect(() => {
      const handleMessage = (payload: any) => {
        // console.log("Message received: ", payload);
        setMessages((messages) => {
          const newMessage = payload.choices[0].delta.content;
          if (newMessage) {
            messages[messages.length - 1].content += newMessage;
          }
  
          if (payload.choices[0]?.finishReason) {
            //save to DB
            addMessage(db, parseInt(chatIdRef.current), {
              role: Role.Bot,
              content: messages[messages.length - 1].content,
            });
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
        <View style={{ flex: 1 }} onLayout={onLayout}>
          {messages.length === 0 && (
            <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
              <Image
                source={require("@/assets/images/logo-white.png")}
                style={styles.logoImage}
              />
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
          {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
          <MessageInput onShouldSendMessage={getCompletion} />
        </KeyboardAvoidingView>
      </View>
    );
  };
  
  export default ChatPage;
  
  const styles = StyleSheet.create({
    logoContainer: {
      backgroundColor: "#000",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    logoImage: {
      width: 30,
      height: 30,
      resizeMode: "cover",
    },
  });
  