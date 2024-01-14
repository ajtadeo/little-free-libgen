// screens/LoginScreen.js
import React, { useState } from 'react';
import { SafeAreaView, FlatList, View, Text, TextInput, Button, KeyboardAvoidingView, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useContext } from 'react';
import axios from 'axios';
import Constants from "expo-constants";

const uri = Constants.manifest2.extra.expoClient.hostUri.split(':').shift().concat(':8000');

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: "dodgerblue"
    },
    leaderboardText: {
        fontSize: 24
    },
    text: {
        marginHorizontal: 20,
        color: 'black',
        fontSize: 24,
    },
    heading: {
        margin: 20,
        color: 'black',
        fontSize: 42,
    },
    list: {
        margin: 20,
    },
    leaderboardElement: {
        fontSize: 24,
        flexDirection: 'row',  // Arrange items horizontally
        justifyContent: 'space-between',  // Push points to the right
    }

})

const UserInfo = ({ navigation }) => {

    const [leaderboardData, setLeaderboardData] = useState([
        { username: 'Loading...', points: "..." },
    ]);

    async function getLeaderboardData() {
        try {
            const response = await axios.get('http://' + uri + '/get-leaderboard')
            if (response.data) {
                setLeaderboardData(response.data)
            }
        } catch (error) {
            Alert.alert("bruh")
        }
    }

    getLeaderboardData()

    return <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Hello Kevzzz!</Text>
        <Text style={styles.text}>You Have 8 Points</Text>
        <Text style={styles.heading}>Leaderboard</Text>
        <FlatList style={styles.list}
            data={leaderboardData}
            renderItem={({ item }) => (
                <View style={styles.leaderboardElement}>
                    <Text style={styles.leaderboardText}>{item.username}</Text>
                    <Text style={[{ textAlign: 'right' }, styles.leaderboardText]}>{item.points}</Text>
                </View>
            )}
        />
    </SafeAreaView>
}

export default UserInfo;
