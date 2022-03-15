import React from 'react';
import PropTypes from 'prop-types';
import {Text, Image, StyleSheet} from 'react-native';
import {Container} from './index';
import {fontMaker} from '../utility/helper';
import Icon from '../utility/icons';
import Constant from '../utility/constant';
import Button from './Button';

const NoInternetConnection = (props) => {
  const {handleSubmit} = props;
  return (
    <Container containerStyle={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={Icon.NO_INTERNET_CONNECTION_IMAGE}
      />
      <Text style={styles.whoopsText}>Whoops!</Text>
      <Text style={styles.messageText}>{Constant.NETWORK_ERROR}</Text>
      <Button style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Retry</Text>
      </Button>
    </Container>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  image: {
    height: 120,
    width: 150,
    alignSelf: 'center',
  },
  whoopsText: {
    color: '#444',
    fontSize: 30,
    ...fontMaker('bold'),
    marginTop: 10,
    alignSelf: 'center',
  },
  messageText: {
    color: '#444',
    fontSize: 17,
    textAlign: 'center',
    marginVertical: 10,
    ...fontMaker('semi-bold'),
  },
  footerText: {
    color: '#666666',
    textAlign: 'center',
    marginVertical: 30,
    ...fontMaker('italic'),
    fontSize: 16,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 100,
    height: 50,
    borderRadius: 3,
    borderWidth: 2,
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 15,
    alignSelf: 'center',
    ...fontMaker('bold'),
  },
});

NoInternetConnection.defaultProps = {
  handleSubmit: () => {},
};

NoInternetConnection.propTypes = {
  handleSubmit: PropTypes.func,
};

export default NoInternetConnection;
