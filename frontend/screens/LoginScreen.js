import axios from 'axios';

import {
    StyleSheet,
  } from 'react-native';


// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

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

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username,
        password
      });
  
      if (response.data) {
        // Login successful
        // Navigate to the next screen or do something else
        alert("SUCCESS!")
        navigation.navigate('MapScreen'); 
      } else {
        // Login failed
        // Write me code for an error message 
        alert("Login failed; try again")
      }
    } catch (error) {
      // An error occurred
      // Show an error message or do something else
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
