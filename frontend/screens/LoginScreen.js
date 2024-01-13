import axios from 'axios';

const loginUser = async (username, password) => {
  try {
    const response = await axios.post('http://your-backend-url/auth/login', {
      username,
      password,
    });

    console.log(response.data.message); // Display success message
  } catch (error) {
    console.error(error.response.data.error); // Display error message
  }
};

import {
    StyleSheet,
    // Text,
    // View,
  } from 'react-native';


// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
// import { StyleSheet, View, Text, TextInput, Button } from 'react-native';


// import loginUser from '../services/authService';

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

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    loginUser(username, password);
  };

//   return (
//     <View>
//       <Text>Login Screen</Text>
//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={(text) => setUsername(text)}
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={(text) => setPassword(text)}
//         secureTextEntry
//       />
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );

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
        <Button title="Login" onPress={handleLogin} color="transparent" />
      </View>
    </View>
  );
};



export default LoginScreen;
