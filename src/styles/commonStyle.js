import {StyleSheet} from 'react-native';
import Color from '../utility/colorConstant';

const styles = StyleSheet.create({
  shadow: {
    borderBottomWidth: 0,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Color.SEPARATOR_COLOR,
  },
});

export default styles;
