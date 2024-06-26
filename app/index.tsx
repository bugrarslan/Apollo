import AnimatedIntro from "@/components/AnimatedIntro";
import BottomLoginSheet from "@/components/BottomLoginSheet";
import { Text, View } from "react-native";

export default function Index() {
    return (
        <View style={{flex: 1}}>
            <AnimatedIntro />
            <BottomLoginSheet />
        </View>
    );
}
