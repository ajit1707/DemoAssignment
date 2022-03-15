import {StyleSheet, Dimensions} from 'react-native';
import {fontMaker} from '../../utility/helper';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const forgotPasswordTextSize = 13;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    flex: 1,
    marginLeft: -15,
    marginTop: -15,
    flexDirection: 'row',
    marginBottom: 2,
  },
  linearGradient: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
    marginTop: deviceHeight * 0.03,
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
    marginBottom: deviceHeight * 0.02,
    height: deviceHeight * 0.08,
    ...fontMaker('regular'),
  },
  authButton: {
    justifyContent: 'center',
    borderRadius: 5,
    height: 50,
    shadowOpacity: 1,
  },
  authButtonText: {
    fontSize: 18,
    color: '#fff',
    alignSelf: 'center',
    ...fontMaker('semiBold'),
  },
  forgotButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#c4c3cb',
    fontSize: forgotPasswordTextSize,
    ...fontMaker('regular'),
  },
  forgotPasswordText2: {
    color: '#000',
    fontSize: forgotPasswordTextSize,
    ...fontMaker('semiBold'),
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: 17,
  },
  nameText: {
    color: '#999',
    ...fontMaker('regular'),
    fontSize: 14,
    marginLeft: 1,
  },
});

export default styles;
