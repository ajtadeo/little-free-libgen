import {
    StyleSheet,
    // Text,
    // View,
  } from 'react-native';


// screens/MapScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
// import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

// import loginUser from '../services/authService';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
      marginTop: 50,
    },
    map: {
        flex: 1,
        paddingHorizontal: 10
    },
    titleText: {
        textAlign: 'center',
        fontSize: 30,
        backgroundColor: 'red',
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
    }
  });

const MapScreen = ({navigation}) => {
return (
    <View style={styles.container}>
        <Text style={styles.titleText}>
            Little Free Libgen
        </Text>
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: 34.070552338396695,
                longitude: -118.44415646276776,
                latitudeDelta: .05,
                longitudeDelta: .05
            }} >
            
            <Marker
                coordinate={{ latitude: 34.070552338396695, longitude: -118.44415646276776 }}
                title='Ackerman Grand Ballroom'
                description='1. Star Wars'
            >
            </Marker >
        </MapView>
        <View>
            <Button
                // onPress={onPressLearnMore}
                style={styles.button}
                title="Start Book Exchange"
                color=""
                onPress={() => navigation.navigate('StartExchange')}
            />
        </View>
    </View>
  );
};



export default MapScreen;
