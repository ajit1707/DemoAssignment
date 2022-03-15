import {StyleSheet} from 'react-native';
import {fontMaker} from '../../utility/helper';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStyles: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 20,
  },
  textStyle: {
    fontFamily: 'OpenSans-Italic',
  },
  boldTextTitle: {
    fontSize: 14,
    marginVertical: 2,
    ...fontMaker('bold'),
  },
});

export default styles;
