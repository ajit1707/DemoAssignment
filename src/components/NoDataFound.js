import React from 'react';
import PropTypes from 'prop-types';
import {Text, Image, StyleSheet, Dimensions} from 'react-native';
import {Container} from './index';
import {fontMaker} from '../utility/helper';
import Icon from '../utility/icons';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const NoDataFound = (props) => (
  <Container style={styles.container}>
    <Image
      style={styles.image}
      source={Icon.NO_RESULT_FOUND}
      resizeMode="contain"
    />
    <Text style={styles.messageText}>{props.title}</Text>
  </Container>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    marginTop: 5,
  },
  image: {
    height: deviceHeight * 0.25,
    width: deviceWidth,
    justifyContent: 'flex-end',
  },
  messageText: {
    color: '#444',
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 10,
    ...fontMaker('bold'),
  },
});

NoDataFound.defaultProps = {
  title: '',
};

NoDataFound.propTypes = {
  title: PropTypes.string,
};

export default NoDataFound;
