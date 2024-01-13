import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../utility/AuthContext';

import Constants from "expo-constants";

// Replace uri with localhost:8000
const uri = Constants.manifest2.extra.expoClient.hostUri.split(':').shift().concat(':8000');

const SignUpScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useContext(AuthContext);

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://'+uri+'/register', {
        username,
        password
      });

      if (response.data) {
        console.log(response.data)
        // Sign up successful
        // Navigate to the next screen or do something else
        signIn();
        navigation.navigate('MapScreen'); 

      } else {
        // Sign up failed
        // Show an error message or do something else
        alert("Invalid username or password; OR Login already exists")
      }
    } catch (error) {
      // An error occurred
      // Show an error message or do something else
      alert(error)
    }
  };

  return (
    <View style={styles.container}>
      <Text>Sign Up Screen</Text>
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
        <Button title="Sign Up" onPress={handleSignUp} color="white" />
      </View>
      <View>
        <Button title="Already have an account?" onPress={() => navigation.navigate('LoginScreen')} color="black" />
      </View>
    </View>
  );
};

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

export default SignUpScreen;