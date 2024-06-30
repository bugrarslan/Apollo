import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { TextInput } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";

const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export type MessageInputProps = {
  onShouldSendMessage: (message: string) => void;
};

const MessageInput = ({onShouldSendMessage} : MessageInputProps) => {
  const [message, setMessage] = useState("");
  const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(0);

  const expandItems = () => {
    expanded.value = withTiming(1, { duration: 400 });
  };

  const collapseItems = () => {
    expanded.value = withTiming(0, { duration: 400 });
  };

  const onSend = () => {
    onShouldSendMessage(message);
    setMessage("");
  };

  const onChangeText = (text: string) => {
    collapseItems();
    setMessage(text);
  };

  const expandedButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: expanded.value,
      transform: [{ scale: expanded.value }],
    };
  });

  return (
    <BlurView
      tint="extraLight"
      intensity={90}
      style={{ paddingBottom: 10, paddingTop: 10 }}
    >
      <View style={styles.row}>
        <ATouchableOpacity onPress={expandItems} style={[styles.roundBtn, expandedButtonStyle]}>
          <Ionicons name="add" size={24} color={Colors.grey} />
        </ATouchableOpacity>

        <TextInput
          style={styles.messageInput}
          autoFocus
          placeholder="Message"
          multiline
          value={message}
          onChangeText={onChangeText}
          onFocus={collapseItems}
        />

        {message.length > 0 ? (
          <TouchableOpacity onPress={onSend}>
            <Ionicons name="arrow-up-circle-outline" size={24} color={Colors.grey} />  
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => {}}>
            <FontAwesome5 name="headphones" size={24} color={Colors.grey} />
          </TouchableOpacity>
        
        )}
      </View>
    </BlurView>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  roundBtn: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.input,
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 10,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.light,
  },
});
