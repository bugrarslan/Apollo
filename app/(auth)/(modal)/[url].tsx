import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { BlurView } from "expo-blur";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { downloadAndSaveImage, shareImage } from "@/utils/Image";

const Page = () => {
  const { url, prompt } = useLocalSearchParams<{
    url: string;
    prompt?: string;
  }>();
  const { bottom } = useSafeAreaInsets();

  const onCopyPrompt = () => {
    console.log("copy prompt");
  };

  return (
    <View style={styles.container}>
      <ImageZoom
        uri={url}
        style={styles.image}
        minScale={0.5}
        maxScale={5}
        minPanPointers={1}
        doubleTapScale={2}
        isSingleTapEnabled
        isDoubleTapEnabled
        resizeMode="contain"
      />
      <BlurView
        intensity={95}
        tint="dark"
        style={[styles.blurview, { paddingBottom: bottom }]}
      >
        <View style={styles.row}>
          <TouchableOpacity style={{ alignItems: "center" }}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={"white"}
            />
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center" }}>
            <Ionicons name="brush-outline" size={24} color={"white"} />
            <Text style={styles.btnText}>Select</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => downloadAndSaveImage(url)}
          >
            <Octicons name="download" size={24} color={"white"} />
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => shareImage(url)}
          >
            <Octicons name="share" size={24} color={"white"} />
            <Text style={styles.btnText}>Share</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  blurview: {
    width: "100%",
    bottom: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    paddingTop: 6,
  },
});
