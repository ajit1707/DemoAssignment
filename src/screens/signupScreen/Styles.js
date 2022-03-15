import {Dimensions, StyleSheet} from 'react-native';
import Color from '../../utility/colorConstant';
import {fontMaker} from '../../utility/helper';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: 'OpenSans-Italic',
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  link: {
    color: Color.LINK,
    textDecorationLine: 'underline',
  },
  linkContainer: {
    width: deviceWidth * 0.8,
    marginBottom: 30,
    marginTop: 10,
  },
  screenContainer: {
    flex: 1,
    marginTop: deviceHeight * 0.03,
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
  },
  logoImage: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: deviceWidth * 0.8,
    marginBottom: deviceHeight * 0.003,
  },
  loginFormView: {
    flex: 1,
  },
  loginFormTextInput: {
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 15,
    width: deviceWidth * 0.85,
    marginVertical: deviceHeight * 0.03,
    height: deviceHeight * 0.08,
    ...fontMaker('regular'),
  },
  forgotPasswordText: {
    marginBottom: deviceHeight * 0.03,
    fontFamily: 'OpenSans-Italic',
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    width: deviceWidth * 0.8,
  },
  authButton: {
    justifyContent: 'center',
    borderRadius: 25,
    height: deviceHeight * 0.08,
    shadowOpacity: 1,
    width: deviceWidth * 0.85,
  },
  authButtonText: {
    fontSize: 18,
    color: '#fff',
    alignSelf: 'center',
    ...fontMaker('semiBold'),
  },
  alreadyAccountText: {
    ...fontMaker('regular'),
    fontSize: 15,
    color: Color.PLACEHOLDER,
  },
});

export default styles;
