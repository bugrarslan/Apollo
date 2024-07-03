import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { TextInput } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export type MessageInputProps = {
  onShouldSendMessage: (message: string) => void;
};

const MessageInput = ({ onShouldSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(1);

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
    const opacityInterpolation = interpolate(expanded.value, [0, 1], [1, 0], Extrapolation.CLAMP);
    const widthInterpolation = interpolate(expanded.value, [0, 1], [30, 0], Extrapolation.CLAMP);

    return {
      opacity: opacityInterpolation,
      width: widthInterpolation,
    };
  });

  const buttonViewStyle = useAnimatedStyle(() => {
    const widthInterpolation = interpolate(expanded.value, [0, 1], [0, 100], Extrapolation.CLAMP);

    return {
      opacity: expanded.value,
      width: widthInterpolation,
    };
  });

  return (
    <BlurView
      tint={"extraLight"}
      intensity={90}
      style={{ paddingBottom: 10, paddingTop: 10 }}
    >
      <View style={styles.row}>
        <ATouchableOpacity
          onPress={expandItems}
          style={[styles.roundBtn, expandedButtonStyle]}
        >
          <Ionicons name="add" size={24} color={Colors.grey} />
        </ATouchableOpacity>

        <Animated.View
          style={[styles.buttonView, buttonViewStyle]}
        >
          <TouchableOpacity onPress={() => ImagePicker.launchCameraAsync()}>
            <Ionicons name="camera-outline" size={24} color={Colors.grey} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => ImagePicker.launchImageLibraryAsync()}>
            <Ionicons name="image-outline" size={24} color={Colors.grey} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => DocumentPicker.getDocumentAsync()}>
            <Ionicons name="folder-outline" size={24} color={Colors.grey} />
          </TouchableOpacity>
        </Animated.View>

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
            <Ionicons
              name="arrow-up-circle-outline"
              size={24}
              color={Colors.grey}
            />
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
  buttonView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
