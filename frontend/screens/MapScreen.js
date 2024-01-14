// screens/MapScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Image, Modal, StyleSheet, Dimensions, TouchableOpacity, TouchableHighlight, FlatList } from 'react-native';
import exchange from'../assets/images/exchange.png';
import cross from'../assets/images/cross.png';

import MapView, { Callout, Marker } from 'react-native-maps'

import axios from 'axios';

import Constants from "expo-constants";

// Replace uri with localhost:8000
const uri = Constants.manifest2.extra.expoClient.hostUri.split(':').shift().concat(':8000');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,

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
    },
    bookImage: {
      width: 100,
      height: 150,
    },
    bottomSheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: 'white',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      paddingVertical: 23,
      paddingHorizontal: 25,
      bottom: 0,
      shadowColor: 'gray',
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.8,
      shadowRadius: 4,  
  },
  });

const MapScreen = ({navigation}) => {

// We need to get the height of the phone and use it relatively, 
// This is because height of phones vary
const windowHeight = Dimensions.get('window').height;

// This state would determine if the drawer sheet is visible or not
const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

// Function to open the bottom sheet 
const handleOpenBottomSheet = () => {
  setIsBottomSheetOpen(true);
};

// Function to close the bottom sheet
const handleCloseBottomSheet = () => {
  setIsBottomSheetOpen(false);
};

// This state would determine if the drawer sheet is visible or not
const [isBottomSheetOpenHill, setIsBottomSheetOpenHill] = useState(false);

// Function to open the bottom sheet 
const handleOpenBottomSheetHill = () => {
  setIsBottomSheetOpenHill(true);
};

// Function to close the bottom sheet
const handleCloseBottomSheetHill = () => {
  setIsBottomSheetOpenHill(false);
};


// This state would determine if the drawer sheet is visible or not
const [isBottomSheetOpenWest, setIsBottomSheetOpenWest] = useState(false);

// Function to open the bottom sheet 
const handleOpenBottomSheetWest = () => {
  setIsBottomSheetOpenWest(true);
};

// Function to close the bottom sheet
const handleCloseBottomSheetWest = () => {
  setIsBottomSheetOpenWest(false);
};


// This state would determine if the drawer sheet is visible or not
const [isBottomSheetOpenSaw, setIsBottomSheetOpenSaw] = useState(false);

// Function to open the bottom sheet 
const handleOpenBottomSheetSaw = () => {
  setIsBottomSheetOpenSaw(true);
};

// Function to close the bottom sheet
const handleCloseBottomSheetSaw = () => {
  setIsBottomSheetOpenSaw(false);
};

const [books, setBooks] = useState([]);

const booksWest = [[{author: "George Orwell", title: "Animal Farm", isbn: "9780452284241"}, {author: "Victor Hugo", title: "Les Misérables", isbn: "2011550491"}]]
const booksHill = [[{author: "J.R.R. Tolkien", title: "The Hobbit", isbn: "9780547928227"}, {author: "The Poet", title: "Michael Connelly", isbn: "9780446602617"}]]
const booksSaw = [[{author: "F. Scott Fitzgerald", title: "The Great Gatsby", isbn: "9780743273565"}, {author: "Stendhal", title: "Le Rouge et le Noir ", isbn: "9781483903590"}]]

useEffect(() => {
  async function fetchBooks() {
    let response = await axios.get('http://' + uri + '/get-all-books')
    let reponseArray = response.data;

    let arraysSplit = [];

    while (reponseArray.length > 0) {
      arraysSplit.push(reponseArray.splice(0, 2));
    }
    setBooks(arraysSplit)
  }

  fetchBooks()
}, []);

const renderRow = (item) => {
  console.log(item)
  return (
    <View style={{ margin: 10, flexDirection:"row", paddingBottom: 20 }}>   
      <View style={{
          // backgroundColor: 'red',
          width: 150,
          height: 250,
          marginRight: 30,
          alignItems: 'center'
        }}>
        <Image
          style={{width: 150, height: 225, marginBottom: 5}}
          source={{
            uri: 'http://covers.openlibrary.org/b/isbn/'+item[0].isbn+'-L.jpg',
          }}
        />
        <Text style={{textAlign: 'center' ,fontSize: 15}}>{item[0].title}</Text>
        <Text style={{textAlign: 'center',fontSize: 10}}>{item[0].author}</Text>
      </View> 

      <View
        style={{
          // backgroundColor: 'green',
          width: 150,
          height: 250,
          alignItems: 'center'
        }}>
        <Image
          style={{width: 150, height: 225, marginBottom: 5}}
          source={{
            uri: 'http://covers.openlibrary.org/b/isbn/'+item[1].isbn+'-L.jpg',
          }}
        />
        <Text style={{textAlign: 'center',fontSize: 15}}>{item[1].title}</Text>
        <Text style={{textAlign: 'center',fontSize: 10}}>{item[1].author}</Text>
      </View>
    </View>
  );
}

function CustomModal(props) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.isBottomSheetOpenC}
      onRequestClose={props.handleCloseBottomSheetC} >

        <View style={[styles.bottomSheet, { height: windowHeight * 0.8 }]}>

          <View style={{ flex: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 20}}>
            <Text style={{fontSize: 25}}>{props.name == "A" ? "Ackerman Grand     \nBallroom" : props.name}</Text>
            <TouchableOpacity style={{backgroundColor: '#F5CA56', borderRadius: 30, width: 60, height: 60, justifyContent: 'center', alignItems: 'center'}} onPress={() => {props.handleCloseBottomSheetC(); navigation.navigate('StartExchange')}}>
              <Image style={{width: 40, height: 26.9}} source={exchange} />
            </TouchableOpacity>
            <TouchableOpacity style={{width: 20, height: 20, justifyContent: 'center', alignItems: 'center'}} onPress={props.handleCloseBottomSheetC}>
              <Image style={{width: 10, height: 10}} source={cross} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={{textAlign: 'left',fontSize: 15}}>Current Catalog</Text>
          </View>
          <View style={styles.imageCont}>

            <FlatList data={props.booksC}
              vertical={true}
              renderItem={({ item, index }) => renderRow(item)} />      
          </View>

      </View>
    </Modal>
  )
}

return (
    <View style={styles.container}>
        <MapView
            style={{...StyleSheet.absoluteFillObject}}
            initialRegion={{
                latitude: 34.070552338396695,
                longitude: -118.44415646276776,
                latitudeDelta: .03,
                longitudeDelta: .03
            }} >
            
            <Marker
                coordinate={{ latitude: 34.070552338396695, longitude: -118.44415646276776 }}
                title='Ackerman Grand Ballroom'
                onCalloutPress={handleOpenBottomSheet}
            
            >
            </Marker>
            <Marker
              coordinate={{latitude: 34.071804633660406, longitude: -118.45139024588147}}
              title='The Hill'
              onCalloutPress={handleOpenBottomSheetHill}
              >
            </Marker>
            <Marker
              coordinate={{latitude: 34.06092689230064, longitude: -118.4459415512844}}
              title='Westwood Village'
              onCalloutPress={handleOpenBottomSheetWest}
              >
            </Marker>
            <Marker
              coordinate={{latitude: 34.03993942083151, longitude: -118.44281384255683}}
              title='Sawtelle'
              onCalloutPress={handleOpenBottomSheetSaw}
              >
            </Marker>
        </MapView>
        <CustomModal isBottomSheetOpenC={isBottomSheetOpen} handleCloseBottomSheetC={handleCloseBottomSheet} booksC={books} name="A"/>
        <CustomModal isBottomSheetOpenC={isBottomSheetOpenHill} handleCloseBottomSheetC={handleCloseBottomSheetHill} booksC={booksHill} name="The Hill                     "/>
        <CustomModal isBottomSheetOpenC={isBottomSheetOpenWest} handleCloseBottomSheetC={handleCloseBottomSheetWest} booksC={booksWest} name="Westwood Village  "/>
        <CustomModal isBottomSheetOpenC={isBottomSheetOpenSaw} handleCloseBottomSheetC={handleCloseBottomSheetSaw} booksC={booksSaw} name="Sawtelle                    "/>

    </View>
  );
};



export default MapScreen;
