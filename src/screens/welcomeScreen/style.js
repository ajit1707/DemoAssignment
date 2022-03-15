import {StyleSheet, Dimensions} from 'react-native';
import Color from '../../utility/colorConstant';
import {fontMaker} from '../../utility/helper';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const imageHeight = 50;
const imageWidth = 50;
const imageBorderRadius = 25;
const buttonBorderRadius = 5;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewStyle: {
    flex: 0.15,
  },
  subContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  headerStyles: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 20,
  },
  textStyle: {
    fontFamily: 'OpenSans-Italic',
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    height: 50,
    width: deviceWidth * 0.9,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  button: {
    flex: 0.5,
    borderTopWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderWidth: 0.5,
    backgroundColor: Color.LOGO,
  },
  signInButton: {
    borderLeftColor: 'transparent',
    borderRightColor: '#ccc',
    borderBottomLeftRadius: buttonBorderRadius,
    borderTopLeftRadius: buttonBorderRadius,
  },
  signUpButton: {
    borderRightColor: 'transparent',
    borderLeftColor: '#ccc',
    borderBottomRightRadius: buttonBorderRadius,
    borderTopRightRadius: buttonBorderRadius,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  imageLogo: {
    height: deviceWidth * 0.215,
    width: deviceWidth * 0.779,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    backgroundColor: '#ccc',
    marginTop: 60,
  },
  profileImage: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    backgroundColor: '#ccc',
  },
  LoginbuttonContainer: {
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  button_1: {
    justifyContent: 'center',
    width: 240,
    height: 50,
    alignItems: 'center',
    backgroundColor: Color.LOGO,
    flexDirection: 'row',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  buttonText_1: {
    padding: 20,
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  container_1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 3,
    marginVertical: 4,
    backgroundColor: '#fff',
  },
  leftImageContainer: {
    width: '25%',
    paddingVertical: 2,
    paddingLeft: 3,
    marginVertical: 4,
    marginLeft: 2,
    alignContent: 'flex-start',
  },
  rightContainer: {
    width: '66%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 1,
    marginRight: 1,
    marginVertical: 2,
  },
  boldTextTitle: {
    color: '#666',
    fontSize: 16,
    ...fontMaker('bold'),
    paddingVertical: 3,
  },
  rememberBox: {
    marginTop: deviceHeight * 0.08,
    width: '80%',
    flexDirection: 'row',
    borderColor: Color.LOGO,
    borderWidth: 1,
    marginHorizontal: 8,
    borderRadius: 9,
  },
});

export default styles;
