import {StyleSheet, Dimensions} from 'react-native';
import {fontMaker} from '../../utility/helper';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    marginTop: deviceHeight * 0.09,
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
  screenContainer: {
    flex: 1,
    marginTop: deviceHeight * 0.03,
    alignItems: 'center',
  },
  forgotPasswordText: {
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
  linkContainer: {
    marginBottom: 30,
  },
});

export default styles;
