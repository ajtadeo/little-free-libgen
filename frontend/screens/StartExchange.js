import { View, Text, Image, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Constants from "expo-constants";

// Replace uri with localhost:8000
const uri = Constants.manifest2.extra.expoClient.hostUri.split(':').shift().concat(':8000');

const API_KEY = "51458_52142ed37a007c81c614e8f9f6aa4d7a" // lol
const DIRECTIONS = 0;
const SCANNING = 1;
const CONFIRMATION = 2;

const StartExchange = ({ navigation }) => {

  const [state, setState] = useState(DIRECTIONS);
  const [scanned, setScanned] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageURI, setImageURI] = useState("");
  const [isbn, setISBN] = useState("");

  const getBookInfoFromISBN = async (bookISBN) => {
    const bookRequest = await axios.get('https://api2.isbndb.com/book/' + bookISBN,
      { headers: { 'User-Agent': 'insomnia/5.12.4', 'Authorization': API_KEY } })

    const bookData = bookRequest.data.book;

    // Outputs
    const bookImageURI = bookData.image;
    const bookAuthorNameSplit = bookData.authors[0].split(", ").reverse()
    const bookAuthor = bookAuthorNameSplit.join(" ");
    const bookTitle = bookData.title;

    // console.log(bookImageURI);
    // console.log(bookAuthor);
    // console.log(bookTitle);

    return [bookTitle, bookAuthor, bookImageURI, bookISBN]
  }

  const handleOpenCamera = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status === 'granted') {
      setState(SCANNING);
    } else {
      Alert.alert("Error", "Access denied")
    }
  };

  const addBookToDB = async () => {
    try {
      const response = await axios.post('http://' + uri + '/add-book', {
        title: title,
        author: author,
        isbn: isbn,
      })

      if (response.data) {
        // Book successfully added
        // do stuff

      } else {
        Alert.alert("book couldn't be saved");
      }

    } catch (error) {
      // An error occurred
      // Show an error message or do something else
      Alert.alert(error)
    }
  }

  const handleUnlockLibrary = () => {
    addBookToDB()
    // TODO: send HTTP POST request to arduino
    navigation.navigate('CloseExchange')
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    [bookTitle, bookAuthor, bookImageURI, bookISBN] = await getBookInfoFromISBN(data);
    setAuthor(bookAuthor);
    setTitle(bookTitle);
    setImageURI(bookImageURI);
    setISBN(bookISBN)
    setState(CONFIRMATION);
  };

  return (
    <LinearGradient
      colors={["#F5CA56", "#ED5658"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      {
        {
          0:
            <View style={styles.container}>
              <Text style={styles.heading}>Checking In</Text>
              <Text style={{fontFamily: "Optima"}}>Scan the barcode for the book you wish to check-in.</Text>
              <Image source={require("../assets/images/barcode.jpg")} style={styles.image} />
              <View style={{ alignItems: 'center' }}>
                <View style={styles.button}>
                  <Button style={{fontFamily: "Optima"}} title="Open Camera" onPress={handleOpenCamera} color="white" />
                </View>
              </View>
            </View>,
          1: <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />,
          2:
            <View style={styles.container}>
              <Text style={styles.heading}>Checking In</Text>
              <Image source={{ uri: imageURI }} style={styles.image} />
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.author}>{author}</Text>
              <View style={{ alignItems: 'center' }}>
                <View style={styles.button}>
                  <Button style={{fontFamily: "Optima"}} title="Unlock Library" onPress={handleUnlockLibrary} color="white" />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {setState(SCANNING); setScanned(false)}}
              >
                <Text style={styles.link}>Not your book?</Text>
              </TouchableOpacity>
            </View>
        }[state]
      }
    </LinearGradient >
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'linear-gradient(#F5CA56, #ED5658)'
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    margin: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5.8,
    // fontFamily: 'Optima'
    // fontFamily: 'Cochin'
  },
  image: {
    width: 300,
    height: 350,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 32,
    textAlign: 'left',
    paddingBottom: 9,
    fontWeight: 'bold',
    fontFamily: 'Cochin'
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 7,
    fontWeight: 'bold',
    paddingTop: 15, 
    fontFamily: 'Optima'
  },
  author: {
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 20,
    fontFamily: 'Optima'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10, 
    fontFamily: 'Optima'
  },
  button: {
    backgroundColor: '#F5CA56',
    borderWidth: 0,
    borderRadius: 20,
    padding: 10,
    width: '50%',
    marginBottom: 7,
    fontFamily: 'Optima'
  },
  link: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ED5658',
    marginBottom: 15,
    fontFamily: 'Optima'
  }
});



export default StartExchange;