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

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartExchange from './screens/StartExchange';

const Stack = createNativeStackNavigator();


const App = () => {

  // return <MapScreen />
  return (
    <NavigationContainer>

      {/* <MapScreen /> */}

      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="MapScreen" component={MapScreen} />
        {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
        <Stack.Screen name="StartExchange" component={StartExchange} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}

export default App;