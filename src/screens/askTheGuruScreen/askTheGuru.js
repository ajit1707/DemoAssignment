import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import Config from '../../utility/config';
import Icon from '../../utility/icons';
import Constant from '../../utility/constant';
import HtmlRenderer from '../../components/HtmlRenderer';
import {Container, TextArea, Button, Spinner, Video} from '../../components';
import {setSideMenuItems} from '../../modules/getProjects';
import LinearGradient from '../../components/LinearGradient';
import {
  getGraduateAnswer,
  sendGraduateQuestion,
  activeGuruData,
  inActiveGuruData,
} from '../../modules/landingPage';
import {errorHandler} from '../../modules/errorHandler';
import {detectHTMLTags} from '../../utility/helper';
import Toast from 'react-native-simple-toast';

const deviceWidth = Dimensions.get('window').width;

class AskTheGuru extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.title && navigation.state.params.title,
  });
  constructor() {
    super();
    this.state = {
      question: '',
    };
  }

  componentDidMount() {
    const {
      dispatch,
      guru: {id},
    } = this.props;
    dispatch(getGraduateAnswer(id)).then((response) => {
      if (this.props.route === 'first') {
        dispatch(activeGuruData(response.data));
      } else if (this.props.route === 'second') {
        dispatch(inActiveGuruData(response.data));
      }
    });
  }

  handleTextChange = (field) => (text) => {
    const newState = {};
    newState[field] = text;
    this.setState(newState);
  };

  submitQuestion = () => {
    const {question} = this.state;
    const {
      dispatch,
      responsibleMail,
      userDetail,
      projectSessionPayload,
      selectedProjectPayload,
    } = this.props;
    let isProjectArchived = false;
    let archivedMessage = Constant.ARCHIVED_PROJECT;
    if (
      projectSessionPayload &&
      projectSessionPayload.data &&
      projectSessionPayload.data.length &&
      projectSessionPayload.data[0].attributes.is_archived === true
    ) {
      isProjectArchived = projectSessionPayload.data[0].attributes.is_archived;
    }
    if (
      selectedProjectPayload &&
      selectedProjectPayload.data &&
      selectedProjectPayload.data.attributes.is_archived === true
    ) {
      isProjectArchived = selectedProjectPayload.data.attributes.is_archived;
    }
    if (
      userDetail &&
      userDetail.data &&
      userDetail.data.length &&
      userDetail.data[0].attributes &&
      userDetail.data[0].attributes.is_archived === true
    ) {
      isProjectArchived = userDetail.data[0].attributes.is_archived;
      archivedMessage = Constant.USER_ARCHIVED;
    }
    if (
      (userDetail &&
        userDetail.data &&
        userDetail.data.length &&
        userDetail.data[0].attributes &&
        userDetail.data[0].attributes.is_archived === true &&
        selectedProjectPayload &&
        selectedProjectPayload.data &&
        selectedProjectPayload.data.attributes &&
        selectedProjectPayload.data.attributes.is_archived === true) ||
      (projectSessionPayload &&
        projectSessionPayload.data &&
        projectSessionPayload.data.length &&
        projectSessionPayload.data[0].attributes &&
        projectSessionPayload.data[0].attributes.is_archived === true)
    ) {
      archivedMessage = Constant.ARCHIVED_PROJECT;
    }
    if (isProjectArchived === false) {
      if (question.trim() === '') {
        dispatch(errorHandler(Constant.ENTER_QUESTION));
        this.setState({question: ''});
      } else if (responsibleMail === '') {
        dispatch(errorHandler(Constant.NO_EMAIL_FOR_GRADUATE));
      } else {
        const {
          userDetailPayload: {
            data: [{id: projectUserId}],
          },
          guru: {id},
        } = this.props;
        const payload = {
          data: {
            type: 'graduate_questions',
            attributes: {
              content: question,
              project_user_id: projectUserId,
              graduate_id: id,
            },
          },
        };
        dispatch(sendGraduateQuestion(payload)).then(() => {
          this.setState({question: ''});
        });
      }
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };

  render() {
    const {
      getAskGraduateDetailsPayload,
      sideMenuItems,
      guru: {attributes},
      featuredOn,
      inActiveData,
      activeData,
      route,
      guru,
    } = this.props;
    let graduateAnswerPayload = '';
    if (
      route === 'first' &&
      activeData !== null &&
      activeData.data.length &&
      activeData.data[0].attributes.graduate_id.toString() === guru.id
    ) {
      graduateAnswerPayload = activeData;
    }
    if (
      route === 'second' &&
      inActiveData !== null &&
      inActiveData.data.length &&
      inActiveData.data[0].attributes.graduate_id.toString() === guru.id
    ) {
      graduateAnswerPayload = inActiveData;
    }
    const expertIsActive = attributes.state === 'active';
    const expertName = attributes.name;
    const expertSubtitle = attributes.title;
    const expertDescription = attributes.description;
    const expertImageURL = attributes.image_id
      ? {uri: `${Config.IMAGE_SERVER_CDN}${attributes.image_id}`}
      : Icon.NO_EXPERT;
    const expertTitle = getAskGraduateDetailsPayload.data[0].attributes
      .replacement_text_enabled
      ? getAskGraduateDetailsPayload.data[0].attributes.replacement_text
      : 'Expert';
    const videoUrlAvailable = !!attributes.video_url;
    let videoUrl;
    const questionText = getAskGraduateDetailsPayload.data[0].attributes
      .holding_question_text
      ? getAskGraduateDetailsPayload.data[0].attributes.holding_question_text
      : `Use the form below to send a question to this ${expertTitle}. ` +
        'Once we have questions in from everyone, ' +
        `we'll interview the ${expertTitle} and put it up in the "Featured ${expertTitle}" section.`;
    const videoType = attributes.video_type;
    const graduateHasAnswered =
      graduateAnswerPayload &&
      graduateAnswerPayload.data &&
      graduateAnswerPayload.data.length !== 0;
    let answerTitle;
    let answerImage;
    let answerBody;
    let imageId;
    if (graduateHasAnswered) {
      [
        {
          attributes: {body: answerBody, title: answerTitle, image_id: imageId},
        },
      ] = graduateAnswerPayload.data;
      answerImage = imageId && {uri: `${Config.IMAGE_SERVER_CDN}${imageId}`};
    }
    if (videoUrlAvailable) {
      if (videoType === 'youtube') {
        const regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        const match = attributes.video_url.match(regExp);
        videoUrl = `https://www.youtube.com/embed/${match[1]}`;
      } else {
        const regExp = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;
        const match = attributes.video_url.match(regExp);
        videoUrl = `https://player.vimeo.com/video/${match[4]}`;
      }
    }
    return (
      <Container>
        <KeyboardAwareScrollView bounces={false} enableOnAndroid>
          <View style={styles.container}>
            <LinearGradient
              style={styles.linearGradient}
              colors={[
                `${sideMenuItems.sideMenuColor}`,
                `${sideMenuItems.sideMenuColor}80`,
              ]}
              start={{x: 0, y: 1}}
              end={{x: 0, y: 0}}>
              <Image
                accessible
                accessibilityLabel={`${expertName} Profile Picture`}
                accessibilityRole="image"
                style={styles.image}
                source={expertImageURL}
              />
              <Text style={styles.expertName}>{expertName}</Text>
            </LinearGradient>

            <Text style={styles.expertSubtitle}>{expertSubtitle}</Text>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}>
              <HtmlRenderer
                baseFontStyle={styles.expertDescription}
                html={expertDescription}
              />
            </View>
            {videoUrlAvailable && (
              <View accessible accessibilityLabel="Graduate video">
                <Video
                  html={
                    '<html><meta name="viewport" content="width=device-width", initial-scale=1 />' +
                    `<iframe src="${videoUrl}"` +
                    ` frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:200
                                        ;width:${deviceWidth}*0.9;position:absolute;top:0px;left:0px;right:0px;
                                        bottom:0px" height="100%" width="100%"  controls>` +
                    '</iframe>' +
                    '</html>'
                  }
                  parentViewStyle={styles.video}
                />
              </View>
            )}
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: sideMenuItems.sideMenuColor,
              }}
            />
            {graduateHasAnswered ? (
              <View>
                <Text
                  style={[
                    styles.answerDefault,
                    {color: sideMenuItems.sideMenuColor},
                  ]}>
                  Answer
                </Text>
                <View
                  style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: sideMenuItems.sideMenuColor,
                  }}
                />
                {answerTitle ? (
                  <Text style={styles.askExpert}>{answerTitle}</Text>
                ) : null}
                {imageId ? (
                  <Image
                    resizeMode="contain"
                    style={styles.imageStyle}
                    source={answerImage}
                  />
                ) : null}
                {answerBody ? (
                  detectHTMLTags(answerBody) ? (
                    <HtmlRenderer
                      baseFontStyle={styles.expertDescription}
                      html={answerBody
                        .replace(/<\/p>/gim, '</div>')
                        .replace(/(<p)/gim, '<div')}
                      tagsStyles={{p: {textAlign: 'center'}}}
                      containerStyle={styles.containerStyle}
                    />
                  ) : (
                    <Text style={styles.expertDescription}>{answerBody}</Text>
                  )
                ) : null}
              </View>
            ) : expertIsActive && !featuredOn ? (
              <View>
                <Text style={styles.askExpert}>
                  Ask the {expertTitle} a question!
                </Text>
                {detectHTMLTags(questionText) ? (
                  <HtmlRenderer
                    baseFontStyle={styles.expertDescription}
                    html={questionText}
                    containerStyle={styles.containerStyle1}
                  />
                ) : (
                  <Text style={styles.expertDescription}>{questionText}</Text>
                )}
                <View style={styles.textAreaContainer}>
                  <TextArea
                    onChangeText={this.handleTextChange('question')}
                    value={this.state.question}
                    placeholder="Ask your question here!"
                    maxLength={2000}
                    multiLine
                    style={styles.textArea}
                  />
                </View>
                <Button
                  style={[
                    styles.buttonContainer,
                    {borderColor: sideMenuItems.sideMenuColor},
                  ]}
                  onPress={this.submitQuestion}>
                  <Text
                    style={[
                      styles.buttonText,
                      {color: sideMenuItems.sideMenuColor},
                    ]}>
                    {'Send question'}
                  </Text>
                </Button>
              </View>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
        <Spinner animating={this.props.fetching} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '90%',
    marginBottom: 30,
  },
  imageStyle: {
    width: '100%',
    height: 200,
  },
  containerStyle: {
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  containerStyle1: {
    alignItems: 'center',
    flex: 1,
  },
  expertDescription: {
    fontSize: 15,
    flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textArea: {
    maxHeight: 120,
    borderColor: '#000',
    borderWidth: 1,
    height: 100,
    width: '100%',
    color: '#000',
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    padding: 10,
  },
  buttonContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 20,
    width: 150,
    height: 40,
  },
  textAreaContainer: {
    justifyContent: 'center',
    marginTop: 20,
    borderColor: '#000',
  },
  image: {
    borderWidth: 1,
    borderColor: '#fff',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 20,
  },
  expertName: {
    marginVertical: 15,
    fontSize: 25,
    alignSelf: 'center',
    color: '#fff',
  },
  expertSubtitle: {
    fontSize: 20,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 15,
  },
  video: {
    height: 220,
    width: '100%',
    alignSelf: 'center',
  },
  askExpert: {
    marginVertical: 15,
    fontSize: 20,
    textAlign: 'center',
  },
  askExpertText: {
    marginTop: 5,
    fontSize: 15,
    alignSelf: 'center',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 18,
  },
  linearGradient: {
    borderRadius: 5,
    marginBottom: 15,
    marginTop: 10,
    width: deviceWidth * 0.95,
    alignSelf: 'center',
  },
  answerDefault: {
    marginVertical: 10,
    fontSize: 20,
    alignSelf: 'center',
  },
});

AskTheGuru.propTypes = {
  navigation: PropTypes.object.isRequired,
  userDetailPayload: PropTypes.object.isRequired,
  sideMenuItems: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  getAskGraduateDetailsPayload: PropTypes.object.isRequired,
  guru: PropTypes.object.isRequired,
  graduateAnswerPayload: PropTypes.object.isRequired,
  fetching: PropTypes.bool.isRequired,
  responsibleMail: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  sideMenuItems: setSideMenuItems(state),
  pushNotificationToken: state.pushNotificationReducer.pushNotificationToken,
  getAskGraduateDetailsPayload:
    state.askGraduateCardReducer.getAskGraduateDetailsPayload,
  graduateAnswerPayload: state.askGraduateCardReducer.graduateAnswerPayload,
  activeData: state.askGraduateCardReducer.activeData,
  inActiveData: state.askGraduateCardReducer.inActiveData,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  fetching: state.askGraduateCardReducer.fetching,
  userDetail: state.getUserDetail.userDetailPayload,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
});

export default connect(mapStateToProps)(AskTheGuru);
