import {Dimensions, StyleSheet} from 'react-native';
import {fontMaker} from '../../utility/helper';
import Color from '../../utility/colorConstant';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const imageHeight = 40;
const imageWidth = 40;
const borderWidth = 0.7;
const borderRadius = 20;
const borderColor = '#0078af';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  nextbadgeTitleView: {
    color: '#000',
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 4,
  },
  nextbadgeTitle: {
    color: '#000',
    fontSize: 16,
    ...fontMaker('bold'),
    paddingTop: 5,
    paddingBottom: 4,
  },
  buttonDownload: {
    backgroundColor: '#fff',
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 5,
  },
  buttonTextDownload: {
    color: '#fff',
    fontSize: 16,
  },
  textWithOffline: {
    color: 'black',
    fontSize: 15,
    paddingRight: '3%',
  },
  text: {
    color: 'black',
    fontSize: 15,
  },
  boldWord: {
    color: '#000',
    fontSize: 16,
    ...fontMaker('bold'),
    fontFamily: 'OpenSans-Italic',
  },
  boldItalicWord: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  italicWord: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'OpenSans-Italic',
  },
  linkStyle: {
    color: Color.LINK,
    width: 20,
  },
  marginForMultimedia: {
    marginLeft: 13,
  },
  moderationContainer: {
    paddingHorizontal: 0,
    paddingTop: 5,
  },
  moderationContainerIos: {
    paddingHorizontal: 0,
    paddingTop: 5,
    backgroundColor: Color.HEADER_COLOUR,
    paddingVertical: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerForIos: {
    paddingTop: 65,
  },
  iconTextContainerForIos: {
    paddingTop: 30,
  },
  attachmentComponent: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  downloadIconStyle: {
    resizeMode: 'contain',
    height: 40,
    width: 40,
    alignSelf: 'center',
  },
  fileName: {
    paddingLeft: 0,
    paddingTop: 1,
  },
  webView: {
    backgroundColor: '#000',
  },
  webViewContainerInMessaging: {
    height: deviceHeight * 0.31,
    width: deviceWidth * 0.54,
  },
  youtubeWebViewContainerInMessaging: {
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.56,
  },
  webViewContainerIosInMessaging: {
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.56,
  },
  youtubeWebViewContainerIosInMessaging: {
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.56,
  },
  img: {
    width: '100%',
    height: deviceWidth * 0.5,
    resizeMode: 'cover',
  },
  imageBackground: {
    backgroundColor: '#B30000',
  },
  noChannelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleImageContainer: {
    backgroundColor: '#b9b9b9',
    width: imageWidth,
    height: imageHeight,
    borderRadius,
    borderWidth,
    borderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleImage: {
    width: imageWidth,
    height: imageHeight,
    borderRadius,
    borderWidth,
    borderColor,
  },
  receiverContainer: {
    marginVertical: 5,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  receiverMessageContainer: {
    width: '70%',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  senderContainer: {
    marginVertical: 5,
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  senderMessageContainer: {
    width: '70%',
    alignItems: 'flex-start',
  },
  nameTag: {
    color: '#000',
    fontSize: 12,
    marginRight: 3,
    ...fontMaker('bold'),
  },
  timeTag: {
    color: '#A5A5A5',
    fontSize: 12,
    ...fontMaker('regular'),
  },
  padding5: {
    paddingVertical: 2,
    flexDirection: 'row',
  },
  receiverMessage: {
    backgroundColor: '#0063A8',
    padding: 15,
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  receiverTextContainer: {
    maxWidth: '100%',
    borderRadius: 15,
    marginVertical: 5,
  },
  receiverRadiusContainer: {
    height: 10,
    right: 10,
    left: 10,
    backgroundColor: '#0063A8',
    borderRadius: 15,
    position: 'absolute',
    zIndex: 999,
  },
  receiverMessageText: {
    color: '#fff',
    fontSize: 14,
    ...fontMaker('regular'),
  },
  senderTextContainer: {
    maxWidth: '100%',
    borderRadius: 15,
    marginVertical: 10,
  },
  senderRadiusContainer: {
    height: 10,
    backgroundColor: '#EBEFF2',
    left: 0,
    right: 0,
    borderRadius: 15,
    position: 'absolute',
    zIndex: 999,
  },
  senderMessage: {
    backgroundColor: '#EBEFF2',
    padding: 15,
    paddingVertical: 5,
  },
  senderMessageText: {
    color: '#252728',
    fontSize: 14,
    ...fontMaker('regular'),
  },
  padding2percent: {
    // paddingVertical: '2%',
  },
  relativeContainer: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  flatListContainer: {
    flex: 9,
  },
  textBoxContainer: {
    position: 'relative',
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBoxContainerForBold: {
    backgroundColor: '#FAFAFA',
    width: '100%',
    height: '-2%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '65%',
    color: '#252728',
  },
  textAreaContainer: {
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  sendButtonContainer: {
    width: '10%',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
  },
  sectionContainer: {
    alignItems: 'center',
  },
  sectionItemContainer: {
    paddingVertical: 10,
  },
  sectionText: {
    color: '#A5A5A5',
    fontSize: 14,
    ...fontMaker('regular'),
  },
  fileUploadContainer: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: -17,
  },
  uploadFile: {
    width: deviceWidth * 0.06,
    height: deviceWidth * 0.06,
    resizeMode: 'contain',
  },
  textName: {
    color: '#000',
    fontSize: 16,
    ...fontMaker('bold'),
  },
  textDate: {
    color: '#696969',
    paddingLeft: 5,
    paddingTop: 3,
    fontSize: 13,
    ...fontMaker('regular'),
  },
  textBody: {
    color: '#000',
    fontSize: 15,
    ...fontMaker('regular'),
  },
  textModeration: {
    paddingTop: 5,
    color: '#000',
    fontSize: 14,
    ...fontMaker('bold'),
  },
  nameContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  fadeText: {
    opacity: 0.6,
  },
  channelNoticeTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  moderationText: {
    color: '#f76969',
    paddingVertical: 5,
  },
  attachmentContainer: {
    width: deviceWidth * 0.55,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 0.7,
    borderRadius: 5,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 55,
  },
  attachmentContainerForMultiMedia: {
    width: deviceWidth * 0.55,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 0.7,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 55,
  },
  attachmentContainerForVidoes: {
    width: deviceWidth * 0.55,
    paddingVertical: 4,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 0.7,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 55,
  },
  attachmentContainerForMultiMediaIos: {
    width: deviceWidth * 0.55,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 0.7,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 55,
  },
  downloadButton: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 2,
    paddingHorizontal: 10,
  },
  textContainerForNormal: {
    // paddingHorizontal: 10,
  },
  textContainerIos: {
    // flex: 2,
    marginLeft: 10,
    marginRight: 10,
    paddingHorizontal: 71,
    backgroundColor: Color.HEADER_COLOUR,
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 75,
    justifyContent: 'center',
  },
  textContainerIosSmallDevices: {
    // flex: 2,
    marginLeft: 11.5,
    marginRight: 10,
    paddingHorizontal: 58,
    backgroundColor: Color.HEADER_COLOUR,
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 75,
    justifyContent: 'center',
  },
  channelNoticeMessage: {
    fontSize: 14,
    textAlign: 'center',
    width: deviceWidth * 0.9,
    paddingTop: 5,
  },
  lastTimeActiveContainer: {
    height: 30,
    width: deviceWidth,
    borderTopWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadViewContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FAFAFA',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  crossButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: {
    height: 30,
    width: 30,
  },
  crossIcon: {
    height: 15,
    width: 15,
  },
  fileNameContainer: {
    width: '80%',
    paddingHorizontal: 10,
  },
  fileNameText: {
    color: '#444444',
    ...fontMaker('semibold'),
    fontSize: 17,
  },
  iconWidth: {
    width: '10%',
  },
  continueButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 50,
    borderRadius: 3,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 14,
    alignSelf: 'center',
    ...fontMaker('bold'),
  },
  textArea: {
    borderColor: Color.CHANNEL_SEPARATOR_COLOR,
    borderWidth: 0.5,
    height: 170,
    width: '100%',
    color: '#000',
    fontSize: 18,
    padding: 12,
    backgroundColor: '#fff',
    shadowColor: Color.CHANNEL_SEPARATOR_COLOR,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    textAlignVertical: 'top',
  },
  flagButton: {
    height: 36,
    width: 36,
    paddingTop: 5,
  },
  sectionListFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'row',
    width: '100%',
  },
  sectionListFooterSeparator: {
    height: 1,
    width: '90%',
    backgroundColor: '#ccc',
    alignSelf: 'center',
  },
  sectionListFooterText: {
    color: '#000',
    ...fontMaker('semibold'),
    fontSize: 13,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  sectionListFooterDateContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  moderationBoxLeftContainer: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginVertical: 5,
    borderColor: '#f76969',
    borderRightWidth: 5,
    maxWidth: 230,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginLeft: 13,
  },
  moderationBoxRightContainer: {
    borderRightWidth: 0,
    borderLeftWidth: 5,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 10,
    alignSelf: 'flex-end',
  },
  messageMarginHorizontal: {
    paddingHorizontal: 15,
  },
  bannerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#d1ecf1',
  },
  bannerText: {
    color: '#0c5460',
    fontSize: 14,
    textAlign: 'center',
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginLeft: 55,
    // marginVertical: 2,
    backgroundColor: 'rgba(135,206,235,0.521)',
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignSelf: 'flex-start',
    maxWidth: 260,
  },
  offlineText: {
    marginRight: 7,
  },
  clockIcon: {
    position: 'absolute',
    right: 5,
    bottom: 8,
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginLeft: 55,
    // marginVertical: 2,
    backgroundColor: 'rgba(135,206,235,0.521)',
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignSelf: 'flex-start',
    maxWidth: 260,
  },
  renderMessageBubble: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  sender: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  notSender: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  newBubble: {
    backgroundColor: '#eff0f1',
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 10,
    alignSelf: 'flex-end',
  },
  messageItembackground: {
    backgroundColor: 'rgba(135,206,235,0.2)',
  },
  renderMessageUIOpacity: {
    marginTop: 10,
    flexDirection: 'row',
  },
  messageUiOpacityNotSender: {
    justifyContent: 'flex-end',
  },
  messageView: {
    width: '100%',
  },
  opacityPadding: {
    paddingHorizontal: 15,
  },
  opacityBackground: {
    backgroundColor: 'rgba(135,206,235,0.2)',
  },
  imageView: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  viewNotSender: {
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
  },
  attachmentContainerView: {
    paddingHorizontal: 0,
    paddingTop: 5,
  },
  newTextDate: {
    paddingLeft: 0,
    paddingTop: 1,
  },
  attachmentImage: {
    resizeMode: 'contain',
    height: 40,
    width: 40,
    alignSelf: 'center',
  },
});

export default styles;
