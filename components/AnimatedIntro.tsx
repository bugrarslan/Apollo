import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {ReText} from 'react-native-redash'
import Colors from '@/constants/Colors';

const content = [
    {
      title: "Let's create.",
      bg: Colors.lime,
      fontColor: Colors.pink,
    },
    {
      title: "Let's brainstorm.",
      bg: Colors.brown,
      fontColor: Colors.sky,
    },
    {
      title: "Let's discover.",
      bg: Colors.orange,
      fontColor: Colors.blue,
    },
    {
      title: "Let's go.",
      bg: Colors.teal,
      fontColor: Colors.yellow,
    },
    {
      title: 'ChatGPT.',
      bg: Colors.green,
      fontColor: Colors.pink,
    },
  ];

const AnimatedIntro = () => {
    return (
        <View style={styles.wrapper}>
            <Text>AnimatedIntro</Text>
        </View>
    )
}

export default AnimatedIntro

const styles = StyleSheet.create({
    wrapper:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})