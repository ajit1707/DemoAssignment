import {Dimensions, StyleSheet} from 'react-native';
import {fontMaker} from '../../utility/helper';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    marginVertical: deviceWidth * 0.025,
    width: deviceWidth * 0.95,
  },
  imageBackground: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionStyle: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  categoryText_ouestion: {
    marginVertical: 8,
    fontSize: 18,
    color: '#fff',
    ...fontMaker('semi-bold'),
  },
  categoryText: {
    fontSize: 18,
    marginVertical: 8,
    color: '#fff',
    marginLeft: 15,
    ...fontMaker('semi-bold'),
  },
  categoryTitleTextView: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#fff',
    width: '100%',
  },
  categoryQuestionTextView: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#fff',
    width: '100%',
  },
  titleText: {
    ...fontMaker('bold'),
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 2,
    color: '#000',
  },
  title_Text: {
    ...fontMaker('bold'),
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 1,
    color: '#000',
  },
  imageContainer: {
    width: deviceWidth * 0.9,
    height: deviceHeight * 0.3,
    alignSelf: 'center',
    marginVertical: 8,
  },
  holdingDetail: {
    fontSize: 18,
    alignItems: 'center',
    alignSelf: 'center',
    color: '#000',
  },
  holding_Detail: {
    width: '100',
    fontSize: 18,
    alignItems: 'center',
    alignSelf: 'center',
    color: '#000',
  },
  questionBackground: {
    flex: 1,
    width: deviceWidth * 0.95,
    backgroundColor: '#E5E5E5',
    alignSelf: 'center',
  },
  webViewContainer: {
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.85,
  },
  webViewContainerIos: {
    height: deviceHeight * 0.25,
    width: deviceWidth * 0.85,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  htmlQuestionView: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e7ed',
    alignSelf: 'center',
  },
  htmlMCQView: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e7ed',
    width: '100%',
    paddingHorizontal: '2.5%',
    paddingTop: '2%',
  },
  textStyle: {
    width: '95%',
    color: '#000',
    height: deviceWidth * 0.3,
    textAlignVertical: 'top',
    fontSize: 15,
    alignSelf: 'center',
    marginVertical: 15,
  },
  fontStyle: {
    paddingVertical: 10,
  },
  baseFontStyle: {
    marginHorizontal: 5,
    fontSize: 18,
    color: '#000',
  },
  buttonFontStyle: {
    paddingHorizontal: 5,
    fontSize: 18,
  },
  imagesInitialDimensions: {
    width: deviceWidth * 0.9,
    height: 200,
    alignItems: 'center',
    marginTop: '2.5%',
  },
  submitButton: {
    paddingHorizontal: 25,
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 2,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  imageVideoContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginVertical: '2.5%',
  },
  introText: {
    width: deviceWidth * 0.95,
    alignItems: 'center',
    alignSelf: 'center',
  },
  intro_Text: {
    marginVertical: -12,
  },
  mcqContainer: {
    alignItems: 'flex-start',
    marginVertical: 10,
    width: '100%',
  },
  prevNextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  mcqComponent: {
    marginTop: 10,
    flex: 1,
    marginLeft: 3,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  tagStyles: {
    width: deviceWidth * 0.9,
    height: 200,
    alignItems: 'center',
    marginVertical: '2.5%',
    alignSelf: 'center',
  },
  tagStyles_p: {
    paddingHorizontal: 5,
  },
  submit_Button: {
    paddingTop: '2%',
    paddingBottom: '5%',
  },
});

export default styles;
