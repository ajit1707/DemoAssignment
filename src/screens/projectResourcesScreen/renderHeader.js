import React, {PureComponent} from 'react';
import {Text, View} from 'react-native';
import Style from './style';

class RenderHeader extends PureComponent {
  render() {
    return (
      <View style={{paddingVertical: 20}}>
        <Text style={Style.flatListHeader}>
          Here is a list of hand-picked resources for your mentoring programme
        </Text>
      </View>
    );
  }
}
export default RenderHeader;
