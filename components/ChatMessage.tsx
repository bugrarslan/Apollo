import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Message } from '@/utils/Interfaces'

const ChatMessage = ({content, role, imageUrl, prompt}: Message) => {
  return (
    <View>
      <Text>ChatMessage</Text>
    </View>
  )
}

export default ChatMessage

const styles = StyleSheet.create({})