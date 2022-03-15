import {StyleSheet, Dimensions} from 'react-native';
import Color from '../../utility/colorConstant';
import {fontMaker} from '../../utility/helper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 3,
    marginVertical: 4,
    backgroundColor: '#fff',
  },
  dialogButtonStyle: {
    alignSelf: 'center',
  },
  containerStyle: {
    backgroundColor: '#E5E5E5',
    flex: 1,
  },
  shadow: {
    shadowColor: Color.CHANNEL_SEPARATOR_COLOR,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  leftImageContainer: {
    width: '25%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 7,
    alignContent: 'flex-start',
  },
  image: {
    width: '100%',
    height: 80,
    maxHeight: 80,
  },
  rightContainer: {
    width: '60%',
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginRight: 7,
    alignContent: 'flex-start',
    justifyContent: 'center',
  },
  rightTopContainer: {
    flexDirection: 'row',
  },
  rightMiddleContainer: {
    marginTop: 1,
    width: '95%',
  },
  rightBottomContainer: {
    marginTop: 1,
    width: '95%',
  },
  downloadContainer: {
    width: '15%',
    paddingHorizontal: 7,
    justifyContent: 'center',
    marginRight: 7,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  boldTextTitle: {
    color: '#000',
    fontSize: 16,
    paddingVertical: 3,
  },
  boldDateTitle: {
    ...fontMaker('italic'),
  },
  boldmenteeTitle: {
    ...fontMaker('italic'),
    paddingVertical: 3,
  },
  loaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    ...fontMaker('semibold'),
  },
  titleText: {
    ...fontMaker('bold'),
  },
  messageStyle: {
    ...fontMaker('regular'),
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  leftButton: {
    textAlign: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
    paddingVertical: 15,
    width: '50%',
  },
  leftButtonStyle: {
    paddingLeft: 50,
    fontSize: 16,
    color: '#000',
    ...fontMaker('semibold'),
  },
  rightButtonStyle: {
    paddingLeft: 50,
    fontSize: 16,
    color: '#000',
    ...fontMaker('semibold'),
  },
  rightButton: {
    textAlign: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  dialogContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
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
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
  },
  mentor: {
    color: '#444',
    fontSize: 17,
    ...fontMaker('bold'),
  },
  message: {
    color: '#444',
    fontSize: 15,
    marginTop: 2,
    marginHorizontal: 15,
  },
  noAssignment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
