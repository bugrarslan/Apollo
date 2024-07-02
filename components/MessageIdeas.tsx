import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";

const PredefinedMessages = [
  { title: "Explain React Native", text: "like I'm five years old" },
  {
    title: "Suggest fun activites",
    text: "for a family visting San Francisco",
  },
  { title: "Recommend a dish", text: "to impress a date who's a picky eater" },
];

type Props = {
  onSelectCard: (message: string) => void;
};

const MessageIdeas = ({ onSelectCard }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 16,
      }}
    >
      {PredefinedMessages.map((message, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelectCard(`${message.title} ${message.text}`)}
          style={styles.card}
        >
          <Text style={{ fontWeight: "500", fontSize: 16 }}>
            {message.title}
          </Text>
          <Text style={{ color: Colors.grey, fontSize: 14 }}>{message.text}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default MessageIdeas;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.input,
    padding: 14,
    borderRadius: 10,
  },
});
