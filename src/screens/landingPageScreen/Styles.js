import {Dimensions, StyleSheet} from 'react-native';
import {fontMaker} from '../../utility/helper';

const deviceWidth = Dimensions.get('window').width;
const imageHeight = 65;
const imageWidth = 65;
const imageBorderRadius = 35;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '93%',
    marginTop: '35%',
  },
  containerConnection: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '93%',
    marginTop: '1%',
  },
  headerStyles: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 20,
  },
  textStyle: {
    fontFamily: 'OpenSans-Italic',
    ...fontMaker('regular'),
    fontSize: 24,
  },
  buttonComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 50,
    borderRadius: 3,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '92%',
    height: '87%',
    marginBottom: '5%',
  },
  img: {
    width: '100%',
    height: deviceWidth * 0.58,
    resizeMode: 'cover',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#666',
    ...fontMaker('bold'),
    fontSize: 18,
    marginTop: '5%',
  },
  textTitle: {
    marginLeft: '4%',
    color: '#007994',
    fontSize: 18,
    marginVertical: '3%',
    textAlign: 'center',
  },
  wordstyle: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    backgroundColor: '#e28834',
    marginLeft: deviceWidth * 0.37,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2%',
  },
  number: {
    color: '#fff',
    ...fontMaker('bold'),
    fontSize: 30,
  },
  startView: {
    marginTop: '4%',
    backgroundColor: '#fff',
  },
  titleStart: {
    color: '#666',
    ...fontMaker('semi-bold'),
    fontSize: 18,
    marginVertical: '3%',
    marginHorizontal: '8%',
    textAlign: 'center',
  },
  buttonComponentStart: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    ...fontMaker('bold'),
    color: '#fff',
  },
  press: {
    marginHorizontal: 6,
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 7,
  },
  enter: {
    ...fontMaker('bold'),
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 7,
  },
  button: {
    backgroundColor: '#e28834',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginVertical: '1%',
  },
  pressEnter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default styles;
