/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  AppRegistry,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import LoginScreen from '../frontend/screens/LoginScreen';
import MapScreen from '../frontend/screens/MapScreen';
import UserInfo from '../frontend/screens/UserInfo';
import StartExchange from './screens/StartExchange';
import CloseExchange from './screens/CloseExchange';

import { registerRootComponent } from 'expo';
import { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './screens/SignUpScreen';
import { AuthContext } from '../frontend/utility/AuthContext';

const Stack = createNativeStackNavigator();


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authContext = useMemo(() => ({
    signIn: () => setIsAuthenticated(true),
    signOut: () => setIsAuthenticated(false),
  }), []);

  AppRegistry.registerComponent('frontend', () => App)

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{headerShown: false}}
        >
        {isAuthenticated ? (
            <>
                <Stack.Screen name="MapScreen" component={MapScreen} />
                <Stack.Screen name="StartExchange" component={StartExchange} />
                <Stack.Screen name="CloseExchange" component={CloseExchange} />
                <Stack.Screen name="UserInfo" component={UserInfo} />
            </>
          ) : (
            <>
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
              <Stack.Screen name="LoginScreen" component={LoginScreen} /> 
              {/* Add more public screens here */}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );

}

// Uncomment if you are trying to run on your custom device using expo
registerRootComponent(App);

export default App;