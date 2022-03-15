import React, {Component} from 'react';
import {
  Dimensions,
  ImageBackground,
  Text,
  View,
  Image,
  Platform,
  BackHandler,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {IGNORED_TAGS} from 'react-native-render-html/src/HTMLUtils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  AuthTextInput,
  Button,
  Container,
  HtmlRenderer,
  Video,
} from '../../components';
import {
  getProjectUserActivitiesQuestion,
  getActivityCurrentQuestion,
  patchProjectUserApi,
  patchAttemptedQuestionApi,
  postStartQuestionApi,
  getMenteeActivities,
  getProjectUserActivities,
} from '../../modules/activitiesMentee';
import LinearGradientBackground from '../../components/LinearGradient';
import Icon from '../../utility/icons';
import Config from '../../utility/config';
import McqAnswerComponent from './mcqQuestionComponent';
import {errorHandler} from '../../modules/errorHandler';
import {activityQuestionNavigationOptions} from '../../navigators/Root';
import styles from './questionScreenStyles';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export const navigationOption = ({navigation}) => ({
  ...activityQuestionNavigationOptions(
    navigation.state.params.handleBackButtonNavigation,
  ),
});

class ActivitiesQuestionScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    ...navigationOption({navigation}),
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
          params: {activityId},
        },
        setParams,
      },
      dispatch,
    } = this.props;
    setParams({handleBackButtonNavigation: this.handleBackPress});
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
    dispatch(getProjectUserActivitiesQuestion(1, activityId)).then((res) => {
      const {
        data: [
          {
            attributes: {current_question_id, first_question_id},
            id,
          },
        ],
      } = res;
      const currentQuestionId = current_question_id;
      dispatch(getActivityCurrentQuestion(currentQuestionId, id)).then(
        (response) => {
          if (response.data.length === 0) {
            const payload = {
              data: {
                attributes: {
                  project_user_activity_id: id,
                  question_id: currentQuestionId,
                },
                type: 'attempted_questions',
              },
            };
            dispatch(postStartQuestionApi(payload)).then(() => {
              dispatch(getActivityCurrentQuestion(currentQuestionId, id));
            });
          }
        },
      );
    });
  }
  componentDidUpdate(prevProps) {
    const {currentQuestionPayload} = this.props;
    if (
      prevProps.currentQuestionPayload !== currentQuestionPayload &&
      currentQuestionPayload &&
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
  componentWillUnmount() {
    this.backHandler.remove();
  }

  validateUrl = (answer) => {
    const array = answer.split(' ');
    const checkUrl = array.some((item) =>
      /^(https?):\/\/[^\s$.?#].[^\s]*$/.test(item),
    );
    return checkUrl;
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
      projectUserActivityQuestionPayload: {
        data: [
          {
            attributes: {next_question_id, previous_question_id},
          },
        ],
      },
      dispatch,
      navigation: {
        state: {
          params: {activityId},
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
    ).then((response) => {
      dispatch(getProjectUserActivitiesQuestion(1, activityId)).then((res) => {
        const {
          data: [
            {
              attributes: {current_question_id},
              id,
            },
          ],
        } = res;
        dispatch(getActivityCurrentQuestion(current_question_id, id));
      });
    });
  };
  onSubmitAnswer = () => {
    const {
      questionData: {
        question: {
          attributes: {type_of, number_correct_answers},
        },
        answers,
      },
      dispatch,
      currentQuestionPayload: {
        data: [
          {
            attributes: {project_user_activity_id},
            id,
          },
        ],
      },
      projectUserActivityQuestionPayload,
      navigation: {
        state: {
          params: {activityId},
        },
        goBack,
        setParams,
      },
    } = this.props;
    const {answerIdArray, answerString} = this.state;
    const {
      data: [
        {
          attributes: {next_question_id, first_question_id},
        },
      ],
    } = projectUserActivityQuestionPayload;
    let answer;
    if (type_of === 'multiple') {
      if (answerIdArray.length === 0) {
        return dispatch(errorHandler('Please select an option'));
      }
      const flag = answers.every((item) => {
        if (item.attributes.correct) {
          if (!answerIdArray.includes(item.id)) {
            return false;
          }
        } else if (answerIdArray.includes(item.id)) {
          return false;
        }
        return true;
      });
      if (!flag || answerIdArray.length !== number_correct_answers) {
        this.setState({answerIdArray: []});
        return dispatch(errorHandler('Your answer is incorrect'));
      }
      answer = answerIdArray;
    } else if (type_of === 'text' && answerString.trim() === '') {
      return dispatch(errorHandler('Please enter an answer'));
    } else if (this.validateUrl(answerString)) {
      return dispatch(errorHandler('Links not allowed in answer'));
    } else {
      answer = answerString;
    }
    const payload = {
      data: {
        attributes:
          typeof answer === 'string' ? {answer} : {answer_ids: answer},
        id,
        type: 'attempted_questions',
      },
    };
    setParams({activityQuestionStatus: true});
    return dispatch(patchAttemptedQuestionApi(id, payload))
      .then(() => {
        const projectUserPayload = {
          data: {
            attributes: {
              progress: next_question_id || first_question_id,
            },
            id: String(project_user_activity_id),
            type: 'project_user_activities',
          },
        };
        dispatch(
          patchProjectUserApi(project_user_activity_id, projectUserPayload),
        ).then(() => {
          if (next_question_id) {
            return dispatch(
              getProjectUserActivitiesQuestion(1, activityId),
            ).then((res) => {
              const {
                data: [
                  {
                    attributes: {current_question_id},
                  },
                ],
                data,
              } = res;
              dispatch(
                getActivityCurrentQuestion(current_question_id, data[0].id),
              ).then((response) => {
                if (response.data.length === 0) {
                  const requestPayload = {
                    data: {
                      attributes: {
                        project_user_activity_id,
                        question_id: current_question_id,
                      },
                      type: 'attempted_questions',
                    },
                  };
                  dispatch(postStartQuestionApi(requestPayload)).then(() => {
                    this.setState({answerIdArray: [], answerString: ''});
                    dispatch(
                      getActivityCurrentQuestion(
                        current_question_id,
                        data[0].id,
                      ),
                    );
                  });
                }
              });
            });
          }
          return dispatch(getMenteeActivities(1)).then(() =>
            dispatch(getProjectUserActivities()).then(() => {
              goBack();
            }),
          );
        });
      })
      .catch((error) => {
        if (
          error.data.errors[0].title ===
          'translation missing: en.activerecord.errors.models.attempted_question.attributes.answer.not_allowed_links'
        ) {
          dispatch(errorHandler('Links not allowed in answer'));
        }
      });
  };

  onRowItemSelect = (id) => {
    const {answerIdArray} = this.state;
    if (answerIdArray.includes(id)) {
      const UpdatedIds = answerIdArray.filter((itemId) => itemId !== id);
      this.setState({answerIdArray: UpdatedIds});
    } else {
      this.setState({answerIdArray: [...new Set([...answerIdArray, id])]});
    }
  };
  onRejectedAnswer = () => {
    const {
      currentQuestionPayload: {
        data: [
          {
            attributes: {stopwords},
          },
        ],
      },
      dispatch,
    } = this.props;
    const {answerString} = this.state;
    const stopWordsArray = stopwords.split(', ');
    const cond = stopWordsArray.some((item) => answerString.includes(item));
    if (cond) {
      dispatch(
        errorHandler(
          `This activity has been rejected due to following '${stopwords}' stopwords. Please review it and submit the activity again`,
        ),
      );
    } else {
      this.onSubmitAnswer();
    }
  };
  handleBackButtonNavigation = () => {
    const {
      navigation: {goBack},
      dispatch,
    } = this.props;
    goBack();
    dispatch(getMenteeActivities(1)).then(() => {
      dispatch(getProjectUserActivities());
    });
  };

  handleBackPress = () => {
    const {
      navigation: {
        goBack,
        state: {
          params: {activityQuestionStatus},
        },
      },
      enablebackButton,
      dispatch,
    } = this.props;
    dispatch(errorHandler());
    if (!enablebackButton) {
      return true;
    }
    if (activityQuestionStatus) {
      return this.handleBackButtonNavigation();
    }
    return goBack();
  };

  render() {
    const {
      projectUserActivityQuestionPayload,
      fetching,
      activityHeaderData,
      categories,
      currentQuestionPayload,
      questionData,
    } = this.props;
    if (
      projectUserActivityQuestionPayload &&
      activityHeaderData &&
      currentQuestionPayload &&
      currentQuestionPayload.data.length > 0 &&
      questionData
    ) {
      const {
        data: [
          {
            attributes: {
              current_question_position,
              num_questions,
              next_question_id,
              previous_question_id,
              state,
            },
          },
        ],
      } = projectUserActivityQuestionPayload;
      const {
        activityData: {
          attributes: {
            title,
            intro,
            image_id,
            category_ids,
            video_type,
            video_id,
          },
        },
      } = activityHeaderData;
      const {
        question: {
          attributes: {text, type_of},
        },
      } = questionData;
      const {
        data: [{attributes}],
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
                        {alignSelf: 'center'},
                      ]}>
                      {`Question ${current_question_position} of ${num_questions}`}
                    </Text>
                  </View>
                  <Text style={[styles.categoryText]}>
                    {category_ids
                      .map((item) => categories[String(item)])
                      .join(', ')}
                  </Text>
                </View>
              </ImageBackground>
            </LinearGradientBackground>
            <View style={styles.imageVideoContainer} accessible={false}>
              {typeof image_id === 'string' && image_id.trim() !== '' && (
                <Image
                  accessible
                  accessibilityLabel="activity"
                  accessibilityRole="image"
                  style={styles.imageContainer}
                  source={{uri: `${Config.IMAGE_SERVER_CDN}/${image_id}`}}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.title_Text}>{title}</Text>
              <View style={styles.intro_Text}>
                <HtmlRenderer
                  accessible
                  accessibilityLabel={intro}
                  accessibilityRole="text"
                  baseFontStyle={styles.holding_Detail}
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
              <View
                style={styles.htmlQuestionView}
                accessible
                accessibilityLabel="activity"
                accessibilityRole="image">
                <HtmlRenderer
                  accessible
                  accessibilityLabel={text ? {text} : null}
                  html={text}
                  baseFontStyle={styles.baseFontStyle}
                  ignoredStyles={[...IGNORED_TAGS, 'height', 'width']}
                  tagsStyles={{
                    img: styles.tagStyles,
                    p: styles.tagStyles_p,
                  }}
                  imagesInitialDimensions={styles.imagesInitialDimensions}
                />
              </View>
              <View style={styles.htmlMCQView}>
                {type_of === 'multiple' ? (
                  <View style={styles.mcqContainer}>
                    <Text style={styles.baseFontStyle}>
                      Select the correct answer
                    </Text>
                    <View style={styles.mcqComponent}>
                      <FlatList
                        data={questionData.answers}
                        extraData={this.state}
                        bounces={false}
                        renderItem={({item, index}) => (
                          <McqAnswerComponent
                            item={item}
                            index={index}
                            onRowItemSelect={this.onRowItemSelect}
                            answerIdArray={this.state.answerIdArray}
                            condition={attributes.state !== 'completed'}
                          />
                        )}
                        keyExtractor={(data, dataIndex) => dataIndex.toString()}
                      />
                    </View>
                  </View>
                ) : (
                  <AuthTextInput
                    multiline
                    editable={attributes.state !== 'completed'}
                    value={this.state.answerString}
                    onChangeText={(answerString) =>
                      this.setState({answerString})
                    }
                    textStyle={styles.textStyle}
                    placeholder="Start typing your answer here"
                  />
                )}
                {attributes.state !== 'completed' ? (
                  <View style={styles.submit_Button}>
                    <Button
                      accessible
                      accessibilityLabel="Submit"
                      accessibilityRole="button"
                      style={styles.submitButton}
                      onPress={
                        attributes.state !== 'rejected'
                          ? this.onSubmitAnswer
                          : this.onRejectedAnswer
                      }>
                      <Text style={[styles.buttonFontStyle, styles.fontStyle]}>
                        Submit
                      </Text>
                    </Button>
                  </View>
                ) : (
                  <View style={styles.prevNextContainer}>
                    {previous_question_id && (
                      <Button
                        accessible
                        accessibilityLabel="Previous"
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
                )}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Container>
      );
    }
    return <Container fetching={fetching} />;
  }
}

ActivitiesQuestionScreen.defaultProps = {
  navigation: null,
  activityHeaderData: null,
  currentQuestionPayload: null,
  categories: null,
  questionData: null,
  fetching: false,
  projectUserActivityQuestionPayload: null,
};

ActivitiesQuestionScreen.propTypes = {
  navigation: PropTypes.object,
  categories: PropTypes.object,
  questionData: PropTypes.object,
  activityHeaderData: PropTypes.object,
  currentQuestionPayload: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  projectUserActivityQuestionPayload: PropTypes.object,
  enablebackButton: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  fetching: state.menteeActivities.fetching,
  categories: state.menteeActivities.categories,
  activities: state.menteeActivities.activities,
  questionData: state.menteeActivities.questionData,
  activityHeaderData: state.menteeActivities.activityHeaderData,
  currentQuestionPayload: state.menteeActivities.currentQuestionPayload,
  projectUserActivityQuestionPayload:
    state.menteeActivities.projectUserActivityQuestionPayload,
  enablebackButton: state.menteeActivities.enablebackButton,
});

export default connect(mapStateToProps)(ActivitiesQuestionScreen);
