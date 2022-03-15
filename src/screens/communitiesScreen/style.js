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
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'black',
    marginTop: 20,
  },
  noDataFound: {
    alignSelf: 'center',
    flex: 1,
    color: '#444',
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 15,
    width: '100%',
    paddingHorizontal: 15,
    ...fontMaker('bold'),
  },
});

export default styles;
