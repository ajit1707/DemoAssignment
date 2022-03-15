import React, {Component} from 'react';
import {
  Dimensions,
  ImageBackground,
  Text,
  View,
  Image,
  Platform,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {HeaderBackButton} from 'react-navigation';
import {
  AuthTextInput,
  Button,
  Container,
  HtmlRenderer,
  Video,
} from '../../components';
import {
  getActivityCurrentQuestion,
  patchProjectUserApi,
} from '../../modules/activitiesMentee';
import {getProjectUserMentorActivitiesQuestion} from '../../modules/activitiesMentor';
import LinearGradientBackground from '../../components/LinearGradient';
import Icon from '../../utility/icons';
import Config from '../../utility/config';
import McqAnswerComponent from './mcqQuestionComponent';
import styles from './questionScreenStyles';
import Color from '../../utility/colorConstant';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ActivitiesMentorQuestionScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Review Activity',
    headerLeft: (
      <HeaderBackButton
        tintColor={Color.HEADER_LEFT_BACK_BUTTON}
        onPress={() => navigation.state.params.goBack()}
      />
    ),
  });
  constructor() {
    super();
    this.state = {
      answerIdArray: [],
      answerString: '',
    };
  }

  componentDidMount() {
    const {
      navigation: {
        state: {
          params: {projectUserId, activityId},
        },
        setParams,
      },
      dispatch,
    } = this.props;
    setParams({goBack: this.goBack});
    dispatch(
      getProjectUserMentorActivitiesQuestion(projectUserId, activityId),
    ).then((res) => {
      const {
        data: {
          attributes: {current_question_id},
          id,
        },
      } = res;
      dispatch(getActivityCurrentQuestion(current_question_id, id));
    });
  }

  componentDidUpdate(prevProps) {
    const {currentQuestionPayload} = this.props;
    if (
      prevProps.currentQuestionPayload !== currentQuestionPayload &&
      currentQuestionPayload.data.length > 0
    ) {
      const {
        data: [
          {
            attributes: {state},
          },
        ],
      } = currentQuestionPayload;
      if (
        currentQuestionPayload &&
        (state === 'completed' || state === 'rejected')
      ) {
        const {
          questionData: {
            question: {
              attributes: {type_of},
            },
            answers,
          },
        } = this.props;
        if (type_of === 'text') {
          this.setState({
            answerString: currentQuestionPayload.data[0].attributes.answer,
          });
        } else {
          const arr = [];
          answers.forEach((item) => {
            if (item.attributes.correct) {
              arr.push(item.id);
            }
          });
          this.setState({answerIdArray: arr});
        }
      }
    }
  }

  onRowItemSelect = (id) => {
    const {answerIdArray} = this.state;
    if (answerIdArray.includes(id)) {
      const UpdatedIds = answerIdArray.filter((itemId) => itemId !== id);
      this.setState({answerIdArray: UpdatedIds});
    } else {
      this.setState({answerIdArray: [...new Set([...answerIdArray, id])]});
    }
  };

  onPressNextOrPrevButton = (type) => {
    const {
      currentQuestionPayload: {
        data: [
          {
            attributes: {project_user_activity_id},
          },
        ],
      },
      projectUserMentorActivitiesQuestionPayload: {
        data: {
          attributes: {next_question_id, previous_question_id},
        },
      },
      dispatch,
      navigation: {
        state: {
          params: {activityId, projectUserId},
        },
      },
    } = this.props;
    const progress = type === 'next' ? next_question_id : previous_question_id;
    const projectUserPayload = {
      data: {
        attributes: {
          progress,
        },
        id: String(project_user_activity_id),
        type: 'project_user_activities',
      },
    };
    dispatch(
      patchProjectUserApi(project_user_activity_id, projectUserPayload),
    ).then(() => {
      dispatch(
        getProjectUserMentorActivitiesQuestion(projectUserId, activityId),
      ).then((res) => {
        const {
          data: {
            attributes: {current_question_id},
            id,
          },
        } = res;
        dispatch(getActivityCurrentQuestion(current_question_id, id));
      });
    });
  };

  goBack = () => {
    const {
      navigation: {goBack},
    } = this.props;
    goBack();
  };

  render() {
    const {
      projectUserMentorActivityPayload,
      fetching,
      activityHeaderData,
      categories,
      currentQuestionPayload,
      questionData,
      projectUserMentorActivitiesQuestionPayload,
    } = this.props;
    if (
      projectUserMentorActivityPayload &&
      activityHeaderData &&
      currentQuestionPayload &&
      currentQuestionPayload.data.length > 0 &&
      questionData
    ) {
      const {
        data: {
          attributes: {
            current_question_position,
            num_questions,
            next_question_id,
            previous_question_id,
          },
        },
      } = projectUserMentorActivitiesQuestionPayload;
      const {
        activityData: {
          attributes: {title, intro, image_id, video_type, video_id},
        },
      } = activityHeaderData;
      const {
        question: {
          attributes: {text, type_of},
        },
      } = questionData;
      const {
        data: [
          {
            attributes: {state},
          },
        ],
      } = currentQuestionPayload;
      let videoUrl = '';
      if (video_id) {
        if (video_type === 'youtube') {
          videoUrl = `https://www.youtube.com/embed/${video_id}`;
        } else {
          videoUrl = `https://player.vimeo.com/video/${video_id}`;
        }
      }
      return (
        <Container containerStyle={styles.container} fetching={fetching}>
          <KeyboardAwareScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <LinearGradientBackground
              colors={['#025b9e', '#28e9d9']}
              useAngle
              angle={90}
              angleCenter={{
                x: 0.5,
                y: 0.5,
              }}>
              <ImageBackground
                source={Icon.WHITE_DIAMOND_IMAGE}
                style={styles.imageBackground}
                resizeMode="stretch">
                <View style={styles.categoryTitleTextView}>
                  <View style={styles.categoryQuestionTextView}>
                    <Text
                      style={[
                        styles.categoryText_ouestion,
                        styles.questionStyle,
                      ]}>
                      {`Question ${current_question_position} of ${num_questions}`}
                    </Text>
                  </View>
                  <Text style={[styles.categoryText]}>
                    {categories.join(', ')}
                  </Text>
                </View>
              </ImageBackground>
            </LinearGradientBackground>
            <View style={styles.imageVideoContainer}>
              {image_id && image_id !== '' ? (
                <Image
                  style={styles.imageContainer}
                  source={{uri: `${Config.IMAGE_SERVER_CDN}/${image_id}`}}
                  resizeMode="contain"
                />
              ) : null}
              <Text style={styles.titleText}>{title}</Text>
              <View style={styles.introText}>
                <HtmlRenderer
                  baseFontStyle={styles.holdingDetail}
                  html={intro}
                />
              </View>
              {video_id && (
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
                  containerStyles={
                    Platform.OS === 'android'
                      ? styles.webViewContainer
                      : styles.webViewContainerIos
                  }
                  videoHeight={deviceHeight * 0.3}
                  videoWidth={
                    Platform.OS === 'android'
                      ? deviceWidth * 0.85
                      : deviceWidth * 0.85
                  }
                  parentViewStyle={styles.videoContainer}
                />
              )}
            </View>
            <View style={styles.questionBackground}>
              <View style={[styles.htmlQuestionView]}>
                <HtmlRenderer
                  html={text}
                  baseFontStyle={styles.baseFontStyle}
                  imagesInitialDimensions={styles.imagesInitialDimensions}
                />
              </View>
              <View style={styles.htmlMCQView}>
                {type_of === 'multiple' ? (
                  <View style={styles.mcqContainer}>
                    <Text style={[styles.baseFontStyle]}>
                      Select the correct answer
                    </Text>
                    <FlatList
                      data={questionData.answers}
                      extraData={this.state}
                      style={{width: '100%'}}
                      renderItem={({item, index}) => (
                        <McqAnswerComponent
                          item={item}
                          index={index}
                          onRowItemSelect={this.onRowItemSelect}
                          answerIdArray={this.state.answerIdArray}
                          condition={state !== 'completed'}
                        />
                      )}
                      keyExtractor={(data, dataIndex) => dataIndex.toString()}
                    />
                  </View>
                ) : (
                  <AuthTextInput
                    multiline
                    editable={state !== 'completed'}
                    value={this.state.answerString}
                    onChangeText={(answerString) =>
                      this.setState({answerString})
                    }
                    textStyle={styles.textStyle}
                    placeholder="Start typing your answer here"
                  />
                )}
                <View style={styles.prevNextContainer}>
                  {previous_question_id && (
                    <Button
                      accessible
                      accessibilityLabel="Submit"
                      accessibilityRole="button"
                      style={styles.submitButton}
                      onPress={() => this.onPressNextOrPrevButton('prev')}>
                      <Text style={[styles.baseFontStyle, styles.fontStyle]}>
                        Previous
                      </Text>
                    </Button>
                  )}
                  {next_question_id && (
                    <Button
                      accessible
                      accessibilityLabel="Next"
                      accessibilityRole="button"
                      style={styles.submitButton}
                      onPress={() => this.onPressNextOrPrevButton('next')}>
                      <Text style={[styles.baseFontStyle, styles.fontStyle]}>
                        Next
                      </Text>
                    </Button>
                  )}
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Container>
      );
    }
    return <Container fetching={fetching} />;
  }
}

ActivitiesMentorQuestionScreen.defaultProps = {
  navigation: null,
  activityHeaderData: null,
  currentQuestionPayload: null,
  categories: null,
  questionData: null,
  fetching: false,
  projectUserMentorActivityPayload: null,
  projectUserMentorActivitiesQuestionPayload: null,
};

ActivitiesMentorQuestionScreen.propTypes = {
  navigation: PropTypes.object,
  categories: PropTypes.array,
  questionData: PropTypes.object,
  activityHeaderData: PropTypes.object,
  currentQuestionPayload: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  projectUserMentorActivityPayload: PropTypes.object,
  projectUserMentorActivitiesQuestionPayload: PropTypes.object,
};
const mapStateToProps = (state) => ({
  fetching: state.mentorActivities.fetching || state.menteeActivities.fetching,
  questionData: state.menteeActivities.questionData,
  currentQuestionPayload: state.menteeActivities.currentQuestionPayload,
  activityHeaderData: state.mentorActivities.activityHeaderData,
  categories: state.mentorActivities.categories,
  projectUserMentorActivityPayload:
    state.mentorActivities.projectUserMentorActivityPayload,
  projectUserMentorActivitiesQuestionPayload:
    state.mentorActivities.projectUserMentorActivitiesQuestionPayload,
});

export default connect(mapStateToProps)(ActivitiesMentorQuestionScreen);
