import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Style from './style';
import Form from '../../components/Form';

export default class MentoringScreen extends Component {
  navigate = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {fetching} = this.props;
    return (
      <Form fetching={fetching}>
        <View style={Style.container}>
          <TouchableOpacity
            onPress={() => {
              this.navigate;
            }}>
            <Text>Mentoring Screen</Text>
          </TouchableOpacity>
        </View>
      </Form>
    );
  }
}
