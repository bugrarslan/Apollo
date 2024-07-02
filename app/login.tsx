import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";

const Page = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const {isLoaded: signUpIsLoaded, setActive: signUpSetActive, signUp} = useSignUp();
  const {isLoaded: signInIsLoaded, setActive: signInSetActive, signIn} = useSignIn();


  const [loading, setLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState('bugrarslan@apollo.dev');
  const [password, setPassword] = useState('');

  const onSignUpPress = async () => {
    if (!signUpIsLoaded) return;
    setLoading(true);

    try {
      const result = await signUp.create({emailAddress, password});
      
      signUpSetActive({
        session: result.createdSessionId
      })
    } catch (error: any) {
      // console.error(error);
      Alert.alert(error.errors[0].message)
    } finally {
      setLoading(false);
    }
  }

  const onSignInPress = async () => {
    if (!signInIsLoaded) return;
    setLoading(true);

    try {
      const result = await signIn.create({identifier: emailAddress, password});
      
      signInSetActive({
        session: result.createdSessionId
      })
    } catch (error: any) {
      // console.error(error);
      Alert.alert(error.errors[0].message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={1}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      {loading && (
        <View style={defaultStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <Image
        source={require("@/assets/images/logo-dark.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>
        {type === "login" ? "Welcome Back" : "Create Your Account"}
      </Text>

      <View style={{ marginBottom: 30 }}>
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          autoCapitalize="none"
          value={emailAddress}
          onChangeText={setEmailAddress}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {type === "login" ? (
        <TouchableOpacity onPress={onSignInPress} style={[defaultStyles.btn, styles.btnPrimary]}>
          <Text style={styles.btnPrimaryText}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onSignUpPress} style={[defaultStyles.btn, styles.btnPrimary]}>
          <Text style={styles.btnPrimaryText}>Create Account</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: "center",
    marginVertical: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
  btnPrimary: {
    marginVertical: 4,
    backgroundColor: Colors.primary,
  },
  btnPrimaryText: {
    fontSize: 16,
    color: "#fff",
  }
});
