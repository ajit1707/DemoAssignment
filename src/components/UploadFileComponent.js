import React from 'react';
import {SafeAreaView, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import styles from './Styles';

const FileAttachement = (props) => (
  <SafeAreaView style={styles.safeAreaView} {...props}>
    <View>
      <TouchableOpacity />
    </View>
    <View>
      <TouchableOpacity />
    </View>
    <View>
      <TouchableOpacity />
    </View>
  </SafeAreaView>
);

FileAttachement.defaultProps = {
  safeAreaViewColor: '#fff',
};

FileAttachement.propTypes = {
  children: PropTypes.node.isRequired,
  safeAreaViewColor: PropTypes.string,
};

export default FileAttachement;
