import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';


let camera;

const StartExchange = ({navigation}) => {

  // Variables for dropdown menu
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
      {label: 'Ackerman Grand Ballroom', value: 'ackerman'},
      {label: 'Venice Beach', value: 'venice'},
      {label: 'Malibu', value: 'malibu'},
  ]);

  const [bookScanned, setBookScanned] = useState(false);

  const [cameraOn, setCameraOn] = useState(false);

  const handleScanButtonPress = async () => {

    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if(status === 'granted'){
      setCameraOn(true);
    }else{
      Alert.alert("Access denied")
    }
    // setBookScanned(true);
  };

  const handleOpenButtonPress = () => {
    // Open door - need to send data to arduino
    
    // Go to next page on success
    navigation.navigate('CloseExchange')
  };

  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };



  return (
    <View style={styles.container}>
      {cameraOn ? (
        <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      ) : (
      <>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder={'Select a Location'}
        />
        <Button title="Scan your book" onPress={handleScanButtonPress} disabled={value == null}/>
        <Text>
          Author: XXXXX
        </Text>
        <Text>
          Title: XXXXX
        </Text>
        <Text>
          IBSN: XXXXX
        </Text>
        <Button title="Unlock door" onPress={handleOpenButtonPress} disabled={!bookScanned} />

      </>
      )}
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
  }
});



export default StartExchange;