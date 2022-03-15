import {Dimensions, StyleSheet} from 'react-native';
import {fontMaker} from '../../utility/helper';

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 10,
    width: deviceWidth * 0.9,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  recordText: {
    ...fontMaker('bold'),
    fontSize: 20,
  },
  recordView: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  containerStyle: {
    backgroundColor: '#E5E5E5',
    flex: 1,
  },
  textStyle: {
    fontFamily: 'OpenSans-Italic',
    ...fontMaker('bold'),
    fontSize: 20,
  },
  buttonText: {
    paddingVertical: 10,
    ...fontMaker('semiBold'),
    fontSize: 16,
    textAlign: 'center',
    width: 50,
  },
  addSectionButton: {
    borderWidth: 1,
    borderRadius: 2,
    width: '20%',
  },
  addSectionButtonText: {
    paddingVertical: 10,
    ...fontMaker('semiBold'),
    fontSize: 16,
    textAlign: 'center',
  },
  buttonView: {
    paddingVertical: 10,
    alignSelf: 'center',
  },
  touchableStyle: {
    // marginTop: 5,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadImageButton: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

export default styles;
