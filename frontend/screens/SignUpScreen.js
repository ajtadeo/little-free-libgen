import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Image, Alert } from 'react-native';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../utility/AuthContext';

import Constants from "expo-constants";

// Replace uri with localhost:8000
const uri = Constants.manifest2.extra.expoClient.hostUri.split(':').shift().concat(':8000');

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useContext(AuthContext);

  const handleSignUp = async () => {
    if (username === '' || password === '') {
      Alert.alert("Error", 'Please enter a username and password.');
      return;
    }

    try {
      const response = await axios.post('http://' + uri + '/register', {
        username,
        password
      });
      // const response = await axios.post('http://localhost:8000/register', {
      //   username,
      //   password
      // });

      if (response.data) {
        console.log(response.data)
        // Sign up successful
        // Navigate to the next screen or do something else
        signIn();
        navigation.navigate('MapScreen');

      } else {
        // Sign up failed
        // Show an error message or do something else
        Alert.alert("Error", "Invalid login credentials or Login already exists. Please try again.")
      }
    } catch (error) {
      // An error occurred
      // Show an error message or do something else
      alert(error)
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/bookshelf.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Little Free Libgen</Text>
      <Text style={styles.subtitle}>Welcome to UCLA's free community-run library!</Text>
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
          <Button title="Sign Up" onPress={handleSignUp} color="white" />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.accountButton}>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    fontFamily: "Cochin"
  },
  logoContainer : {
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
    fontFamily: "Cochin",
    fontWeight: 'bold',
    // fontFamily: "SuezOne-Regular"
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 30,
    fontFamily: "Optima",
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
    marginBottom: 15,
    fontFamily: "Gill Sans"
  },
  accountButton: {
    fontSize: 16,
    color: '#ED5658',
    marginBottom: 100,
    fontFamily: "Gill Sans"
  },
});

export default SignUpScreen;