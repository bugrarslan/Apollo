import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Image, View, Text } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";

const Page = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const [loading, setLoading] = useState(false);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      keyboardVerticalOffset={1}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
      {
        loading && (
          <View style={defaultStyles.loadingOverlay}>
            <ActivityIndicator size='large' color='#fff' />
          </View>
        )
      }
      <Image
        source={require('@/assets/images/logo-dark.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>
        {type === 'login' ? 'Welcome Back' : 'Create Your Account'}
      </Text>

    </KeyboardAvoidingView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:20
  },
  logo:{
    width:60,
    height:60,
    alignSelf:'center',
    marginVertical:80,
  },
  title:{
    fontSize:30,
    fontWeight:'bold',
    textAlign:'center',
    marginBottom:20,
  }
});