import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Message, Role } from "@/utils/Interfaces";

const ChatMessage = ({ content, role, imageUrl, prompt }: Message) => {
  return (
    <View style={styles.row}>
      {role === Role.Bot ? (
        <View style={[styles.item]}>
          <Image
            source={require("@/assets/images/logo-white.png")}
            style={styles.btnImage}
          />
        </View>
      ) : (
        <Image
          source={{
            uri: "https://avatars.githubusercontent.com/u/77547030?s=400&u=57878460044c3358f496d92e40b04f15717929f8&v=4",
          }}
          style={styles.avatar}
        />
      )}
      <Text style={styles.text}>{content}</Text>
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    gap: 14,
    marginVertical: 12,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  btnImage: {
    width: 16,
    height: 16,
    margin: 6
  },
  item: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#000'
  },
  text: {
    padding: 4,
    fontSize: 16,
    flexWrap: "wrap",
    flex: 1,
  }
});
