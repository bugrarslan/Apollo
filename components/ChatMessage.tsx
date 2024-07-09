import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React from "react";
import { Message, Role } from "@/utils/Interfaces";
import Colors from "@/constants/Colors";
import * as ContextMenu from "zeego/context-menu";
import { copyImageToClipboard, downloadAndSaveImage, shareImage } from "@/utils/Image";

const ChatMessage = ({
  content,
  role,
  imageUrl,
  prompt,
  loading,
}: Message & { loading?: boolean }) => {
  const contextItems = [
    { title: 'Copy', systemIcon: 'doc.on.doc', action: () => copyImageToClipboard(imageUrl!) },
    {
      title: 'Save to Photos',
      systemIcon: 'arrow.down.to.line',
      action: () => downloadAndSaveImage(imageUrl!),
    },
    { title: 'Share', systemIcon: 'square.and.arrow.up', action: () => shareImage(imageUrl!) },
  ];

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
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : (
        <>
          {content === "" && imageUrl ? (
            <ContextMenu.Root>
              <ContextMenu.Trigger>
                <Pressable>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.previewImage}
                  />
                </Pressable>
              </ContextMenu.Trigger>
              <ContextMenu.Content
                loop={false}
                alignOffset={10}
                avoidCollisions={true}
                collisionPadding={8}
              >
                {contextItems.map((item, index) => (
                  <ContextMenu.Item key={item.title}  onSelect={item.action}>
                    <ContextMenu.ItemTitle>{item.title}</ContextMenu.ItemTitle>
                    <ContextMenu.ItemIcon
                      ios={{
                        name: item.systemIcon,
                      }}
                    />
                  </ContextMenu.Item>
                ))}
              </ContextMenu.Content>
            </ContextMenu.Root>
          ) : (
            <Text style={styles.text}>{content}</Text>
          )}
        </>
      )}
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    margin: 6,
  },
  item: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  text: {
    padding: 4,
    fontSize: 16,
    flexWrap: "wrap",
    flex: 1,
  },
  loading: {
    justifyContent: "center",
    height: 26,
    marginLeft: 14,
  },
  previewImage: {
    width: 240,
    height: 240,
    borderRadius: 10,
  },
});
