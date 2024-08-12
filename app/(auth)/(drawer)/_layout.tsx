import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { Link, useNavigation, useRouter } from "expo-router";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { TextInput } from "react-native-gesture-handler";
import { Chat } from "@/utils/Interfaces";
import { useSQLiteContext } from "expo-sqlite/next";
import { deleteChat, getChats, renameChat } from "@/utils/Database";
import * as ContextMenu from 'zeego/context-menu'

const CustomDrawerContent = (props: any) => {
  const { bottom, top } = useSafeAreaInsets();
  const isDrawerOpen = useDrawerStatus() === "open";
  const [history, setHistory] = useState<Chat[]>([]);
  const db = useSQLiteContext();
  const router = useRouter();

  useEffect(() => {
    if (isDrawerOpen) {
      loadChats();
    }
    Keyboard.dismiss();
  }, [isDrawerOpen]);

  const loadChats = async () => {
    const result = await getChats(db);
    setHistory(result);
  };

  const onDeleteChat = async (id: number) => {
    Alert.alert("Delete Chat", "Are you sure you want to delete this chat?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          await deleteChat(db, id);
          loadChats();
        },
      },
    ]);
  };

  const onRenameChat = async (id: number) => {
    Alert.prompt("Rename Chat", "Enter a new name for the chat", async (newName) => {
      if (newName) {
        await renameChat(db, id, newName);
        loadChats();
      }
    });
  };

  return (
    <View style={{ flex: 1, marginTop: top }}>
      <View style={{ backgroundColor: "#fff", paddingBottom: 16 }}>
        <View style={styles.searchSection}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.greyLight}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            underlineColorAndroid={"transparent"}
            style={styles.searchInput}
          />
        </View>
      </View>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <DrawerItemList {...props} />
        {history.map((chat) => (
          <ContextMenu.Root key={chat.id}>
            <ContextMenu.Trigger>
              <DrawerItem
                key={chat.id}
                label={chat.title}
                inactiveTintColor="#000"
                onPress={() => router.push(`/(auth)/(drawer)/(chat)/${chat.id}`)}
              />
            </ContextMenu.Trigger>
            <ContextMenu.Content
              loop={true}
              alignOffset={10}
              avoidCollisions={true}
              collisionPadding={20}
            >
              <ContextMenu.Item key={'rename'} onSelect={() => onRenameChat(chat.id)}>
                <ContextMenu.ItemTitle>Rename</ContextMenu.ItemTitle>
                <ContextMenu.ItemIcon
                  ios={{
                    name: 'pencil',
                    pointSize: 18,
                  }}
                />
              </ContextMenu.Item>
              <ContextMenu.Item key={'delete'} onSelect={() => onDeleteChat(chat.id)}>
              <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
                <ContextMenu.ItemIcon
                  ios={{
                    name: 'trash',
                    pointSize: 18,
                  }}
                />
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
          
        ))}
      </DrawerContentScrollView>

      <View style={{ padding: 16, paddingBottom: bottom }}>
        <Link href={"/(auth)/(modal)/settings"} asChild>
          <TouchableOpacity style={styles.footer}>
            <Image
              source={{
                uri: "https://avatars.githubusercontent.com/u/77547030?s=400&u=57878460044c3358f496d92e40b04f15717929f8&v=4",
              }}
              style={styles.avatar}
            />
            <Text style={styles.username}>Bugrarslan</Text>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={Colors.greyLight}
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const Layout = () => {
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light,
        },
        headerShadowVisible: false,
        drawerActiveBackgroundColor: Colors.selected,
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "#000",
        overlayColor: "rgba(0,0,0,0.2)",
        drawerItemStyle: { borderRadius: 12 },
        drawerLabelStyle: { marginLeft: -20 },
        drawerStyle: { width: dimensions.width * 0.86 },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer);
            }}
            style={{ marginLeft: 16 }}
          >
            <FontAwesome6 name="grip-lines" size={20} color={Colors.grey} />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="(chat)/new"
        options={{
          title: "ChatGPT",
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: "#000" }]}>
              <Image
                source={require("../../../assets/images/logo-white.png")}
                style={styles.btnImage}
              />
            </View>
          ),
          headerRight: () => (
            <Link href={"/(auth)/(drawer)/(chat)/new"} asChild push>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      <Drawer.Screen
        name="(chat)/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          headerRight: () => (
            <Link href={"/(auth)/(drawer)/(chat)/new"} asChild push>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      <Drawer.Screen
        name="dalle"
        options={{
          title: "Dall·E",
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: "#000" }]}>
              <Image
                source={require("../../../assets/images/dalle.png")}
                style={styles.dallEImage}
              />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          title: "Explore GPTs",
          drawerIcon: () => (
            <View style={styles.itemExplore}>
              <Ionicons name="apps" size={18} color={"#000"} />
            </View>
          ),
        }}
      />
    </Drawer>
  );
};

export default Layout;

const styles = StyleSheet.create({
  item: {
    borderRadius: 16,
    overflow: "hidden",
  },
  btnImage: {
    margin: 6,
    width: 16,
    height: 16,
  },
  dallEImage: {
    width: 28,
    height: 28,
    resizeMode: "cover",
  },
  itemExplore: {
    borderRadius: 16,
    overflow: "hidden",
    width: 28,
    height: 28,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  searchSection: {
    marginHorizontal: 16,
    flexDirection: "row",
    backgroundColor: Colors.input,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 34,
  },
  searchIcon: {
    padding: 6,
  },
  searchInput: {
    flex: 1,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 0,
    alignItems: "center",
    color: "#424242",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  username: {
    fontWeight: "600",
    fontSize: 16,
    flex: 1,
  },
});
