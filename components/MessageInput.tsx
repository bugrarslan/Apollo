import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const {bottom} = useSafeAreaInsets();
    const expanded = useSharedValue(0);


  return (
    <View>
      <Text>MessageInput</Text>
    </View>
  )
}

export default MessageInput

const styles = StyleSheet.create({})