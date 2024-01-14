import axios from 'axios';

import {
  StyleSheet,
} from 'react-native';


// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, KeyboardAvoidingView, Image, TouchableOpacity, Alert } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../utility/AuthContext';


import Constants from "expo-constants";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logoContainer: {
    alignItems: "center"
  },
  logo: {
    width: 300,
    marginBottom: -110,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    paddingBottom: 9,
    fontWeight: 'bold',
    fontFamily: "Cochin"
    // fontFamily: "SuezOne-Regular"
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 30, 
    // fontFamily: "Gill Sans",
    // fontFamily: "Optima-Regular",
    fontFamily: "Optima"
  },
  inputContainer: {
    alignItems: 'center'
  },
  input: {
    height: 40,
    width: 350,
    borderColor: '#00000033',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 15,
    paddingLeft: 10,
    fontFamily: "Cochin"
  },
  button: {
    backgroundColor: '#F5CA56',
    borderWidth: 0,
    borderRadius: 20,
    padding: 10,
    width: 100,
    marginBottom: 15
  },
  accountButton: {
    fontSize: 16,
    color: '#ED5658',
    marginBottom: 100,
    fontFamily: "Gill Sans"
  },
});

// Replace uri with localhost:8000
const uri = Constants.manifest2.extra.expoClient.hostUri.split(':').shift().concat(':8000');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://' + uri + '/login', {
        username,
        password
      });
      // const response = await axios.post('http://localhost:8000/login', {
      //   username,
      //   password
      // });

      if (response.data) {
        // Login successful
        signIn();
        navigation.navigate('MapScreen');
      } else {
        // Login unsuccessful
        Alert.alert("Error", "Your username and/or password was incorrect. Please try again.")
      }
    } catch (error) {
      // An error occurred
      // Show an error message or do something else
      Alert.alert("Error", "Login failed due to an error. Please try again.")
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/bookshelf.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Little Free Libgen</Text>
      <Text style={styles.subtitle}>Login with your username and password.</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#00000033"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#00000033"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <View style={styles.button}>
          <Button title="Login" onPress={handleLogin} color="white" />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUpScreen')}
        >
          <Text style={styles.accountButton}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
