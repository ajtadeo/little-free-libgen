/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
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

import LoginScreen from '../frontend/screens/LoginScreen'
import MapScreen from '../frontend/screens/MapScreen'
import StartExchange from './screens/StartExchange';
import CloseExchange from './screens/CloseExchange';

import { registerRootComponent } from 'expo';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


const App = () => {

  // return <MapScreen />
  return (
    <NavigationContainer>

      {/* <MapScreen /> */}

      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="StartExchange" component={StartExchange} />
        <Stack.Screen name="CloseExchange" component={CloseExchange} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}

registerRootComponent(App);

export default App;