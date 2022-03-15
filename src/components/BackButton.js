import React from 'react';
import {View, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const BackButton = (props) => (
  <View style={styles.backButton}>
    <TouchableOpacity
      onPress={props.goBack}
      accessibilityLabel="Go Back"
      accessibilityRole="button">
      <FontAwesome name="angle-left" size={40} color="#054B6C" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  backButton: {
    marginTop: deviceHeight * 0.05,
    marginLeft: deviceWidth * 0.1,
  },
});
export default BackButton;
