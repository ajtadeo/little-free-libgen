


// const StartExchange = () => { 

// }

// export default StartExchange; import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

const CloseExchange = () => {
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [firstButtonPressed, setFirstButtonPressed] = useState(false);

  const handleFirstButtonPress = () => {
    setFirstButtonPressed(true);
  };

  const handleSecondButtonPress = () => {
    // Handle the second button press
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Field 1"
        value={field1}
        onChangeText={(text) => setField1(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Field 2"
        value={field2}
        onChangeText={(text) => setField2(text)}
      />
      <Button title="First Button" onPress={handleFirstButtonPress} />
      {firstButtonPressed && (
        <Button title="Second Button" onPress={handleSecondButtonPress} />
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



export default CloseExchange;