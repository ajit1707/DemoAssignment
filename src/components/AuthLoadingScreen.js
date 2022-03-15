import React from 'react';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import {authorization} from '../modules/authorization';

export default class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    const {
      navigation: {dispatch},
    } = this.props;
    dispatch(authorization());
  }
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
