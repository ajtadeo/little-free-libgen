import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

const CloseExchange = ({navigation}) => {


  const [bookScanned, setBookScanned] = useState(false);

  const handleScanButtonPress = ({navigation}) => {
    setBookScanned(true);
  };

  const handleCloseButtonPress = () => {
    // Handle the second button press
    navigation.popToTop();
  };

  return (
    <View style={styles.container}>
      <Button title="Scan the book taken" onPress={handleScanButtonPress} />
      <Text>
        Author: XXXXX
      </Text>
      <Text>
        Title: XXXXX
      </Text>
      <Text>
        IBSN: XXXXX
      </Text>
      <Button title="Lock door" onPress={handleCloseButtonPress} disabled={!bookScanned} />
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



export default CloseExchange;