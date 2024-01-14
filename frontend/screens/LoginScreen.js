import axios from 'axios';

import {
    StyleSheet,
  } from 'react-native';


// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../utility/AuthContext';


import Constants from "expo-constants";


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10
    },
    button: {
      backgroundColor: '#1E90FF',
      borderColor: '#fff',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center'
    }
  });

// Replace uri with localhost:8000
const uri = Constants.manifest2.extra.expoClient.hostUri.split(':').shift().concat(':8000');

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://'+uri+'/login', {
        username,
        password
      });
      // const response = await axios.post('http://localhost:8000/login', {
      //   username,
      //   password
      // });
  
      if (response.data) {
        // Login successful
        // Navigate to the next screen or do something else
        alert("SUCCESS!")
        signIn();
        navigation.navigate('MapScreen'); 
        
      } else {
        // Login failed
        // Write me code for an error message 
        alert("Login failed; try again"+uri)
      }
    } catch (error) {
      // An error occurred
      // Show an error message or do something else
      alert(error)
      alert("Login failed due to an error; try again")
    }
  };

return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <View style={styles.button}>
        <Button title="Login" onPress={handleLogin} color="white" />
      </View>
    </View>
  );
};

export default LoginScreen;
