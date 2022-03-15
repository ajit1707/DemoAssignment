import {Dimensions, StyleSheet} from 'react-native';
import {fontMaker} from '../utility/helper';
import Color from '../utility/colorConstant';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const borderRadius = 10;

const styles = StyleSheet.create({
  spinnerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuContainer: {
    height: deviceHeight * 0.08,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuStyle: {
    height: 22,
    width: 22,
  },
  inputStyle: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: '#000',
    paddingHorizontal: 7,
    fontSize: 18,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  background: {
    flex: 1,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonLabel: {
    fontSize: 20,
    color: '#456E34',
  },
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
  textAreaStyle: {
    maxHeight: 120,
    color: '#000',
    fontSize: 16,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: '#FAFAFA',
  },
  paginationSpinner: {
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  modalViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSubView: {
    height: deviceHeight * 0.7,
    width: deviceWidth * 0.95,
    borderRadius,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    width: deviceWidth * 0.95,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: Color.CHANNEL_SEPARATOR_COLOR,
    borderBottomWidth: 0.5,
  },
  crossButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  crossIcon: {
    height: 13,
    width: 13,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 17,
  },
  nameText: {
    color: '#444444',
    ...fontMaker('semibold'),
    fontSize: 17,
  },
  lastTimeText: {
    color: '#ccc',
    ...fontMaker('semibold'),
    fontSize: 14,
    paddingTop: 2,
  },
  headerText: {
    fontSize: 18,
    paddingLeft: 15,
    width: '70%',
    color: '#000',
    ...fontMaker('semibold'),
  },
  searchBoxContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
    borderRadius: 0.5,
    borderTopWidth: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    width: '100%',
    paddingLeft: 17,
    flexDirection: 'row',
  },
  searchBoxTextInput: {
    fontSize: 16,
    color: '#000',
    paddingLeft: 17,
    transform: [{scaleX: 1.0086}],
    ...fontMaker('regular'),
    width: '95%',
  },
  dialogContainer: {},
  safeContainer: {
    width: '100%',
  },
  alertContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: 20,
  },
  messageContainer: {
    justifyContent: 'center',
    width: '80%',
  },
  messageStyle: {
    ...fontMaker('regular'),
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    ...fontMaker('semibold'),
  },
  titleText: {
    ...fontMaker('bold'),
  },
  subModalContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 17,
  },
  subModalnameText: {
    color: '#444444',
    ...fontMaker('regular'),
    fontSize: 17,
  },
  articleSubModalContainer: {
    flexDirection: 'column',
    paddingHorizontal: 15,
  },
  flatListContainerView: {
    marginVertical: 5,
  },
  itemSeparatorView: {
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  articleSubModalView: {
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  subCategoriesView: {
    backgroundColor: '#fff',
  },
  textInput: {
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 15,
    marginBottom: deviceHeight * 0.03,
    width: deviceWidth * 0.8,
    height: 50,
    ...fontMaker('regular'),
  },
  backButton: {
    marginTop: deviceHeight * 0.05,
    marginLeft: deviceWidth * 0.1,
  },
  checkBox: {
    flexDirection: 'column',
    paddingHorizontal: 15,
  },
  checkBoxItemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 17,
  },
  checkBoxNameText: {
    color: '#444444',
    ...fontMaker('regular'),
    fontSize: 17,
  },
  safeAreaConatiner: {
    flex: 1,
  },
  flatView: {
    marginVertical: 5,
  },
  itemView: {
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  headerView: {
    backgroundColor: '#fff',
  },
  routeView: {
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  safeAreaView: {
    flex: 0.6,
    backgroundColor: '#E2E7ED',
  },
});

export default styles;
