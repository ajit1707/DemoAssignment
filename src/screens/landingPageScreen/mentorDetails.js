import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import Style from './Styles';
import {Container} from '../../components';
import {fontMaker} from '../../utility/helper';
import Color from '../../utility/colorConstant';
import {omit} from 'lodash';
import {errorHandler} from '../../modules/errorHandler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Config from '../../utility/config';
import {projectMatch, postMentorFile} from '../../modules/typeformMentee';
import {chooseAsMentorOptions} from '../../navigators/Root';
import Dialog, {
  DialogButton,
  DialogContent,
  DialogFooter,
  DialogTitle,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import {getUserDetails} from '../../modules/getUserDetail';
import {channelsUser} from '../../modules/channelsUser';
import {getChannels} from '../../modules/getChannels';
import {chosseYourMentorData} from '../../modules/chosseAsMentor';
import Toast from 'react-native-simple-toast';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const imageHeight = 50;
const imageWidth = 50;
const imageBorderRadius = 120;
const borderRadius = 98;

export const navigationOption = ({navigation}) => ({
  ...chooseAsMentorOptions(navigation.state.params.handleBackButtonNavigation),
});
class MentorDetailsScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    ...navigationOption({navigation}),
  });
  constructor(props) {
    super(props);
    this.state = {
      similarChoice: [],
      text: [],
      visible: false,
    };
  }
  componentDidMount() {
    const {
      navigation: {setParams},
    } = this.props;
    setParams({handleBackButtonNavigation: this.handleBackPress});
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }
  handleBackPress = () => {
    const {
      navigation: {goBack, navigate},
      dispatch,
      matchingMentorPayload,
      chooseYourMentor,
    } = this.props;
    dispatch(errorHandler());
    const payload = {
      data: {
        type: matchingMentorPayload.data.type,
        attributes: {
          respondent_id: matchingMentorPayload.data.attributes.respondent_id,
          project_id: matchingMentorPayload.data.attributes.project_id,
        },
      },
    };
    dispatch(postMentorFile(payload)).then((res) => {
      if (
        res &&
        res.data &&
        res.data.data &&
        res.data.data.attributes &&
        res.data.data.attributes.potential_matching_users.length === 0
      ) {
        Toast.showWithGravity(
          'Mentor Matching Tool - needs a top-up!\n' +
            "All the mentors on this project have already been snapped up! We'll allocate more amazing mentors very soon and notify you when you can try again!",
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
      navigate('MenteeQuestionScreen');
    });
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  matchProjectUsers = () => {
    const {
      matchingMentorPayload,
      userDetailPayload,
      dispatch,
      navigation: {navigate},
      screenProps,
    } = this.props;
    this.setState({
      visible: false,
    });
    dispatch(getUserDetails());
    dispatch(getChannels());
    dispatch(channelsUser());
    const payload = {
      data: {
        type: 'project_matches',
        attributes: {
          mentor_id: matchingMentorPayload.data.attributes.mentor_id,
          mentee_id: userDetailPayload.data[0].id,
          project_id: matchingMentorPayload.data.attributes.project_id,
        },
      },
    };
    dispatch(projectMatch(payload, navigate, screenProps));
  };
  renderTitle = () => (
    <DialogTitle
      title="Are you sure?"
      textStyle={styles.modalText}
      hasTitleBar={false}
    />
  );
  renderFooter = () => (
    <DialogFooter>
      <TouchableOpacity
        accessible
        accessibilityLabel="Cancel"
        accessibilityRole="button"
        style={styles.leftButton}
        onPress={() => this.resetState()}>
        <Text style={styles.leftButtonStyle}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessible
        accessibilityLabel="Confirm"
        accessibilityRole="button"
        style={styles.rightButton}
        onPress={() => this.matchProjectUsers()}>
        <Text style={styles.rightButtonStyle}>Confirm</Text>
      </TouchableOpacity>
    </DialogFooter>
  );
  changeState = () =>
    this.setState({
      visible: true,
    });
  resetState = () =>
    this.setState({
      visible: false,
    });
  render() {
    const {
      matchingMentorPayload,
      navigation: {
        state: {params},
      },
      fetching,
    } = this.props;
    let image = '';
    let mentorData = '';
    let mentorDetails = '';
    let matchingQuestions = [];
    let Details = '';
    let name = '';
    let rank = '';
    if (
      matchingMentorPayload &&
      matchingMentorPayload.data &&
      matchingMentorPayload.hasOwnProperty('data') &&
      matchingMentorPayload.data.attributes &&
      matchingMentorPayload.data.hasOwnProperty('attributes')
    ) {
      mentorData =
        matchingMentorPayload.data.attributes.potential_matching_users[0];
      if (mentorData && mentorData.data && mentorData.data.length) {
        const data = mentorData.data;
        name = mentorData.display_name;
        rank = mentorData.rank;
        matchingQuestions = [];
        if (data && data.length) {
          for (let i = 0; i < data.length; i += 1) {
            const value = {};
            let mentee = [],
              mentor = [];
            const title = data[i].question.title;
            if (data[i].answers.mentee.answer_type === 'choice') {
              mentee = data[i].answers.mentee.choice;
            } else {
              mentee = data[i].answers.mentee.choices;
            }
            if (data[i].answers.mentor.answer_type === 'choice') {
              mentor = data[i].answers.mentor.choice;
            } else {
              mentor = data[i].answers.mentor.choices;
            }
            const caseInsenstiveAnswer = mentee.filter((element) => {
              for (let j = 0; j < mentor.length; j += 1) {
                const menteeAnswer = element.toString();
                const mentorAnswer = mentor[i];
                if (mentorAnswer !== undefined) {
                  if (
                    menteeAnswer.toLowerCase() == mentorAnswer.toLowerCase()
                  ) {
                    return mentor[i];
                  }
                }
              }
            });
            const intersection = mentee.filter((element) =>
              mentor.includes(element),
            );
            if (
              (intersection && intersection.length) ||
              (caseInsenstiveAnswer && caseInsenstiveAnswer.length)
            ) {
              value.question = title;
              if (intersection && intersection.length) {
                value.answers = intersection;
              } else {
                value.answers = caseInsenstiveAnswer;
              }
              matchingQuestions.push(value);
            }
          }
        }
        Details = omit(mentorData, [
          'score',
          'match_percentage',
          'user_biography',
          'biography',
          'mentor_response_id',
          'data',
          'rank',
          'name',
          'position',
          'mentor_id',
          'languages',
          'avatar_id',
          'display_name',
        ]);
        mentorDetails = Object.keys(Details);
        if (mentorData.avatar_id.includes('brightside-assets')) {
          image = `${Config.IMAGE_SERVER_CDN}resize/500x500/${mentorData.avatar_id}`;
        } else {
          image = mentorData.avatar_id;
        }
      }
    }
    return (
      <Container style={styles.mainContainer} fetching={fetching}>
        <ScrollView>
          <View style={styles.viewContainer} accessible={false}>
            <View style={styles.card} accessible={false}>
              <View
                style={styles.imageMentor}
                accessible
                accessibilityLabel={`Profile picture of ${name}`}
                accessibilityRole="image">
                <Image style={styles.img} source={{uri: image}} />
              </View>
              <View
                style={styles.wordstyle}
                accessible
                accessibilityLabel={`Mentor rank ${rank}`}>
                <Text style={styles.number}>{rank}</Text>
              </View>

              <View style={styles.detailContainer}>
                <View style={styles.userName}>
                  {mentorData && mentorData.display_name && (
                    <Text style={styles.displayname}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Text>
                  )}
                  {mentorData &&
                    mentorData.hasOwnProperty('position') &&
                    mentorData.user_biography &&
                    mentorData.user_biography.trim() !== '' && (
                      <Text style={styles.postion}>{mentorData.position}</Text>
                    )}
                </View>
                {mentorData &&
                  mentorData.hasOwnProperty('user_biography') &&
                  mentorData.user_biography &&
                  mentorData.user_biography.trim() !== '' && (
                    <View style={styles.bio}>
                      <Text style={styles.postion}>
                        {mentorData.user_biography}
                      </Text>
                    </View>
                  )}
                {mentorData &&
                  mentorData.data &&
                  mentorData.data.length &&
                  mentorDetails &&
                  mentorDetails.map((key) => (
                    <Text style={styles.postion}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
                      {Details[key]}
                    </Text>
                  ))}
              </View>
              {mentorData &&
                mentorData.match_percentage > 0 &&
                ((mentorData.hasOwnProperty('user_biography') &&
                  mentorData.user_biography &&
                  mentorData.user_biography.trim() !== '' &&
                  Object.keys(mentorData.user_biography).length > 400) ||
                  (mentorData.hasOwnProperty('education') &&
                    mentorData.education.trim() !== '' &&
                    Object.keys(mentorData.education).length > 400)) && (
                  <View style={styles.detailContainerMcq}>
                    <View style={styles.mcqView}>
                      <Text style={styles.compatibilityBio}>Compatibility</Text>
                      <Text style={styles.commonBio}>
                        Find out what you have in common
                      </Text>
                    </View>
                    {matchingQuestions.map((questionAnswer) => (
                      <View>
                        <Text style={styles.questionMcq}>
                          {questionAnswer.question}
                        </Text>
                        {questionAnswer.answers.map((answer) => (
                          <View style={styles.choiceContainer}>
                            <AntDesign
                              name="checkcircle"
                              size={15}
                              color="rgb(242, 146, 13)"
                              accessibilityLabel="Image file"
                              accessible
                            />
                            <Text style={styles.mcqAnswer}>{answer}</Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                )}
              {mentorData &&
                mentorData.match_percentage > 0 &&
                ((mentorData.hasOwnProperty('user_biography') &&
                  mentorData.user_biography &&
                  mentorData.user_biography.trim() !== '' &&
                  Object.keys(mentorData.user_biography).length < 400) ||
                  (mentorData.hasOwnProperty('education') &&
                    mentorData.education.trim() !== '' &&
                    Object.keys(mentorData.education).length < 400)) && (
                  <View style={styles.detailContainerMcq}>
                    <View style={styles.mcqView}>
                      <Text style={styles.Compatibility}>Compatibility</Text>
                      <Text style={styles.common}>
                        Find out what you have in common
                      </Text>
                    </View>
                    {matchingQuestions.map((questionAnswer) => (
                      <View>
                        <Text style={styles.questionMcq}>
                          {questionAnswer.question}
                        </Text>
                        {questionAnswer.answers.map((answer) => (
                          <View style={styles.choiceContainer}>
                            <AntDesign
                              name="checkcircle"
                              size={15}
                              color="rgb(242, 146, 13)"
                              accessibilityLabel="Image file"
                              accessible
                            />
                            <Text style={styles.mcqAnswer}>{answer}</Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                )}
              <View style={styles.buttonComponent}>
                <View
                  style={styles.button}
                  accessible
                  accessibilityLabel="Choose as mentor"
                  accessibilityRole="button">
                  <TouchableOpacity
                    onPress={() => this.changeState()}
                    accessible={false}>
                    <Text style={styles.buttonText} accessible={false}>
                      Choose as mentor
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <Dialog
            accessible
            visible={this.state.visible}
            useNativeDriver
            hasOverlay
            overlayOpacity={0.6}
            overlayBackgroundColor="rgba(0, 0, 0, 0.4)"
            width={deviceWidth * 0.85}
            dialogTitle={this.renderTitle()}
            dialogAnimation={
              new ScaleAnimation({
                initialValue: 0,
                useNativeDriver: true,
              })
            }
            footer={this.renderFooter()}>
            <DialogContent style={Style.dialogContainer}>
              <Text style={Style.messageStyle}>
                Please confirm your choice of mentor or click cancel to select
                again. Once confirmed you will be matched instantly and your new
                mentor will be notified.
              </Text>
              <Text style={Style.messageStyle}>
                If you wish to change your mentor after you've been matched, you
                will need to contact us via the Project Support channel.
              </Text>
            </DialogContent>
          </Dialog>
        </ScrollView>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: '5%',
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
    color: '#dc2727',
    ...fontMaker('semibold'),
  },
  rightButton: {
    textAlign: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  rightButtonStyle: {
    paddingLeft: 50,
    fontSize: 16,
    color: 'green',
    ...fontMaker('semibold'),
  },
  modalText: {
    fontSize: 18,
    ...fontMaker('bold'),
    color: '#000',
  },
  bio: {
    paddingVertical: '2%',
  },
  mcqAnswer: {
    marginLeft: '3%',
    fontSize: 16,
    marginRight: '3%',
  },
  questionMcq: {
    marginTop: '2%',
    ...fontMaker('bold'),
    fontSize: 16,
  },
  choiceContainer: {
    flexDirection: 'row',
    marginTop: '3%',
  },
  buttonTextCancel: {
    color: '#dc2727',
  },
  buttonTextConfirm: {
    color: 'green',
  },
  imageMentor: {
    zIndex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  mcqView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#AAABAC',
  },
  Compatibility: {
    fontSize: 20,
    color: 'rgba(0,0,0,0.5)',
    ...fontMaker('semibold'),
    marginBottom: '1%',
  },
  common: {
    fontSize: 18,
    color: 'rgba(0,0,0,0.5)',
    marginBottom: '4%',
  },
  compatibilityBio: {
    fontSize: 20,
    color: 'rgba(0,0,0,0.5)',
    ...fontMaker('semibold'),
    marginBottom: '1%',
    marginTop: '4%',
  },
  commonBio: {
    fontSize: 18,
    color: 'rgba(0,0,0,0.5)',
    marginBottom: '10%',
  },
  userName: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#AAABAC',
    marginBottom: '2%',
    marginTop: -10,
  },
  displayname: {
    fontSize: 20,
    ...fontMaker('bold'),
  },
  postion: {
    fontSize: 18,
    color: '#AAABAC',
  },
  numberOfMentors: {
    alignItems: 'center',
    color: '#E5E5E5',
    ...fontMaker('bold'),
  },
  detailContainer: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    paddingHorizontal: '3%',
    paddingTop: '10%',
    paddingBottom: '3%',
    marginBottom: '4%',
    zIndex: 0,
    marginTop: -22,
  },
  detailContainerMcq: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    paddingHorizontal: '3%',
    paddingVertical: '3%',
    marginBottom: '4%',
    flexGrow: 1,
  },
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginLeft: 18,
  },
  card: {
    backgroundColor: '#fff',
    width: '98%',
  },
  img: {
    width: Platform.OS === 'ios' ? '59%' : '60%',
    height: Platform.OS === 'ios' ? deviceWidth * 0.515 : deviceWidth * 0.5,
    resizeMode: 'cover',
    borderRadius: Platform.OS === 'ios' ? borderRadius : imageBorderRadius,
  },
  textContainer: {
    marginLeft: '4%',
  },
  title: {
    color: '#666',
    ...fontMaker('bold'),
    fontSize: 18,
    marginVertical: '3%',
  },
  textTitle: {
    color: '#E5E5E5',
    fontSize: 15,
    marginVertical: '1%',
    ...fontMaker('bold'),
  },
  wordstyle: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    backgroundColor: '#e28834',
    marginLeft: deviceWidth * 0.37,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
    zIndex: 99,
  },
  number: {
    color: '#fff',
    ...fontMaker('bold'),
    fontSize: 20,
  },
  startView: {
    marginTop: '4%',
    backgroundColor: '#fff',
  },
  titleStart: {
    color: '#666',
    ...fontMaker('bold'),
    fontSize: 18,
    marginVertical: '3%',
    marginHorizontal: '8%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonComponent: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 2,
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
  },
  pressEnter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  modalViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSubView: {
    height: deviceHeight * 0.7,
    width: deviceWidth * 0.9,
    borderRadius,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    width: deviceWidth * 0.9,
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
  crossButton: {
    justifyContent: 'flex-end',
  },
});
const mapStateToProps = (state) => ({
  userDetailPayload: state.getUserDetail.userDetailPayload,
  matchingMentorPayload: state.typeformMenteeDataReducer.matchingMentorPayload,
  fetching: state.typeformMenteeDataReducer.fetching,
});

export default connect(mapStateToProps)(MentorDetailsScreen);
