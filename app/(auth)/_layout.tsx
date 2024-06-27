import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
  
  return (
    <Stack>
      <Stack.Screen name='(drawer)' options={{headerShown: false}}/>
    </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})